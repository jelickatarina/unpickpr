export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const { message, ime, email } = req.body;
  if (!message || !message.trim()) return res.status(400).json({ error: "Poruka je obavezna" });
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Unpick <onboarding@resend.dev>",
        to: "jlckaca@gmail.com",
        subject: "Unpick - Prijava bug-a",
        text: `${message.trim()}\n\n---\nKorisnik: ${ime || "?"} (${email || "?"})`,
      }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: data.message || "Greška pri slanju." });
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
