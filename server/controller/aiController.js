const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

// Initialize Gemini AI client (reads API key from GEMINI_API_KEY)
const ai = new GoogleGenAI({});

const askAI = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: "Prompt required" });

    // Generate content from Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // you can also try "gemini-1.5-mini"
      contents: `Answer concisely in 2 sentences: ${prompt}`,
    });

    res.json({ aiAnswer: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI request failed", error: err.message });
  }
};

module.exports = { askAI };
