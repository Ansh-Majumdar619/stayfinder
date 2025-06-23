import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
import Listing from '../models/Listing.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    updateMissingCoordinates();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });

const updateMissingCoordinates = async () => {
  try {
    const listings = await Listing.find({
      $or: [{ latitude: { $exists: false } }, { longitude: { $exists: false } }]
    });

    console.log(`🧭 Found ${listings.length} listings missing coordinates`);

    for (const listing of listings) {
      try {
        const geoRes = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
          params: {
            key: process.env.OPENCAGE_API_KEY,
            q: listing.location,
          },
        });

        const result = geoRes.data?.results?.[0]?.geometry;
        if (result) {
          listing.latitude = result.lat;
          listing.longitude = result.lng;
          await listing.save();
          console.log(`✅ Updated: ${listing.title} (${listing.location})`);
        } else {
          console.warn(`⚠️ No result for: ${listing.title} (${listing.location})`);
        }
      } catch (err) {
        console.error(`❌ Error updating ${listing.title}:`, err.message);
      }
    }

    console.log('🎉 All listings updated');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to update listings:', err);
    process.exit(1);
  }
};
