/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [myListings, setMyListings] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCurrentUserId(res.data._id);
    } catch (err) {
      console.error('Failed to fetch current user:', err);
    }
  };

  const fetchListings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/listings`);
      setMyListings(res.data);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserId) fetchListings();
  }, [currentUserId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/listings/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMyListings((prev) => prev.filter((listing) => listing._id !== id));
    } catch (err) {
      console.error('Error deleting listing:', err);
    }
  };

  const myUploads = myListings.filter((listing) => listing.host?._id === currentUserId);

  return (
    <div className="min-h-screen w-full bg-black px-4 py-10 text-[#dfcea9]">
      <motion.h2
        className="text-3xl sm:text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🏠 Your Listings
      </motion.h2>

      {myUploads.length === 0 ? (
        <motion.p
          className="text-center text-[#dfcea9]/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          You haven't posted any listings yet.
        </motion.p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myUploads.map((listing, i) => (
            <motion.div
              key={listing._id}
              className="bg-[#1a1a1a] border border-[#dfcea9]/20 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <img
                src={
                  listing.images?.[0]?.startsWith('http')
                    ? listing.images[0]
                    : `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${listing.images[0]}`
                }
                alt={listing.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <h3 className="text-xl font-semibold">{listing.title}</h3>
                <p className="text-[#dfcea9]/80 text-sm">{listing.location}</p>
                <p className="font-semibold text-green-400">₹{listing.price}</p>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => navigate(`/listings/edit/${listing._id}`)}
                    className="bg-[#dfcea9] hover:bg-black hover:text-[#f4eee0] text-[#332217] cursor-pointer text-sm px-4 py-1 rounded transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(listing._id)}
                    className="bg-[#a23437] hover:bg-red-700 text-black cursor-pointer text-sm px-4 py-1 rounded transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
