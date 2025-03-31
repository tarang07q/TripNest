'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    city: string;
    airport: string;
    time: string;
  };
  arrival: {
    city: string;
    airport: string;
    time: string;
  };
  price: number;
  duration: string;
  stops: number;
}

export default function FlightsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1,
  });
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate date
    const selectedDate = new Date(searchParams.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setError('Please select a future date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to search flights');
      }

      setFlights(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (flightId: string) => {
    if (!session) {
      router.push('/login');
      return;
    }

    setBookingLoading(flightId);
    setError('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'flight',
          details: {
            flightId,
            ...searchParams,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create booking');
      }

      router.push('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setBookingLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Book Your Flight</h1>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="from" className="block text-sm font-medium text-gray-700">
                  From
                </label>
                <input
                  type="text"
                  id="from"
                  value={searchParams.from}
                  onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="City or Airport"
                  required
                />
              </div>
              <div>
                <label htmlFor="to" className="block text-sm font-medium text-gray-700">
                  To
                </label>
                <input
                  type="text"
                  id="to"
                  value={searchParams.to}
                  onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="City or Airport"
                  required
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={searchParams.date}
                  onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="passengers" className="block text-sm font-medium text-gray-700">
                  Passengers
                </label>
                <input
                  type="number"
                  id="passengers"
                  min="1"
                  max="9"
                  value={searchParams.passengers}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 1 && value <= 9) {
                      setSearchParams({ ...searchParams, passengers: value });
                    }
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search Flights'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8">
            {error}
          </div>
        )}

        {/* Flight Results */}
        {flights.length > 0 && (
          <div className="space-y-4">
            {flights.map((flight) => (
              <div
                key={flight.id}
                className="bg-white rounded-lg shadow p-6 flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold">{flight.airline}</span>
                    <span className="text-gray-500">{flight.flightNumber}</span>
                  </div>
                  <div className="mt-2 flex items-center space-x-8">
                    <div>
                      <div className="text-sm text-gray-500">Departure</div>
                      <div className="font-medium">{flight.departure.time}</div>
                      <div className="text-sm text-gray-500">{flight.departure.airport}</div>
                    </div>
                    <div className="text-gray-500">{flight.duration}</div>
                    <div>
                      <div className="text-sm text-gray-500">Arrival</div>
                      <div className="font-medium">{flight.arrival.time}</div>
                      <div className="text-sm text-gray-500">{flight.arrival.airport}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">${flight.price}</div>
                  <button
                    onClick={() => handleBook(flight.id)}
                    disabled={bookingLoading === flight.id}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {bookingLoading === flight.id ? 'Booking...' : 'Book Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 