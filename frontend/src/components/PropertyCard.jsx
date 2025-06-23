/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChromaGrid from '../ui/ChromaGrid';

export default function PropertyCard({ listing }) {
  const navigate = useNavigate();

  const imageUrl = `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${listing.images[0]}`;

  return (
    <div className="  flex justify-center sm:justify-start px-6 lg:pl-20 sm:pl-12">


      <ChromaGrid
        images={listing.images.map(img =>
          img.startsWith("http")
            ? img
            : `${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}${img}`
        )}
        title={listing.title}
        subtitle={listing.location}
        handle={`₹${listing.price}`}
        borderColor="#3B82F6"
        gradient="linear-gradient(145deg,#3B82F6,#000)"
        onClick={() => navigate(`/listings/${listing._id}`)}
      />




    </div>
  );
}
