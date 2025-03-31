import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { location, pickUpDate, dropOffDate, pickUpTime, dropOffTime } = body;

    if (!location || !pickUpDate || !dropOffDate || !pickUpTime || !dropOffTime) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Search for cars in the database
    const cars = await db
      .collection('cars')
      .find({
        location: { $regex: location, $options: 'i' },
        available: true,
      })
      .toArray();

    // For demo purposes, if no cars found, return mock data
    if (cars.length === 0) {
      return NextResponse.json([
        {
          id: '1',
          name: 'Toyota Camry',
          type: 'Sedan',
          brand: 'Toyota',
          price: 49,
          image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          features: ['Bluetooth', 'GPS', 'Backup Camera', 'Cruise Control'],
          available: true,
          transmission: 'Automatic',
          seats: 5,
          luggage: 2,
        },
        {
          id: '2',
          name: 'Honda CR-V',
          type: 'SUV',
          brand: 'Honda',
          price: 69,
          image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          features: ['Bluetooth', 'GPS', 'Backup Camera', 'Cruise Control', 'Sunroof'],
          available: true,
          transmission: 'Automatic',
          seats: 5,
          luggage: 3,
        },
        {
          id: '3',
          name: 'BMW 3 Series',
          type: 'Luxury',
          brand: 'BMW',
          price: 89,
          image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          features: ['Bluetooth', 'GPS', 'Backup Camera', 'Cruise Control', 'Leather Seats', 'Premium Audio'],
          available: false,
          transmission: 'Automatic',
          seats: 5,
          luggage: 2,
        },
      ]);
    }

    return NextResponse.json(cars);
  } catch (error) {
    console.error('Error searching cars:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 