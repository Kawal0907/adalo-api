import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a 5S inspection assistant. Reply with CLEAN if all areas are acceptable, or NOT CLEAN if any issue is found."
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 50
    });

    // ✅ Return GPT’s actual message
    res
      .status(200)
      .json({ result: completion.choices[0].message.content || "No output" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}



