/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import axios from 'axios';
import ImagePreview from '../components/ImagePreview';
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

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchListing = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/listings/${id}`);
      const data = res.data;

      setExistingImages(data.images || []);
      reset({
        title: data.title,
        location: data.location,
        price: data.price,
        propertyType: data.propertyType,
        description: data.description,
        amenities: data.amenities || [],
        bedrooms: data.bedrooms,
        beds: data.beds,
        bathrooms: data.bathrooms,
      });
    } catch (err) {
      console.error('Failed to fetch listing:', err);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  const onSubmit = async (formData) => {
    const form = new FormData();

    Object.entries(formData).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach(val => form.append(k, val));
      } else {
        form.append(k, v);
      }
    });

    files.forEach(f => form.append('images', f));

    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/listings/${id}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      navigate('/me');
    } catch (err) {
      console.error('Failed to update listing:', err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black px-4 py-10 text-[#dfcea9]">
      <motion.h2
        className="text-3xl sm:text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        ✏️ Edit Listing
      </motion.h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto bg-[#111111] p-6 sm:p-8 rounded-2xl shadow-xl space-y-4 border border-[#dfcea9]/20"
      >
        <input {...register('title')} placeholder="Title"
          className="w-full px-4 py-2 rounded bg-black border border-[#dfcea9]/30 text-[#dfcea9] focus:outline-none focus:ring-2 focus:ring-[#dfcea9]" />

        <input {...register('location')} placeholder="Location"
          className="w-full px-4 py-2 rounded bg-black border border-[#dfcea9]/30 text-[#dfcea9] focus:outline-none focus:ring-2 focus:ring-[#dfcea9]" />

        <input type="number" {...register('price')} placeholder="Price"
          className="w-full px-4 py-2 rounded bg-black border border-[#dfcea9]/30 text-[#dfcea9] focus:outline-none focus:ring-2 focus:ring-[#dfcea9]" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input type="number" {...register('bedrooms')} placeholder="Bedrooms"
            className="px-4 py-2 rounded bg-black border border-[#dfcea9]/30 text-[#dfcea9] focus:outline-none focus:ring-2 focus:ring-[#dfcea9]" />

          <input type="number" {...register('beds')} placeholder="Beds"
            className="px-4 py-2 rounded bg-black border border-[#dfcea9]/30 text-[#dfcea9] focus:outline-none focus:ring-2 focus:ring-[#dfcea9]" />

          <input type="number" {...register('bathrooms')} placeholder="Bathrooms"
            className="px-4 py-2 rounded bg-black border border-[#dfcea9]/30 text-[#dfcea9] focus:outline-none focus:ring-2 focus:ring-[#dfcea9]" />
        </div>

        <select {...register('propertyType')}
          className="w-full px-4 py-2 rounded bg-black border border-[#dfcea9]/30 text-[#dfcea9] focus:outline-none focus:ring-2 focus:ring-[#dfcea9]">
          {[
            'Apartment', 'Villa', 'Studio', 'Bungalow', 'Hotel', 'Resort', 'Cottage',
            'Cabin', 'Loft', 'Treehouse', 'Penthouse', 'Hostel', 'Farmhouse',
            'Haveli', 'Shack', 'Camp', 'Other'
          ].map(pt => (
            <option key={pt} value={pt}>{pt}</option>
          ))}
        </select>

        <textarea {...register('description')} placeholder="Description"
          className="w-full h-24 px-4 py-2 rounded bg-black border border-[#dfcea9]/30 text-[#dfcea9] focus:outline-none focus:ring-2 focus:ring-[#dfcea9]" />

        <div>
          <label className="block font-semibold mb-2">Amenities:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              'Wifi', 'Kitchen', 'Pool', 'Beach access – Beachfront', 'Free parking on premises',
              'TV', 'Washing machine', 'Exterior security cameras on property'
            ].map(am => (
              <label key={am} className="inline-flex items-center gap-2 text-[#dfcea9]">
                <input type="checkbox" value={am} {...register('amenities')} />
                <span className="text-sm">{am}</span>
              </label>
            ))}
          </div>
        </div>

        <input type="file" multiple onChange={e => setFiles([...e.target.files])}
          className="text-[#dfcea9] mt-2" />

        {(files.length > 0 || existingImages.length > 0) && (
          <ImagePreview files={files} urls={existingImages} />
        )}

        <button type="submit"
          className="w-full cursor-pointer bg-green-600 hover:bg-green-700 transition-all text-white font-semibold py-2 rounded mt-4">
          Update Listing
        </button>
      </form>
    </div>
  );
}
