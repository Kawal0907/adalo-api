export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    // Call OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",  // or whichever model you want
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    // ✅ Send the AI’s response back to Adalo
    return res.status(200).json({
      result: data.choices?.[0]?.message?.content || "No response",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

