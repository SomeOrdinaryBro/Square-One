<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/14aLH3BuPyV9Kx32YEFcCwbswtlKzcGzP

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy

This project uses Vite's static build output, so it is compatible with GitHub Pages. The Vite config is set to emit relative asset paths (`base: './'`), which keeps bundles working whether the site is hosted at the domain root or a subpath like `/Square-One/`.

To produce the static assets, run:

```
npm run build
```

Then publish the contents of the `dist` folder to the `gh-pages` branch or your chosen static host.
