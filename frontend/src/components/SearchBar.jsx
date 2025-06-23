/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = () => {
    let title = '';
    let location = '';
    let amenities = [];

    // Split query into parts
    const words = query.toLowerCase().split(',').map(w => w.trim());

    words.forEach(word => {
      if (word.match(/pool|gym|wifi|parking|spa|ac|kitchen/)) {
        amenities.push(word);
      } else if (word.match(/delhi|mumbai|bangalore|hyderabad|goa|chennai|pune|kolkata/)) {
        location = word;
      } else {
        title = word;
      }
    });

    onSearch({ title, location, amenities, minPrice, maxPrice });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-6xl mx-auto px-4 py-6"
    >
      <div className="flex flex-col lg:flex-row flex-wrap items-stretch lg:items-end justify-center gap-4 bg-[#dfcea9] bg-opacity-90 backdrop-blur-md shadow-xl rounded-xl p-6 border border-[#321c16]">

        {/* Unified Search Field */}
        <div className="flex-1 min-w-[240px]">
          <label className="text-sm font-medium  text-[#8d5f35] normal-case">
            Search by Title, Location, or Amenity
          </label>
          <input
            type="text"
            placeholder="e.g. Cozy Villa, Mumbai, Pool, Gym"
            className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 bg-[#eee7d3] placeholder:text-[#784d30] text-[#784d30] focus:outline-none focus:ring-2 focus:ring-blue-500 normal-case"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Min Price */}
        <div className="w-full sm:w-36">
          <label className="text-sm font-medium text-gray-700 normal-case">Min Price</label>
          <input
            type="number"
            placeholder="₹ min"
            className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 bg-[#eee7d3] placeholder:text-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        {/* Max Price */}
        <div className="w-full sm:w-36">
          <label className="text-sm font-medium  text-gray-700 normal-case">Max Price</label>
          <input
            type="number"
            placeholder="₹ max"
            className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 bg-[#eee7d3] placeholder:text-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        {/* Search Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSearch}
          className="mt-2 lg:mt-0 w-full sm:w-auto bg-[#321c16] text-[#eee7d3] cursor-pointer font-semibold px-6 py-2 rounded-lg transition duration-300 hover:bg-[#eee7d3] hover:text-[#321c16]"
        >
          🔍 Search
        </motion.button>
      </div>
    </motion.div>
  );
}
