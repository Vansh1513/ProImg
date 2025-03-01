import React, { useEffect } from 'react';
import { PinData } from '../context/PinContext';
import { GridLoader } from 'react-spinners';
import PinCard from '../components/PinCard';

const Home = () => {
  const { fetchPins, pins, loading } = PinData();

  useEffect(() => {
    fetchPins();
  }, [fetchPins]);

  // Loading component
  const Loading = () => (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <GridLoader size={24} className="text-emerald-500 animate-pulse mb-4" />
      <p className="text-gray-600 font-medium">Loading amazing pins...</p>
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <ImageIcon size={24} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">No pins yet</h3>
      <p className="text-gray-600 mb-6 max-w-md">
        Start creating your first pin or check back later for new content
      </p>
      <a 
        href="/create" 
        className="px-6 py-3 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition"
      >
        Create Your First Pin
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
      {loading ? (
        <Loading />
      ) : (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Discover Inspiration</h1>
          
          {pins && pins.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {pins.map((pin, i) => (
                <PinCard key={i} pin={pin} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      )}
    </div>
  );
};

export default Home;