import { askGemini } from '../utils/geminiHelper.js';
import Listing from '../models/Listing.js';

export const askBot = async (req, res) => {
  const { message } = req.body;

  try {
    const prompt = `
You're a helpful AI assistant for a property booking platform like Airbnb.
Analyze this user query: "${message}".

Extract and return this JSON only:
{
  "location": "city or area (e.g. Goa, Bandra)",
  "budget": 0, // number in rupees
  "propertyType": "Apartment | Villa | Studio | Bungalow | Hotel | Resort | Cottage | Cabin | Treehouse | Loft | Hostel | Penthouse (optional)",
  "amenities": ["Wifi", "Pool", "Kitchen"] // optional array of any amenities mentioned
}

ONLY return valid JSON. No explanation, no extra words.
`;

    const geminiResponse = await askGemini(prompt);
    const match = geminiResponse.match(/{[\s\S]*?}/);
    const parsed = match ? JSON.parse(match[0]) : null;

    if (!parsed || !parsed.location) {
      return res.json({ reply: "I couldn’t identify the location or budget. Please be more specific." });
    }

    const filters = {
      location: { $regex: new RegExp(parsed.location, 'i') },
      price: { $lte: parsed.budget || 999999 },
    };

    if (parsed.propertyType) {
      filters.propertyType = { $regex: new RegExp(parsed.propertyType, 'i') };
    }

    if (parsed.amenities && Array.isArray(parsed.amenities) && parsed.amenities.length > 0) {
      filters.amenities = { $all: parsed.amenities };
    }

    const listings = await Listing.find(filters).limit(5);

    if (!listings.length) {
      return res.json({
        reply: `Sorry, no ${parsed.propertyType || 'properties'} found in ${parsed.location} under ₹${parsed.budget}.`,
      });
    }

    const formattedResults = listings.map(listing => ({
      id: listing._id,
      title: listing.title,
      price: `₹${listing.price}`,
      location: listing.location,
      propertyType: listing.propertyType,
      image: listing.images?.[0] ? `${process.env.BASE_URL}/uploads/${listing.images[0]}` : null,
      amenities: listing.amenities,
    }));

    res.json({
      reply: `Here are ${formattedResults.length} ${parsed.propertyType || 'property'} options in ${parsed.location} :`,
      listings: formattedResults,
    });

  } catch (err) {
    console.error('Chatbot Error:', err);
    res.status(500).json({ reply: 'Something went wrong while talking to the AI assistant.' });
  }
};
