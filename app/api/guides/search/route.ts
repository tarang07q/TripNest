import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { destination, category } = body;

    if (!destination) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Build search query
    const query: any = {
      destination: { $regex: destination, $options: 'i' },
    };

    if (category) {
      query.categories = category;
    }

    // Search for guides in the database
    const guides = await db
      .collection('guides')
      .find(query)
      .toArray();

    // For demo purposes, if no guides found, return mock data
    if (guides.length === 0) {
      return NextResponse.json([
        {
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
                content: 'Paris, the capital of France, is known for its iconic landmarks and rich cultural heritage...',
              },
              {
                title: 'Hidden Gems',
                content: 'While the Eiffel Tower and Louvre are must-visit attractions, there are many lesser-known spots...',
              },
            ],
          },
        },
        {
          id: '2',
          title: 'Adventure Guide: Hiking in the Swiss Alps',
          destination: 'Swiss Alps',
          description: 'A comprehensive guide to hiking trails and outdoor activities in the Swiss Alps.',
          image: 'https://images.unsplash.com/photo-1506906731076-74ed55d96f8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          author: 'Michael Chen',
          date: 'March 10, 2024',
          categories: ['adventure', 'nature'],
          content: {
            sections: [
              {
                title: 'Getting Started',
                content: 'The Swiss Alps offer some of the most breathtaking hiking trails in Europe...',
              },
              {
                title: 'Best Trails',
                content: 'From beginner-friendly paths to challenging mountain routes...',
              },
            ],
          },
        },
      ]);
    }

    return NextResponse.json(guides);
  } catch (error) {
    console.error('Error searching guides:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 