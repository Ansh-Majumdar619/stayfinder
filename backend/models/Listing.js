import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },

  propertyType: {
    type: String,
    enum: [
      'Apartment', 'Villa', 'Studio', 'Bungalow', 'Hotel',
      'Resort', 'Cottage', 'Cabin', 'Loft', 'Treehouse',
      'Penthouse', 'Hostel', 'Farmhouse', 'Haveli', 'Shack',
      'Camp', 'Other'
    ],
    default: 'Apartment'
  },

  amenities: [
    {
      type: String,
      enum: [
        'Beach access – Beachfront',
        'Kitchen',
        'Wifi',
        'Free parking on premises',
        'Pool',
        'TV',
        'Washing machine',
        'Exterior security cameras on property'
      ]
    }
  ],

  images: {
    type: [String],
    default: []
  },

  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },

  // ✅ New fields
  bedrooms: { type: Number, default: 1 },
  beds: { type: Number, default: 1 },
  bathrooms: { type: Number, default: 1 }

}, { timestamps: true });

export default mongoose.model('Listing', listingSchema);
