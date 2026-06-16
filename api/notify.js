import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:unpick@app.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { subscription } = req.body;
  if (!subscription) return res.status(400).json({ error: "Nema subscription" });
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Unpick 🌸",
        body: "Kako si danas? Zabeleži kako se osećaš.",
        icon: "/icon-192.png",
        url: "/"
      })
    );
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
