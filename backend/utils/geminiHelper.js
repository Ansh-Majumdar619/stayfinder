import axios from "axios";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export const askGemini = async (userMessage) => {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
      }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply || "I'm not sure how to help with that.";
  } catch (error) {
    console.error("Gemini error:", error.response?.data || error.message);
    return "Sorry, I'm having trouble connecting to my brain (Gemini Flash).";
  }
};
