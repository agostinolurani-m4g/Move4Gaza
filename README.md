# Move for Gaza — Sito (Vite + React + Tailwind)

## Avvio locale
1. Installa le dipendenze
   ```bash
   npm install
   npm run dev
   ```
   Apri http://localhost:5173

2. Configura in `src/App.jsx`:
   - `EVENT_CONFIG.payments` (PayPal/IBAN)
   - `SHEETS_CONFIG.url` (URL Web App Apps Script)
   - `SHEETS_CONFIG.secret` (uguale allo script)

## Deploy GitHub Pages
1. In `vite.config.js` aggiungi `base: "/move-for-gaza/"` (se il repo si chiama così).
2. Commit & push su `main`.
3. Repo → Settings → Pages → Source: GitHub Actions. Il workflow `deploy.yml` pubblica automaticamente.

## Apps Script — incolla nel tuo Foglio (Estensioni → Apps Script)
(vedi guida nella chat, è lo stesso snippet del README precedente)
