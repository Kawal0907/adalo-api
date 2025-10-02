import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    // Only accept POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const result = response.choices[0]?.message?.content || "No response";

    res.status(200).json({ result });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
}
