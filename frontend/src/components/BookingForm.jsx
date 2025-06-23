import React, { useState } from 'react';
import axios from 'axios';

export default function BookingForm({ listingId, onSuccess }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState(1);

  const handleBooking = async (e) => {
    e.preventDefault();

    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/bookings`,
      { listing: listingId, startDate, endDate, guests },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    onSuccess();
  };

  return (
    <form
      onSubmit={handleBooking}
      className="bg-[#e8dcc0] p-6 rounded-xl shadow-md w-full max-w-md mx-auto text-black space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">Book Your Stay</h2>

      <div className="flex flex-col">
        <label htmlFor="startDate" className="mb-1 font-bold">
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="rounded-lg border bg-[#cebe98] border-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="endDate" className="mb-1 font-bold">
          End Date
        </label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="rounded-lg border bg-[#cebe98] border-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="guests" className="mb-1 font-bold">
          Guests
        </label>
        <input
          type="number"
          id="guests"
          value={guests}
          min="1"
          max="20"
          onChange={e => setGuests(e.target.value)}
          className="rounded-lg border bg-[#cebe98] border-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-black text-[#e8dcc0] font-semibold py-2 rounded-lg hover:bg-opacity-90 transition hover:bg-[#bd9152] hover:text-black cursor-pointer"
      >
        Book Now
      </button>
    </form>
  );
}
