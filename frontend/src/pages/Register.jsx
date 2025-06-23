/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Register() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, data);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#1a1a1a] text-[#dfcea9] p-8 rounded-xl shadow-2xl border border-[#dfcea9]/20"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Create an Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <input
              {...register('name')}
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-md bg-black text-[#dfcea9] border border-[#dfcea9]/20 focus:outline-none focus:ring-2 focus:ring-[#dfcea9]"
            />
          </div>

          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-md bg-black text-[#dfcea9] border border-[#dfcea9]/20 focus:outline-none focus:ring-2 focus:ring-[#dfcea9]"
            />
          </div>

          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-md bg-black text-[#dfcea9] border border-[#dfcea9]/20 focus:outline-none focus:ring-2 focus:ring-[#dfcea9]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-3 right-4 text-[#dfcea9]/70 cursor-pointer hover:text-[#dfcea9]"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div>
            <select
              {...register('role')}
              className="w-full px-4 py-3 rounded-md bg-black text-[#dfcea9] border border-[#dfcea9]/20 focus:outline-none focus:ring-2 focus:ring-[#dfcea9]"
            >
              <option value="guest">Guest</option>
              <option value="host">Host</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#dfcea9] text-black py-3 rounded-md font-semibold cursor-pointer hover:bg-[#c8a76f]  transition-all"
          >
            Register
          </button>
        </form>
      </motion.div>
    </div>
  );
}
