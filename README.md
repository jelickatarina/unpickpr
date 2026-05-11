# 🌸 Unpick — PWA

Aplikacija za podršku osobama koje se bore sa dermatilomanijom.

## Pokretanje lokalno

```bash
npm install
npm run dev
```

## Deploy na Vercel (besplatno)

### Opcija 1 — Vercel CLI (preporučeno)
```bash
npm install -g vercel
npm run build
vercel --prod
```

### Opcija 2 — GitHub + Vercel (automatski deploy)

1. Napravi GitHub nalog na https://github.com
2. Napravi novi repozitorijum (npr. `unpick`)
3. Upload sve fajlove iz ovog foldera
4. Idi na https://vercel.com → "New Project"
5. Poveži GitHub nalog → izaberi `unpick` repozitorijum
6. Build settings su automatski (Vite/React)
7. Klikni **Deploy** → za ~1 minutu app je online!

## Instalacija na telefon

### iPhone (iOS 16.4+)
1. Otvori app link u **Safari**
2. Klikni dugme Deli (□↑)
3. Izaberi **"Dodaj na početni ekran"**
4. Klikni **Dodaj**

### Android
1. Otvori app link u **Chrome**
2. Pojaviće se baner "Instaliraj app"
3. Ili: meni (⋮) → **"Dodaj na početni ekran"**

## Push notifikacije (opciono, kasnija faza)
- Firebase Cloud Messaging (FCM) — besplatno
- Dodati u `src/firebase.js`

## Struktura projekta
```
unpick/
├── public/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── apple-touch-icon.png
├── src/
│   ├── App.jsx        ← cela aplikacija
│   └── main.jsx       ← entry point
├── index.html
├── vite.config.js     ← PWA konfiguracija
├── vercel.json        ← Vercel routing
└── package.json
```
