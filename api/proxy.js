import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { prompt } = req.query;

    console.log("=== Incoming Request ===");
    console.log("Query params:", req.query);

    if (!prompt) {
      console.warn("⚠ Missing prompt parameter");
      return res.status(400).json({ error: "Missing 'prompt' query parameter" });
    }

    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
    console.log("Generated Pollinations URL:", pollinationsUrl);

    const imageResponse = await fetch(pollinationsUrl);
    console.log("Pollinations API status:", imageResponse.status);

    if (!imageResponse.ok) {
      throw new Error(`Pollinations image generation failed with status ${imageResponse.status}`);
    }

    // 回傳直接的圖片 URL（不經 Imgur）
    res.status(200).json({
      image_url: pollinationsUrl,
      debug: {
        received_prompt: prompt,
        pollinations_url: pollinationsUrl,
        pollinations_status: imageResponse.status
      }
    });

  } catch (err) {
    console.error("❌ Proxy Error:", err);
    res.status(500).json({ error: err.message });
  }
}
