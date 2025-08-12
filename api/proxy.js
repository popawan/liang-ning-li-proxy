export default async function handler(req, res) {
  try {
    const targetUrl = `https://image.pollinations.ai${req.url}`;
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
      },
      body: req.method !== "GET" ? req.body : undefined
    });

    const contentType = response.headers.get("content-type");
    res.setHeader("Content-Type", contentType);

    if (contentType.includes("image")) {
      const buffer = await response.arrayBuffer();
      res.status(response.status).send(Buffer.from(buffer));
    } else {
      const data = await response.text();
      res.status(response.status).send(data);
    }
  } catch (error) {
    res.status(500).json({ error: "Proxy request failed", details: error.message });
  }
}
