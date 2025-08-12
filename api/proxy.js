export default async function handler(req, res) {
  const { prompt, size = "1024x1024" } = req.query;

  if (!prompt) {
    return res.status(400).json({ error: "Missing 'prompt' query parameter" });
  }

  try {
    // Pollinations API URL
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?size=${encodeURIComponent(size)}`;

    // 轉發請求到 Pollinations
    const response = await fetch(pollinationsUrl);

    if (!response.ok) {
      throw new Error(`Pollinations API error: ${response.status}`);
    }

    // 設定圖片回傳
    res.setHeader("Content-Type", "image/png");
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({ error: "Failed to fetch from Pollinations API" });
  }
}
