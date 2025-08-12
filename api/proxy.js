export default async function handler(req, res) {
  let { prompt, size = "1024x1024" } = req.query;

  if (!prompt) {
    prompt = "A beautiful view of Taipei 101 at sunset, ultra realistic";
  }

  try {
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?size=${encodeURIComponent(size)}`;

    // 取得 Pollinations 圖片
    const response = await fetch(pollinationsUrl);
    if (!response.ok) {
      throw new Error(`Pollinations API error: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    // 上傳到 Imgur
    const uploadResponse = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`, // Vercel 環境變數
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64Image,
        type: "base64",
      }),
    });

    const uploadData = await uploadResponse.json();

    if (!uploadData.success) {
      throw new Error("Imgur upload failed");
    }

    // 回傳圖片網址
    res.status(200).json({
      image_url: uploadData.data.link
    });

  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
}
