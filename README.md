# ANKIT BELBASE PORTFOLIO

A cinematic personal portfolio presented as a dark, navigable universe. The site uses a single-page Next.js interface with a procedural 3D scene, destination navigation, and accessible portfolio information.

## Links

- Repository: [github.com/JustAnkit0001/About-Me](https://github.com/JustAnkit0001/About-Me)
- Website: [ankitbelbase.com.np](https://ankitbelbase.com.np)
- Portfolio editor: `/editor/`

## Features

- Interactive cosmic navigation with five destination planets
- Optional intro overlay with skip flow and reduced-motion support
- Centralized portfolio data file for easy editing
- Accessible project, skills, and contact content outside the visual scene
- Responsive layout for desktop, tablet, and mobile
- Static deployment-friendly setup for Cloudflare Pages

## Stack

- Next.js
- React
- TypeScript
- Lucide React
- Tailwind CSS

## Prerequisites

- Node.js 20+
- npm

## Installation

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Cloudflare Pages deployment

1. Connect the repository to Cloudflare Pages.
2. Use the framework preset for Next.js or a static export workflow if needed.
3. Set the output directory to `.next` or follow the deployment instructions for the build system in use.
4. Ensure environment variables are set only if you add external services later.

## Content updates

Edit the data in `src/data/portfolio.ts` to replace placeholder content with real information, project links, education, and social links.

## Notes

This project uses placeholder values where personal details were not provided. Replace those entries before publishing.
