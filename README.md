# Send It Athletics

A dark-themed, responsive static website for Send It Athletics volleyball leagues. Built with [Jekyll](https://jekyllrb.com/) for [GitHub Pages](https://pages.github.com/), with [Static CMS](https://staticcms.org/) for non-technical content editing.

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Intro, season info, latest announcements |
| Leagues | `/leagues.html` | League cards, registration link |
| Announcements | `/blog.html` | Blog / news index |
| Contact | `/contact.html` | Facebook, email, registration |
| CMS Admin | `/admin/` | Content editor (requires OAuth setup) |

## Local Development

### Run locally

```bash
pnpm run dev
```

Or with npm:

```bash
npm run dev
```

Open [http://localhost:4000/](http://localhost:4000/). Press `Ctrl+C` to stop.

The dev script uses `--baseurl ""` so local URLs are simpler. Production on GitHub Pages still uses `/sendit` from `_config.yml`.

**Prerequisites:** Ruby 3+ (install with `brew install ruby` if needed). The `bin/dev` script sets up the Homebrew Ruby path automatically.

## GitHub Pages Deployment

1. Create a GitHub repository named `sendit` (or your preferred name).

2. Update placeholders in these files:
   - [`_config.yml`](_config.yml) — set `url` and `baseurl`
   - [`admin/config.yml`](admin/config.yml) — set `repo`, `site_url`, `display_url`, and `base_url` (OAuth worker)

3. Push to GitHub:

   ```bash
   git init
   git add .
   git commit -m "Initial Send It Athletics site"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/sendit.git
   git push -u origin main
   ```

4. Enable GitHub Pages:
   - Go to **Settings → Pages**
   - Source: **Deploy from branch**
   - Branch: `main` / `/ (root)`
   - Save

5. Your site will be live at `https://YOUR_GITHUB_USERNAME.github.io/sendit/` within a few minutes.

### Custom domain

If using a custom domain at the root (e.g. `senditathletics.com`):

- Set `baseurl: ""` in `_config.yml`
- Add a `CNAME` file and configure DNS per [GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

---

## Static CMS Setup (Content Editor)

The admin panel at `/admin/` lets authorized users edit site settings, leagues, and announcements without touching code. Because GitHub Pages cannot handle OAuth directly, you need a **Cloudflare Worker** as an authentication proxy.

### Overview

```
Admin → /admin/ → Static CMS → Cloudflare OAuth Worker → GitHub API → Repo commit → GitHub Pages rebuild
```

### Step 1: Create a GitHub OAuth App

1. Go to [GitHub → Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name:** Send It Athletics CMS
   - **Homepage URL:** `https://YOUR_GITHUB_USERNAME.github.io/sendit` (or your custom domain)
   - **Authorization callback URL:** `https://sendit-cms-auth.YOUR_SUBDOMAIN.workers.dev/callback` (use your actual Worker URL after Step 2)
4. Click **Register application**
5. Note the **Client ID** and generate a **Client Secret**

### Step 2: Deploy Cloudflare OAuth Worker

We recommend [sterlingwes/decap-proxy](https://github.com/sterlingwes/decap-proxy) or [ottmartens/decap-cms-github-oauth-provider-cloudflare](https://github.com/ottmartens/decap-cms-github-oauth-provider-cloudflare).

**Using decap-proxy (sterlingwes):**

1. Create a [Cloudflare](https://dash.cloudflare.com/) account (free tier works)
2. Install Wrangler: `npm install -g wrangler`
3. Clone the proxy repo and follow its README
4. Set secrets on the Worker:
   ```bash
   wrangler secret put GITHUB_CLIENT_ID
   wrangler secret put GITHUB_CLIENT_SECRET
   ```
5. Deploy the Worker and note its URL (e.g. `https://sendit-cms-auth.yourname.workers.dev`)

**Using ottmartens provider:**

1. Fork [decap-cms-github-oauth-provider-cloudflare](https://github.com/ottmartens/decap-cms-github-oauth-provider-cloudflare)
2. Update `wrangler.toml` with your Cloudflare account ID
3. Set secrets:
   ```bash
   wrangler secret put CLIENT_ID
   wrangler secret put CLIENT_SECRET
   ```
4. Deploy via `wrangler deploy` or the included GitHub Action

### Step 3: Update admin/config.yml

Edit [`admin/config.yml`](admin/config.yml):

```yaml
backend:
  name: github
  repo: YOUR_GITHUB_USERNAME/sendit    # your actual repo
  branch: main
  base_url: https://sendit-cms-auth.YOUR_SUBDOMAIN.workers.dev
  auth_endpoint: auth

site_url: https://YOUR_GITHUB_USERNAME.github.io/sendit
display_url: https://YOUR_GITHUB_USERNAME.github.io/sendit
```

Commit and push these changes.

### Step 4: Grant repo access

The person editing content must:

1. Have a GitHub account
2. Be added as a **collaborator** on the repository (Settings → Collaborators), or be the repo owner

### Step 5: Test the CMS

1. Visit `https://YOUR_GITHUB_USERNAME.github.io/sendit/admin/`
2. Click **Login with GitHub**
3. Authorize the OAuth app
4. Edit **Site Settings**, **Leagues**, or **Announcements**
5. Click **Publish** — changes commit to the repo and GitHub Pages rebuilds in 1–2 minutes

### What admins can edit

| Collection | Edits |
|------------|-------|
| **Site Settings** | Season name, registration URL, contact email, Facebook URL, home tagline |
| **Leagues** | Format, location, day, time, open/full status, display order |
| **Announcements** | Title, date, excerpt, body (Markdown) |

---

## Project Structure

```
├── _config.yml           # Jekyll configuration
├── _data/site.yml        # Site-wide settings (CMS-editable)
├── _leagues/             # League entries (CMS-editable)
├── _posts/               # Announcements (CMS-editable)
├── _layouts/             # Page templates
├── _includes/            # Reusable components
├── assets/               # CSS, JS, images
├── admin/                # Static CMS admin panel
├── index.html            # Home page
├── leagues.html
├── blog.html
└── contact.html
```

## Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#000000` | Page background |
| Surface | `#1a1a1a` | Cards, footer |
| Red | `#e31e24` | Primary accent |
| Yellow | `#f5a623` | Secondary accent |
| Gradient | `#e31e24 → #f5a623` | Badges, buttons |

## License

Content and branding © Send It Athletics.
