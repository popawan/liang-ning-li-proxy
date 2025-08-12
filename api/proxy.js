export default async function handler(req, res) {
  let { prompt, size = "1024x1024" } = req.query;

  // 如果沒給 prompt，使用預設內容
  if (!prompt) {
    prompt = "A beautiful view of Taipei 101 at sunset, ultra realistic";
  }

  try {
    // Pollinations API URL
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?size=${encodeURIComponent(size)}`;

    // 發請求到 Pollinations
    const response = await fetch(pollinationsUrl);

    if (!response.ok) {
      throw new Error(`Pollinations API error: ${response.status}`);
    }

    // 設定回應為圖片
    res.setHeader("Content-Type", "image/png");
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({ error: "Failed to fetch from Pollinations API" });
  }
}
