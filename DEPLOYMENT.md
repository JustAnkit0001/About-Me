# GitHub Pages deployment

GitHub Pages is currently configured to publish the `main` branch from the
repository root. Run `npm run build` to generate the static website in both
`docs/` and the repository root. The root export includes `index.html`, the
`_next/` assets, the custom-domain `CNAME`, and `.nojekyll` so Pages serves
Next.js assets without running them through Jekyll.

Commit the generated root files along with source changes so GitHub Pages can
publish the updated site. Keep the existing root `CNAME` file. The domain's
DNS must also point to GitHub Pages.
