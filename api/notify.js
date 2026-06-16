import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

webpush.setVapidDetails(
  "mailto:unpick@app.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const PORUKE = [
  "Kako je prošao dan? Zabeleži kako se osećaš. 🌸",
  "I danas si bila tu za sebe. Upiši kako je bilo. 💙",
  "Svaki dan je nova šansa. Kako si se provela danas? 🌿",
  "Vreme je za tvoj dnevni check-in. 🕯️",
  "Ponos ili borba — sve vredi zapisati. 📝",
  "Kako si se osećala danas? Tvoj dnevnik čeka. 🌙",
  "Mali korak svaki dan. Zabeleži svoj. ✨",
  "Kraj dana — idealno vreme da se osvrneš na sebe. 🌸",
  "Nisi sama u ovome. Upiši kako je bilo. 💜",
  "Danas je bio tvoj dan. Kako je prošao? 🌿",
];

export default async function handler(req, res) {
  if (req.headers["authorization"] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const poruka = PORUKE[Math.floor(Date.now() / 86400000) % PORUKE.length];

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("push_subscription")
    .not("push_subscription", "is", null);

  if (error) return res.status(500).json({ error: error.message });

  const results = await Promise.allSettled(
    profiles
      .filter((p) => p.push_subscription)
      .map((p) => {
        const sub = JSON.parse(p.push_subscription);
        return webpush.sendNotification(
          sub,
          JSON.stringify({
            title: "Unpick 🌸",
            body: poruka,
            icon: "/icon-192.png",
            url: "/",
          })
        );
      })
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  res.status(200).json({ sent, failed });
}
