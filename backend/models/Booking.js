import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startDate: Date,
  endDate: Date,
  guests: { type: Number, required: true } // ← New field
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
