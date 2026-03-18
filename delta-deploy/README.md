# Delta BPM AI Workbench

Business Process Management tool with BPMN table editing, diagram visualization, friction analysis, and Happy Path focus.

## Quick Start (Local)

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Deploy to Vercel (Recommended — Free)

### One-time setup:

1. **Create a GitHub repo:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
   Push to GitHub (create repo at github.com/new)
   ```bash
   git remote add origin https://github.com/YOUR_USER/delta-bpm.git
   git branch -M main
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com) → Sign up with GitHub
   - Click "New Project" → Import your GitHub repo
   - Framework: **Vite** (auto-detected)
   - Click **Deploy**
   - Done! You get a live URL like `delta-bpm.vercel.app`

### To update (every time you get new code from Claude):

1. Replace `src/DeltaApp.jsx` with the new file
2. If the new file uses `window.storage`, replace with `localStorage`:
   - `window.storage.set("key", value)` → `localStorage.setItem("key", value)`
   - `await window.storage.get("key")` → `{ value: localStorage.getItem("key") }`
3. Commit and push:
   ```bash
   git add .
   git commit -m "Update from Claude"
   git push
   ```
4. Vercel auto-deploys in ~30 seconds. Live URL updates automatically.

## Deploy to Netlify (Alternative — Free)

```bash
npm run build
```

Upload the `dist/` folder to [netlify.com](https://netlify.com) → drag and drop.

Or connect GitHub repo for auto-deploy (same as Vercel).

## Project Structure

```
delta-deploy/
├── index.html            # Entry HTML
├── package.json          # Dependencies
├── vite.config.js        # Build config
├── tailwind.config.js    # Tailwind CSS
├── postcss.config.js     # PostCSS
├── src/
│   ├── main.jsx          # React entry point
│   ├── index.css         # Global styles + Tailwind
│   └── DeltaApp.jsx      # Main application (from Claude)
└── README.md
```

## Updating DeltaApp.jsx

When Claude generates a new version of `delta-app.jsx`:

1. Download the file from Claude
2. Rename to `DeltaApp.jsx` (capital D)
3. Replace `src/DeltaApp.jsx`
4. Run the storage replacement (step 2 above)
5. `git add . && git commit -m "Update" && git push`

## Tech Stack

- **React 18** + **Vite 5** (build tool)
- **Tailwind CSS 3** (utility styles)
- **Lucide React** (icons)
- **SheetJS/xlsx** (Excel export)
- **localStorage** (user preferences persistence)
