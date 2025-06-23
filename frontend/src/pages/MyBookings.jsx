/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/bookings`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setBookings(res.data);
  };

  const cancelBooking = async (id) => {
    const confirmed = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirmed) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/bookings/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchBookings();
    } catch (err) {
      console.error('Failed to cancel booking', err);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const query = searchQuery.toLowerCase();
    return (
      b.listing.title.toLowerCase().includes(query) ||
      b.listing.location.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen w-full bg-[#121213] px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-[#c8a76f] mb-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          📅 My Bookings
        </motion.h2>

        {/* Single Combined Filter Input */}
        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Search by title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 w-full sm:w-2/3 md:w-1/2 rounded-md shadow-sm border bg-[#bd9152]  border-[#60442e] focus:outline-none focus:ring-2 focus:ring-[#2e2d2b]"
          />
        </div>

        {filteredBookings.length === 0 ? (
          <motion.p
            className="text-center text-zinc-300 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            No bookings found.
          </motion.p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((b, i) => (
              <motion.div
                key={b._id}
                className="bg-[#dfcea9] text-[#47423a] rounded-2xl p-6 shadow-md  border-rounded border-[#332217] transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <h3 className="text-xl font-bold mb-1">{b.listing.title}</h3>
                <p className="text-sm italic text-[#2b261e] mb-2">{b.listing.location}</p>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">📆 From:</span> {new Date(b.startDate).toLocaleDateString()}</p>
                  <p><span className="font-medium">📆 To:</span> {new Date(b.endDate).toLocaleDateString()}</p>
                  <p><span className="font-medium">👥 Guests:</span> {b.guests}</p>
                </div>
                <button
                  onClick={() => cancelBooking(b._id)}
                  className="mt-4 bg-[#765136] hover:bg-[#121213] text-white cursor-pointer text-sm font-semibold py-2 px-4 rounded-full transition duration-300"
                >
                  Cancel Booking
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
