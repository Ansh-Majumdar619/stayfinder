// Run this file manually to seed test data
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Listing from '../models/Listing.js';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();
connectDB();

const amenitiesList = [
  'Beach access – Beachfront',
  'Kitchen',
  'Wifi',
  'Free parking on premises',
  'Pool',
  'TV',
  'Washing machine',
  'Exterior security cameras on property',
];

const getRandomAmenities = () => {
  const shuffled = amenitiesList.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 5) + 3);
};

const propertyTypes = [
  'Apartment', 'Villa', 'Cabin', 'Hostel', 'Treehouse',
  'Cottage', 'Loft', 'Studio', 'Penthouse', 'Haveli',
];

const listings = [
  {
    title: 'Modern Loft',
    description: 'Spacious loft in downtown.',
    location: 'New York',
    price: 120,
  },
  {
    title: 'Beachside Bungalow',
    description: 'Relaxing stay near the sea.',
    location: 'Goa',
    price: 1800,
  },
  {
    title: 'Mountain View Cabin',
    description: 'Scenic cabin in the hills.',
    location: 'Manali',
    price: 2200,
  },
  {
    title: 'Budget Room',
    description: 'Affordable room in the city center.',
    location: 'Delhi',
    price: 900,
  },
  {
    title: 'Cozy Studio',
    description: 'Compact and cozy studio apartment.',
    location: 'Mumbai',
    price: 1500,
  },
  {
    title: 'Luxury Villa',
    description: 'Premium villa with pool.',
    location: 'Goa',
    price: 5000,
  },
  {
    title: 'Lake House',
    description: 'Serene house by the lake.',
    location: 'Udaipur',
    price: 2500,
  },
  {
    title: 'Historic Haveli',
    description: 'Traditional heritage home.',
    location: 'Jaipur',
    price: 1800,
  },
  {
    title: 'Backpacker’s Hostel',
    description: 'Perfect for solo travelers.',
    location: 'Rishikesh',
    price: 600,
  },
  {
    title: 'Green Paradise',
    description: 'Eco-stay surrounded by greenery.',
    location: 'Kerala',
    price: 2000,
  },
  {
    title: 'Penthouse Suite',
    description: 'City skyline views from the top floor.',
    location: 'Bangalore',
    price: 4000,
  },
  {
    title: 'Artistic Apartment',
    description: 'Colorful and vibrant decor.',
    location: 'Pune',
    price: 1700,
  },
  {
    title: 'Farm Stay',
    description: 'Reconnect with nature.',
    location: 'Punjab',
    price: 1600,
  },
  {
    title: 'Himalayan Retreat',
    description: 'Peaceful escape in the Himalayas.',
    location: 'Leh',
    price: 2700,
  },
  {
    title: 'City Apartment',
    description: 'Convenient and modern.',
    location: 'Chennai',
    price: 1300,
  },
  {
    title: 'River View Cottage',
    description: 'Stunning views and calm vibes.',
    location: 'Haridwar',
    price: 2100,
  },
  {
    title: 'Desert Camp',
    description: 'Stay under the stars.',
    location: 'Jaisalmer',
    price: 1500,
  },
  {
    title: 'Luxury Treehouse',
    description: 'Elevated comfort among the trees.',
    location: 'Coorg',
    price: 3500,
  },
  {
    title: 'Studio near Metro',
    description: 'Good connectivity and comfort.',
    location: 'Noida',
    price: 1200,
  },
  {
    title: 'Seaside Shack',
    description: 'Simple living near the beach.',
    location: 'Goa',
    price: 1300,
  },
  {
    title: 'Royal Suite',
    description: 'Live like royalty.',
    location: 'Hyderabad',
    price: 4200,
  },
  {
    title: 'Countryside Home',
    description: 'Quiet village escape.',
    location: 'Maharashtra',
    price: 1100,
  },
  {
    title: 'Business Studio',
    description: 'Work-friendly compact stay.',
    location: 'Gurgaon',
    price: 1900,
  },
  {
    title: 'Jungle Retreat',
    description: 'Stay close to nature.',
    location: 'Jim Corbett',
    price: 2800,
  },
  {
    title: 'Island Villa',
    description: 'Private island comfort.',
    location: 'Andaman',
    price: 7000,
  },
  {
    title: 'Boho Hut',
    description: 'Artistic coastal escape.',
    location: 'Pondicherry',
    price: 1600,
  },
  {
    title: 'Cloud View Resort',
    description: 'Among the clouds in Munnar.',
    location: 'Munnar',
    price: 3000,
  },
  {
    title: 'Budget Hostel',
    description: 'Simple bed, shared bath.',
    location: 'Kolkata',
    price: 800,
  },
  {
    title: 'Historic Mansion',
    description: 'Large rooms, ancient walls.',
    location: 'Lucknow',
    price: 2300,
  },
  {
    title: 'Studio on Hill',
    description: 'Perfect sunrise view.',
    location: 'Shimla',
    price: 1900,
  },
];

const run = async () => {
  try {
    await Listing.deleteMany();
    await User.deleteMany();

    const user = await User.create({
      name: 'Test Host',
      email: 'host@test.com',
      password: '123456',
      role: 'host',
    });

    const enrichedListings = listings.map((l, index) => ({
      ...l,
      propertyType: propertyTypes[index % propertyTypes.length],
      amenities: getRandomAmenities(),
      host: user._id,
      images: ['/uploads/goahotel.jpg'], // Update with real if needed
    }));

    await Listing.insertMany(enrichedListings);
    console.log('✅ Seeded 30 listings and 1 host user');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

run();







// node seed/seedData.js

