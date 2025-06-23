import Booking from '../models/Booking.js';
import Listing from '../models/Listing.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';

// ✅ Create booking
export const createBooking = async (req, res) => {
  try {
    const { listing: listingId, startDate, endDate, guests } = req.body;

    const listing = await Listing.findById(listingId).populate('host');
    if (!listing || !listing.host) {
      return res.status(404).json({ message: 'Listing or host not found' });
    }

    const guest = await User.findById(req.user._id);
    if (!guest) {
      return res.status(404).json({ message: 'Guest user not found' });
    }

    const booking = await Booking.create({
      listing: listing._id,
      startDate,
      endDate,
      guests,
      user: guest._id,
    });

    // ✅ Email to Host
    if (listing.host.email) {
      await sendEmail({
        to: listing.host.email,
        subject: `📢 Your Property "${listing.title}" Has Been Booked!`,
        html: `
          <h2>Hi ${listing.host.name},</h2>
          <p>Your property <strong>${listing.title}</strong> has been booked!</p>
          <h3>📋 Booking Details:</h3>
          <ul>
            <li><strong>Guest Name:</strong> ${guest.name}</li>
            <li><strong>Guest Email:</strong> ${guest.email}</li>
            <li><strong>Guests:</strong> ${guests}</li>
            <li><strong>From:</strong> ${new Date(startDate).toLocaleDateString()}</li>
            <li><strong>To:</strong> ${new Date(endDate).toLocaleDateString()}</li>
          </ul>
          <p>Login to your dashboard to view more details.</p>
        `,
      });
    }

    // ✅ Email to Guest
    if (guest.email) {
      await sendEmail({
        to: guest.email,
        subject: `✅ Booking Confirmed at "${listing.title}"`,
        html: `
          <h2>Hello ${guest.name},</h2>
          <p>Your booking at <strong>${listing.title}</strong> has been confirmed.</p>
          <h3>🏠 Property Details:</h3>
          <ul>
            <li><strong>Location:</strong> ${listing.location}</li>
            <li><strong>Price:</strong> ₹${listing.price}</li>
            <li><strong>Guests:</strong> ${guests}</li>
            <li><strong>From:</strong> ${new Date(startDate).toLocaleDateString()}</li>
            <li><strong>To:</strong> ${new Date(endDate).toLocaleDateString()}</li>
          </ul>
          <p>Contact your host: <strong>${listing.host.name}</strong> (<a href="mailto:${listing.host.email}">${listing.host.email}</a>).</p>
          <p>Thank you for booking with <strong>StayFinder</strong> 🏡</p>
        `,
      });
    }

    res.status(201).json(booking);
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    res.status(500).json({ message: 'Booking failed' });
  }
};

// ✅ Get bookings for logged-in user
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('listing');
    res.status(200).json(bookings);
  } catch (error) {
    console.error('❌ Error fetching bookings:', error);
    res.status(500).json({ message: 'Could not fetch bookings' });
  }
};

// ✅ Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('listing')
      .populate('user');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    const listing = await Listing.findById(booking.listing._id).populate('host');

    // ✅ Email Host
    if (listing.host?.email) {
      await sendEmail({
        to: listing.host.email,
        subject: `❌ Booking Cancelled for "${listing.title}"`,
        html: `
          <h2>Hi ${listing.host.name},</h2>
          <p>The booking for your property <strong>${listing.title}</strong> has been cancelled.</p>
          <ul>
            <li><strong>Guest:</strong> ${booking.user.name}</li>
            <li><strong>Email:</strong> ${booking.user.email}</li>
            <li><strong>From:</strong> ${new Date(booking.startDate).toLocaleDateString()}</li>
            <li><strong>To:</strong> ${new Date(booking.endDate).toLocaleDateString()}</li>
          </ul>
        `,
      });
    }

    // ✅ Email Guest
    if (booking.user?.email) {
      await sendEmail({
        to: booking.user.email,
        subject: `❌ Booking Cancelled - ${listing.title}`,
        html: `
          <h2>Hi ${booking.user.name},</h2>
          <p>Your booking at <strong>${listing.title}</strong> has been successfully cancelled.</p>
          <ul>
            <li><strong>Location:</strong> ${listing.location}</li>
            <li><strong>From:</strong> ${new Date(booking.startDate).toLocaleDateString()}</li>
            <li><strong>To:</strong> ${new Date(booking.endDate).toLocaleDateString()}</li>
          </ul>
          <p>We hope to see you again on <strong>StayFinder</strong> 🌍</p>
        `,
      });
    }

    await booking.deleteOne();
    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('❌ Error cancelling booking:', error);
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
};
