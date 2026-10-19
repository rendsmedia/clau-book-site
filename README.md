# clau-book-site

Website for **William Matovu** and his book *Compulsory Land Acquisition for Road Infrastructure Projects in Uganda*. Plain HTML, no build step.

- **Permanent home:** https://williammatovu.com (all canonical and share links already point here)
- **Staging:** https://book.rendsmedia.com, password-protected and kept off Google

## Branches

| Branch | Deploys to | Search engines |
| --- | --- | --- |
| `main` | `book.rendsmedia.com` (staging) | Blocked: noindex meta + `X-Robots-Tag` header + password |
| `launch` | `williammatovu.com` (live) | **Still blocked** until the "Go public on Google" step below |

All edits go to `main` first. When a change is approved, merge `main` into `launch`.

## Layout

- `site/` — everything that gets published. Only this folder is copied to the server.
- `.cpanel.yml` — cPanel Git Version Control deploy tasks (the target folder differs per branch).

## Deploy staging (now)

1. cPanel → Git Version Control → Create
   - Clone URL: `https://github.com/rendsmedia/clau-book-site.git` (private repo: use `git@github.com:rendsmedia/clau-book-site.git` and add cPanel's SSH key as a read-only deploy key on GitHub)
   - Repository path: `/home/rends/repositories/clau-book-site`
   - Branch: `main`
2. Manage → Pull or Deploy → **Update from Remote**, then **Deploy HEAD Commit**.
   Files land in `/home/rends/public_html/book.rendsmedia.com/`. If your subdomain's document root is different, change `DEPLOYPATH` in `.cpanel.yml`.
3. cPanel → Directory Privacy → `public_html/book.rendsmedia.com` → password protect, add users for the team and the author.

## Launch on williammatovu.com (later)

1. Add williammatovu.com to cPanel. If its document root is not `/home/rends/public_html/williammatovu.com/`, change `DEPLOYPATH` on the `launch` branch.
2. cPanel → Git Version Control → Create a second clone of the same repo, path `/home/rends/repositories/williammatovu-com`, branch `launch`.
3. **Update from Remote**, then **Deploy HEAD Commit**.
4. Redirect `book.rendsmedia.com` → `https://williammatovu.com` (cPanel → Domains → Redirects).

## Go public on Google (only when the author approves)

On the `launch` branch: remove the `X-Robots-Tag` block from `site/.htaccess` (keep the https redirect), remove the `<meta name="robots" ...>` line in `site/index.html`, add a sitemap, deploy, then submit in Google Search Console.

## Amazon button

Every "Buy on Amazon" button sends readers to the Amazon store for their country (amazon.co.uk in the UK, amazon.de in Germany, amazon.com for Uganda, the US and anywhere without a local store). It uses the Kindle edition's ASIN, set once in `site/index.html`:

```js
var AMAZON_ASIN = "B0B9K66JQT";
```

Kindle edition: https://www.amazon.com/dp/B0B9K66JQT. Print in Uganda: [Aristoc Booklex](https://www.aristocbooklex.com/book/compulsory-land-acquisition-for-road-infrastructure-in-uganda).

## Before launch

- [ ] Add launch photos and the three YouTube videos
- [ ] Author approves all wording, especially "The debates"
