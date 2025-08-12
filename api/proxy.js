export default async function handler(req, res) {
  let { prompt, size = "1024x1024" } = req.query;

  if (!prompt) {
    prompt = "A beautiful view of Taipei 101 at sunset, ultra realistic";
  }

  try {
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?size=${encodeURIComponent(size)}`;
    
    // 從 Pollinations 拿圖片
    const response = await fetch(pollinationsUrl);
    if (!response.ok) {
      throw new Error(`Pollinations API error: ${response.status}`);
    }

    // 把圖片轉成 base64 上傳到免費圖床（這裡用 Imgur 做示例）
    const buffer = await response.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    // Imgur 上傳 API
    const uploadResponse = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`, // 需設定 Imgur API Key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64Image,
        type: "base64",
      }),
    });

    const uploadData = await uploadResponse.json();

    // 回傳 JSON（圖片網址）
    res.status(200).json({
      image_url: uploadData.data.link
    });

  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({ error: "Failed to fetch from Pollinations API" });
  }
}
