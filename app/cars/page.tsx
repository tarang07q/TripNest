'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Car {
  id: string;
  name: string;
  type: string;
  brand: string;
  price: number;
  image: string;
  features: string[];
  available: boolean;
  transmission: string;
  seats: number;
  luggage: number;
}

export default function CarsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchParams, setSearchParams] = useState({
    location: '',
    pickUpDate: '',
    dropOffDate: '',
    pickUpTime: '',
    dropOffTime: '',
  });
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/cars/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to search cars');
      }

      setCars(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (carId: string) => {
    if (!session) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'car',
          details: {
            carId,
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Rent a Car</h1>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Pick-up Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="City or Airport"
                  required
                />
              </div>
              <div>
                <label htmlFor="pickUpDate" className="block text-sm font-medium text-gray-700">
                  Pick-up Date
                </label>
                <input
                  type="date"
                  id="pickUpDate"
                  value={searchParams.pickUpDate}
                  onChange={(e) => setSearchParams({ ...searchParams, pickUpDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="pickUpTime" className="block text-sm font-medium text-gray-700">
                  Pick-up Time
                </label>
                <input
                  type="time"
                  id="pickUpTime"
                  value={searchParams.pickUpTime}
                  onChange={(e) => setSearchParams({ ...searchParams, pickUpTime: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="dropOffDate" className="block text-sm font-medium text-gray-700">
                  Drop-off Date
                </label>
                <input
                  type="date"
                  id="dropOffDate"
                  value={searchParams.dropOffDate}
                  onChange={(e) => setSearchParams({ ...searchParams, dropOffDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="dropOffTime" className="block text-sm font-medium text-gray-700">
                  Drop-off Time
                </label>
                <input
                  type="time"
                  id="dropOffTime"
                  value={searchParams.dropOffTime}
                  onChange={(e) => setSearchParams({ ...searchParams, dropOffTime: e.target.value })}
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
              {loading ? 'Searching...' : 'Search Cars'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8">
            {error}
          </div>
        )}

        {/* Car Results */}
        {cars.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <img
                  className="h-48 w-full object-cover"
                  src={car.image}
                  alt={car.name}
                />
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{car.name}</h2>
                      <p className="text-gray-500">{car.brand}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">${car.price}</div>
                      <div className="text-sm text-gray-500">per day</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        {car.seats} seats
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                        {car.luggage} bags
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                          />
                        </svg>
                        {car.transmission}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-900">Features</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {car.features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => handleBook(car.id)}
                      disabled={!car.available}
                      className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        car.available
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {car.available ? 'Book Now' : 'Not Available'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 