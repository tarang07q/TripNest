import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { from, to, date, passengers } = body;

    if (!from || !to || !date || !passengers) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Search for flights in the database
    const flights = await db
      .collection('flights')
      .find({
        'departure.city': { $regex: from, $options: 'i' },
        'arrival.city': { $regex: to, $options: 'i' },
        date: date,
      })
      .toArray();

    // For demo purposes, if no flights found, return mock data
    if (flights.length === 0) {
      return NextResponse.json([
        {
          id: '1',
          airline: 'TripNest Airlines',
          flightNumber: 'TN123',
          departure: {
            city: from,
            airport: 'TNA',
            time: '10:00 AM',
          },
          arrival: {
            city: to,
            airport: 'TNB',
            time: '12:00 PM',
          },
          price: 299,
          duration: '2h',
          stops: 0,
        },
        {
          id: '2',
          airline: 'TripNest Airlines',
          flightNumber: 'TN456',
          departure: {
            city: from,
            airport: 'TNA',
            time: '2:00 PM',
          },
          arrival: {
            city: to,
            airport: 'TNB',
            time: '5:00 PM',
          },
          price: 199,
          duration: '3h',
          stops: 1,
        },
      ]);
    }

    return NextResponse.json(flights);
  } catch (error) {
    console.error('Error searching flights:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 