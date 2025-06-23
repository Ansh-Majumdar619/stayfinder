import Listing from '../models/Listing.js';
import axios from 'axios';

// ✅ CREATE Listing with Auto Geocoding and Room Info
export const createListing = async (req, res) => {
  try {
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    let latitude = null;
    let longitude = null;

    // 🌍 Geocode the location string into lat/lng
    try {
      const geoRes = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
        params: {
          key: process.env.OPENCAGE_API_KEY,
          q: req.body.location,
        },
      });

      if (geoRes.data?.results?.length > 0) {
        latitude = geoRes.data.results[0].geometry.lat;
        longitude = geoRes.data.results[0].geometry.lng;
      }
    } catch (geoErr) {
      console.error('❌ Geocoding failed:', geoErr.message);
    }

    // ✅ Abort if lat/lng is missing
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Could not determine coordinates for location.' });
    }

    const listingData = {
      ...req.body,
      images: imagePaths,
      host: req.user._id,
      amenities: req.body.amenities || [],
      propertyType: req.body.propertyType || 'Apartment',
      latitude,
      longitude,
      bedrooms: Number(req.body.bedrooms) || 1,
      beds: Number(req.body.beds) || 1,
      bathrooms: Number(req.body.bathrooms) || 1
    };

    const listing = await Listing.create(listingData);
    res.status(201).json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create listing' });
  }
};

// ✅ GET all listings
export const getListings = async (req, res) => {
  try {
    const {
      title,
      location,
      amenity,
      minPrice,
      maxPrice,
      nearLat,
      nearLng,
      excludeId
    } = req.query;

    const query = {};

    if (title) query.title = { $regex: title, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (amenity) query.amenities = { $in: [new RegExp(amenity, 'i')] };

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (nearLat && nearLng) {
      const lat = parseFloat(nearLat);
      const lng = parseFloat(nearLng);
      const degreeOffset = 10 / 111;

      query.latitude = { $gte: lat - degreeOffset, $lte: lat + degreeOffset };
      query.longitude = { $gte: lng - degreeOffset, $lte: lng + degreeOffset };

      if (excludeId) {
        query._id = { $ne: excludeId };
      }
    }

    const listings = await Listing.find(query).populate('host', 'name');
    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch listings' });
  }
};



// ✅ GET listing by ID
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('host', 'name username'); // 👈 add this line

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch listing' });
  }
};



// ✅ UPDATE a listing (only by the host)
export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    // ✅ Authorize the host
    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    // ✅ Handle file uploads
    let images = listing.images; // keep old images if no new ones are uploaded
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    // ✅ If amenities is a string (from single checkbox), wrap it as array
    const amenities =
      typeof req.body.amenities === 'string'
        ? [req.body.amenities]
        : req.body.amenities || [];

    // ✅ Update fields safely
    listing.title = req.body.title || listing.title;
    listing.location = req.body.location || listing.location;
    listing.price = Number(req.body.price) || listing.price;
    listing.propertyType = req.body.propertyType || listing.propertyType;
    listing.description = req.body.description || listing.description;
    listing.amenities = amenities;
    listing.bedrooms = Number(req.body.bedrooms) || listing.bedrooms;
    listing.beds = Number(req.body.beds) || listing.beds;
    listing.bathrooms = Number(req.body.bathrooms) || listing.bathrooms;
    listing.images = images;

    const updatedListing = await listing.save();
    res.status(200).json(updatedListing);
  } catch (err) {
    console.error('Error updating listing:', err);
    res.status(500).json({ message: 'Failed to update listing' });
  }
};





// ✅ DELETE a listing (only by the host)
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    // Only host can delete
    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await listing.deleteOne();
    res.json({ message: 'Listing removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete listing' });
  }
};
