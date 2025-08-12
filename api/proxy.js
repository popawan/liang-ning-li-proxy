export default async function handler(req, res) {
  try {
    const { prompt } = req.query;

    console.log("=== Incoming Request ===");
    console.log("Query params:", req.query);

    if (!prompt) {
      console.warn("⚠ Missing prompt parameter");
      return res.status(400).json({ error: "Missing 'prompt' query parameter" });
    }

    // Pollinations 圖片 URL
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
    console.log("Generated Pollinations URL:", pollinationsUrl);

    // 試著去抓圖片（確認 Pollinations API 是否正常）
    const imageResponse = await fetch(pollinationsUrl);
    console.log("Pollinations API status:", imageResponse.status);

    if (!imageResponse.ok) {
      throw new Error(`Pollinations image generation failed with status ${imageResponse.status}`);
    }

    // 回傳 JSON，包含圖片網址和 debug
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
