import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ListingDetails from './pages/ListingDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import HostDashboard from './pages/HostDashboard';
import MyBookings from './pages/MyBookings';
import Dashboard from './pages/Dashboard';
import EditListing from './pages/EditListing';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/listings/:id" element={<ListingDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/host" element={<HostDashboard />} />
      <Route path="/me" element={<Dashboard />} />
      <Route path="/listings/edit/:id" element={<EditListing />} /> {/* ✅ Add this */}
      <Route path="/bookings" element={<MyBookings />} />
    </Routes>
  );
}
