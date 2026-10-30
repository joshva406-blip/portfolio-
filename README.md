# Joshva — The Full Stack

A Next.js portfolio for Joshva, a full-stack developer in Coimbatore. It uses a hand-illustrated SVG mascot, scroll scenes, a scratch card, project case studies and a contact API.

## Requirements

- Node.js 20 or later and npm
- MongoDB database and Resend account to enable the contact form
- A verified sender domain in Resend

## Run locally

```bash
npm ci
cp .env.example .env.local
# Fill in values as needed; never commit .env.local
npm run dev
```

Open http://localhost:3000. The site runs without contact credentials, but submitting the form will return a clear configuration error. GitHub statistics use the public GitHub API and can be subject to its rate limits.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string. |
| `MONGODB_DB` | Database name; defaults to `joshva_portfolio`. |
| `RESEND_API_KEY` | Server-side Resend API key. |
| `CONTACT_FROM_EMAIL` | Sender address on a verified Resend domain, e.g. `Portfolio <portfolio@your-domain.example>`. |
| `CONTACT_TO_EMAIL` | Optional recipient; defaults to Joshva's email. |
| `NEXT_PUBLIC_SITE_URL` | Public canonical origin, e.g. `https://your-domain.example`; set at **build time** for social metadata and sitemap. |

The app also detects Vercel's `VERCEL_PROJECT_PRODUCTION_URL` if an explicit public URL is not set. Until a public URL is set, the sitemap is intentionally empty and Next.js may warn that it is using localhost for Open Graph metadata. Redeploy after setting the URL.

## Contact API and privacy

`POST /api/contact` validates with Zod, discards honeypot submissions, and uses a MongoDB-backed fixed-window limit of five requests per IP per hour. The IP is hashed with the current hour before storage, and rate-limit records expire through a MongoDB TTL index. The app trusts the first `X-Forwarded-For` value supplied by the deployment proxy; configure your proxy to overwrite untrusted forwarding headers. If no IP header exists, requests share an `unknown` bucket. Fixed windows are not rolling windows, so bursts around an hour boundary can exceed five requests in a rolling 60-minute period.

Valid messages are stored in `contact_messages`, then sent with Resend. Delivery status is recorded. A failed email can leave a saved message; the API reports the failure rather than claiming delivery. Protect database access and define your own retention policy before launch. The system has **not** been tested end-to-end with actual credentials yet.

`GET /api/stats` fetches the public GitHub profile and caches the result for one hour. It returns an error if GitHub is unavailable.

## Build and checks

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

The CI workflow runs these checks on pushes and pull requests. The production build uses Next.js standalone output.

## Vercel deployment

1. Push this project to your GitHub repository and import it in Vercel.
2. Use the Next.js defaults; set the variables above in Vercel's project settings. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin.
3. Deploy, then submit a real test message and verify **both** the MongoDB record and email delivery. Confirm the verified sender and recipient are correct.
4. Verify GitHub stats, the sitemap, Open Graph preview, and the site at mobile and desktop sizes.

No Vercel project has been created or deployed by this repository.

## Docker

```bash
docker build --build-arg NEXT_PUBLIC_SITE_URL=https://your-domain.example -t joshva-portfolio .
docker run --rm -p 3000:3000 --env-file .env.local joshva-portfolio
```

The public URL is embedded during the image build; server-only secrets are passed at runtime. Do not bake credentials into the image.

## Content still needed

- Actual screenshots for each project and project-specific GitHub/live URLs.
- Actual project years, hackathon name, year and place.
- `public/Joshva_Resume.pdf` and a linked download button.
- MongoDB and Resend configuration and an end-to-end contact test.

The portrait is an **original illustrated SVG**, not a processed photo. Project mockups and scores are clearly labelled illustrations, not actual screenshots or measured results. Case-study architecture diagrams are conceptual.

## Known limitations / follow-up

- A local mobile Lighthouse run measured 92 Performance, 100 Accessibility, 100 Best Practices and 100 SEO after deferring below-the-fold effects; results vary by environment.
- Scene wipes use contrast-safe curtain overlays. Full scene pinning, screenshot parallax and WebGL tile-hover sweeps are not complete.
- The browser checks exercised representative interactions but are not a substitute for full touch-device and assistive-technology testing. Verify contact delivery and proxy rate-limiting in the production environment.
- The selected fonts are locally hosted General Sans; small labels currently use a system monospace fallback.
