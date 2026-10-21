# Soukday Web - Customer Platform

The official Soukday on-demand grocery and multi-vendor customer web application (built on Next.js, Redux, and Tailwind CSS).

## Getting Started

First, install dependencies:
```bash
npm install --legacy-peer-deps
```

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Production Build & Static Export

To build the static export for LiteSpeed/cPanel deployment:
```bash
npm run build
```
This builds the site with `NEXT_PUBLIC_SEO=false` and executes `post-export.js` to format assets into `./out/next-assets/` with an `.htaccess` rewrite configuration.

## Deploying

Changes pushed to the `main` branch automatically trigger GitHub Actions to build and deploy to [https://new.soukday.ca](https://new.soukday.ca).
