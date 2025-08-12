export default async function handler(req, res) {
  console.log("=== GPTs Action Debug Log ===");
  console.log("Method:", req.method);
  console.log("Query:", req.query);
  console.log("Headers:", req.headers);

  let body = "";
  try {
    body = await new Promise((resolve) => {
      let data = "";
      req.on("data", chunk => { data += chunk; });
      req.on("end", () => resolve(data));
    });
  } catch (err) {
    console.error("讀取 body 發生錯誤:", err);
  }

  console.log("Body:", body);

  // 回傳收到的資料
  res.status(200).json({
    message: "✅ 已收到 GPTs Action 請求，請到 Vercel Logs 查看詳細內容",
    method: req.method,
    query: req.query,
    headers: req.headers,
    body
  });
}
