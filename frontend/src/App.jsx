import React from 'react';
import Router from './router';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex-grow pt-[72px] sm:pt-[80px] md:pt-[72px] lg:pt-[72px] ">
        <Router />
      </div>
      <Footer />
    </div>
  );
}
