/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ImagePreview from './ImagePreview';
import axios from 'axios';
import { motion } from 'framer-motion';

const schema = yup.object({
  title: yup.string().required(),
  location: yup.string().required(),
  price: yup.number().required(),
  propertyType: yup.string().required(),
  description: yup.string().required(),
  amenities: yup.array().min(1, 'Select at least one amenity'),
  bedrooms: yup.number().required().positive().integer(),
  beds: yup.number().required().positive().integer(),
  bathrooms: yup.number().required().positive().integer(),
});

export default function ListingForm({ onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const [files, setFiles] = useState([]);

  const onSubmit = async (data) => {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach(val => form.append('amenities', val));
      } else {
        form.append(k, v);
      }
    });
    files.forEach(f => form.append('images', f));

    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/listings`,
      form,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    onSuccess(res.data);
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 rounded-xl shadow-xl bg-black text-[#dfcea9] space-y-6 w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Title, Location, Price */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input {...register('title')} placeholder="Title" className="form-input" />
        <input {...register('location')} placeholder="Location" className="form-input" />
        <input type="number" {...register('price')} placeholder="Price" className="form-input" />
      </div>

      {/* Rooms */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input type="number" {...register('bedrooms')} placeholder="Bedrooms" className="form-input" />
        <input type="number" {...register('beds')} placeholder="Beds" className="form-input" />
        <input type="number" {...register('bathrooms')} placeholder="Bathrooms" className="form-input" />
      </div>

      {/* Property Type */}
      <select {...register('propertyType')} className="form-input">
        <option disabled selected value="">Select Property Type</option>
        {[
          'Apartment', 'Villa', 'Studio', 'Bungalow', 'Hotel', 'Resort', 'Cottage',
          'Cabin', 'Loft', 'Treehouse', 'Penthouse', 'Hostel', 'Farmhouse',
          'Haveli', 'Shack', 'Camp', 'Other'
        ].map(pt => (
          <option key={pt} value={pt}>{pt}</option>
        ))}
      </select>

      {/* Description */}
      <textarea {...register('description')} placeholder="Description" rows={4} className="form-input resize-none" />

      {/* Amenities */}
      <div>
        <label className="block mb-2 font-semibold">Amenities:</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            'Wifi', 'Kitchen', 'Pool', 'Beach access – Beachfront', 'Free parking on premises',
            'TV', 'Washing machine', 'Exterior security cameras on property'
          ].map(am => (
            <label key={am} className="flex items-center space-x-2 text-sm">
              <input type="checkbox" value={am} {...register('amenities')} />
              <span>{am}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Image Upload */}
      <div className="flex flex-col gap-2">
        <input
          type="file"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
          className="text-sm text-[#dfcea9] file:bg-[#dfcea9]  file:text-black file:rounded file:px-3 file:py-1 file:border-none file:cursor-pointer"
        />
        {files.length > 0 && <ImagePreview files={files} />}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-[#dfcea9] text-black font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-[#bd9152] cursor-pointer hover:scale-105 transition-transform"
      >
        Create Listing
      </button>
    </motion.form>
  );
}
