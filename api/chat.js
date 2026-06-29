export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const { messages } = req.body;
  if (!messages) return res.status(400).json({ error: "Nema poruka" });
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({ model: "openai/gpt-oss-120b", max_tokens: 500, messages }),
    });
    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
