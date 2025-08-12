import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { prompt } = req.query;
    if (!prompt) {
      return res.status(400).json({ error: "Missing 'prompt' query parameter" });
    }

    // 呼叫 pollinations API
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
    const imageResponse = await fetch(pollinationsUrl);

    if (!imageResponse.ok) {
      throw new Error("Pollinations image generation failed");
    }

    // 原本在這裡是上傳 Imgur
    // const imgurUrl = await uploadToImgur(imageBuffer);

    // 改成直接回傳 Pollinations URL
    res.status(200).json({ image_url: pollinationsUrl });

  } catch (err) {
    console.error("Proxy Error:", err);
    res.status(500).json({ error: err.message });
  }
}
