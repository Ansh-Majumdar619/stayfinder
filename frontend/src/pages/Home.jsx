/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import Chatbot from '../components/Chatbot';
import SearchBar from '../components/SearchBar';
import { motion } from 'framer-motion';
import ScrollVelocity from '../ui/ScrollVelocity';

export default function Home() {
  const [listings, setListings] = useState([]);

  const fetchListings = async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/listings?${params}`);
      const data = res.data;

      if (Array.isArray(data)) {
        setListings(data);
      } else if (Array.isArray(data.listings)) {
        setListings(data.listings);
      } else {
        console.error('Unexpected API response format:', data);
        setListings([]);
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
      setListings([]);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="p-6      bg-[#170D27]">
      <SearchBar onSearch={fetchListings} />

      <ScrollVelocity
        texts={['More Listings', 'Keep Scrolling']}
        velocity={100}
        className="custom-scroll-text" />


      <motion.div layout className="grid gap-6 grid-cols-1 mt-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(listings) && listings.map((l) => (
          <PropertyCard key={l._id} listing={l} />
        ))}
      </motion.div>

      
      
      <Chatbot />
    </div>
  );
}
