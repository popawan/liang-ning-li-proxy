export default async function handler(req, res) {
  let { prompt, size = "1024x1024" } = req.query;

  if (!prompt) {
    prompt = "A beautiful view of Taipei 101 at sunset, ultra realistic";
  }

  try {
    // 嘗試 Pollinations API
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?size=${encodeURIComponent(size)}`;
    const pollRes = await fetch(pollinationsUrl);

    if (pollRes.ok) {
      const buffer = await pollRes.arrayBuffer();
      res.setHeader("Content-Type", "image/png");
      return res.send(Buffer.from(buffer));
    } else {
      throw new Error(`Pollinations failed: ${pollRes.status}`);
    }
  } catch (err) {
    console.warn("Pollinations 掛了，改用備用 API", err.message);

    try {
      // 備用 API：這裡用 OpenAI DALL·E 作範例
      const dalleRes = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          prompt,
          size
        })
      });

      const dalleData = await dalleRes.json();

      if (dalleData.data && dalleData.data[0]?.b64_json) {
        const imgBuffer = Buffer.from(dalleData.data[0].b64_json, "base64");
        res.setHeader("Content-Type", "image/png");
        return res.send(imgBuffer);
      } else {
        throw new Error("DALL·E 沒回圖片");
      }
    } catch (backupErr) {
      console.error("備用 API 也失敗", backupErr.message);
      return res.status(500).json({ error: "All image generation services failed" });
    }
  }
}
