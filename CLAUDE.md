# Task: Sakrij Groq API ključ + poboljšaj error poruku

## 1. Napravi `api/chat.js` u root folderu

```javascript
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
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", max_tokens: 500, messages }),
    });
    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
```

## 2. Izmeni `src/App.jsx`

- Obriši: `const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY || "";`
- Obriši if blok koji proverava `if (!GROQ_KEY)` i vraća grešku
- Zameni fetch ka `https://api.groq.com/...` sa:

```javascript
const res = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: msgs }),
});
if (!res.ok) throw new Error(`Server greška: ${res.status}`);
const data = await res.json();
if (data.error) throw new Error(data.error);
```

- U catch bloku zameni error poruku sa:
  `"Ups, Mia trenutno nije dostupna. Proveri internet konekciju ili pokušaj za koji minut. Ako te muči nešto hitno, koristi SOS dugme gore. 💙"`

## 3. Izmeni `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }]
}
```

## 4. Napomena
Na Vercel dashboardu dodaj env varijablu `GROQ_API_KEY` (bez VITE_ prefiksa). Ovo se radi ručno.
