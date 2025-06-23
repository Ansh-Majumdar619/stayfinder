/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListingForm from '../components/ListingForm';
import PropertyCard from '../components/PropertyCard';
import { motion } from 'framer-motion';

export default function HostDashboard() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/listings`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setListings(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-black text-[#e8dcc0] px-4 sm:px-8 py-8">
      {/* Heading */}
      <motion.h2
        className="text-3xl font-bold mb-6 tracking-wide border-b border-[#e8dcc0]/30 pb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        ✨ Make a Listing
      </motion.h2>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-[#1a1a1a] border border-[#e8dcc0]/20 rounded-xl p-6 shadow-lg"
      >
        <ListingForm onSuccess={l => setListings([l, ...listings])} />
      </motion.div>

      {/* Grid of Listings */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        {listings.map((l) => (
          <motion.div
            key={l._id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
          >
            <PropertyCard listing={l} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
