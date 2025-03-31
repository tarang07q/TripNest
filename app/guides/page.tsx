'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Guide {
  id: string;
  title: string;
  destination: string;
  description: string;
  image: string;
  author: string;
  date: string;
  categories: string[];
  content: {
    sections: {
      title: string;
      content: string;
    }[];
  };
}

export default function GuidesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchParams, setSearchParams] = useState({
    destination: '',
    category: '',
  });
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/guides/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to search guides');
      }

      setGuides(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Travel Guides</h1>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                  Destination
                </label>
                <input
                  type="text"
                  id="destination"
                  value={searchParams.destination}
                  onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter destination"
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  value={searchParams.category}
                  onChange={(e) => setSearchParams({ ...searchParams, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="culture">Culture</option>
                  <option value="food">Food</option>
                  <option value="nature">Nature</option>
                  <option value="adventure">Adventure</option>
                  <option value="history">History</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search Guides'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8">
            {error}
          </div>
        )}

        {/* Guide Results */}
        {guides.length > 0 && (
          <div className="space-y-6">
            {guides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="md:flex">
                  <div className="md:flex-shrink-0">
                    <img
                      className="h-48 w-full object-cover md:w-48"
                      src={guide.image}
                      alt={guide.title}
                    />
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{guide.title}</h2>
                        <p className="text-gray-500">{guide.destination}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">By {guide.author}</div>
                        <div className="text-sm text-gray-500">{guide.date}</div>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-600">{guide.description}</p>
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {guide.categories.map((category, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => router.push(`/guides/${guide.id}`)}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Read Guide
                      </button>
                    </div>
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