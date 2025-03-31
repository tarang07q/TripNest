import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: 'Guide ID is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Find the guide by ID
    const guide = await db
      .collection('guides')
      .findOne({ id });

    // For demo purposes, if guide not found, return mock data
    if (!guide) {
      return NextResponse.json({
        id: '1',
        title: 'Exploring the Hidden Gems of Paris',
        destination: 'Paris, France',
        description: 'Discover the lesser-known attractions and local favorites in the City of Light.',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        author: 'Sarah Johnson',
        date: 'March 15, 2024',
        categories: ['culture', 'food', 'history'],
        content: {
          sections: [
            {
              title: 'Introduction',
              content: 'Paris, the capital of France, is known for its iconic landmarks and rich cultural heritage. While millions of tourists flock to the Eiffel Tower and Louvre Museum each year, there are countless hidden gems waiting to be discovered by the curious traveler.',
            },
            {
              title: 'Hidden Gems',
              content: 'While the Eiffel Tower and Louvre are must-visit attractions, there are many lesser-known spots that offer a more authentic Parisian experience. Here are some of our favorite hidden gems:\n\n1. Musée de la Chasse et de la Nature\n2. Passage des Panoramas\n3. Butte-aux-Cailles\n4. Musée des Arts et Métiers\n5. Parc des Buttes-Chaumont',
            },
            {
              title: 'Local Food Scene',
              content: 'Paris is a paradise for food lovers, and while the city is famous for its Michelin-starred restaurants, some of the best culinary experiences can be found in local bistros and markets. Here are some recommendations:\n\n- Marché d\'Aligre\n- Le Baratin\n- L\'Arpège\n- Chez L\'Ami Jean\n- Le Chateaubriand',
            },
          ],
        },
      });
    }

    return NextResponse.json(guide);
  } catch (error) {
    console.error('Error fetching guide:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 