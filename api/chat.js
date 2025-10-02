export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      garbageBin,
      workArea,
      palletConveyors,
      robotCell,
      palletLoaders,
      images = [] // array of image URLs
    } = req.body;

    // Build a clear inspection summary for GPT
    const inspectionSummary = `
    5S Inspection Results:
    - Garbage & Recycling Bins: ${garbageBin}
    - Work Area Swept: ${workArea}
    - Pallet Conveyors Clean: ${palletConveyors}
    - Robot Cell #2 Clean: ${robotCell}
    - Pallet Loaders Clean: ${palletLoaders}
    Images: ${images.join(", ")}
    `;

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a strict 5S inspection assistant. Reply CLEAN if all areas are acceptable, otherwise reply NOT CLEAN. If possible, list flagged issues."
          },
          {
            role: "user",
            content: inspectionSummary
          }
        ],
        max_tokens: 100
      })
    });

    const data = await response.json();

    return res.status(200).json({
      result: data.choices?.[0]?.message?.content || "No response"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
