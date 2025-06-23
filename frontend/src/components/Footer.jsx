/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-black text-[#dfcea9] px-4 py-6 w-full"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center text-sm">
        <p className="mb-1">&copy; {new Date().getFullYear()} StayFinder</p>
        <p className="text-[#dfcea9]/70 text-xs">Made with ❤️ for travelers</p>
      </div>
    </motion.footer>
  );
}
