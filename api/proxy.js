export default async function handler(req, res) {
  console.log("=== GPTs Action 請求資訊 ===");
  console.log("Method:", req.method);
  console.log("Query:", req.query);
  console.log("Headers:", req.headers);

  if (req.method === "POST") {
    let body = "";
    req.on("data", chunk => { body += chunk });
    req.on("end", () => {
      console.log("Body:", body);
    });
  }

  res.status(200).json({ status: "ok", query: req.query });
}
