# GitHub Pages deployment

Run `npm run build` to generate the static website in `docs/`. The generated
folder includes the custom-domain `CNAME` file and `.nojekyll` marker needed
for Next.js assets.

In the repository's GitHub Pages settings, choose **Deploy from a branch**,
select the `main` branch and `/docs` folder, then save. The domain's DNS must
also point to GitHub Pages.
