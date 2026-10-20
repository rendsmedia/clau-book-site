# williammatovu.com

Website of **William Matovu** and his book *Compulsory Land Acquisition for Road Infrastructure Projects in Uganda* (CLAU). Plain HTML, CSS and JS, no build step.

Live: https://williammatovu.com · hosted on the **william1** cPanel account.

## Deploying an update

Every change goes to the `main` branch. Then, in william1's cPanel → **Git Version Control** → **Manage** → **Pull or Deploy**:

1. **Update from Remote**
2. **Deploy HEAD Commit**

`.cpanel.yml` copies `site/` into `/home/william1/public_html/` and stamps the commit code into the CSS/JS links (`?v=dev`) so browsers load the new version.

## Layout

- `site/` — everything that gets published. Only this folder is copied to the server.
  - `index.html` — homepage: the book, key questions, author, buy
  - `if-your-land-is-affected.html` → `/if-your-land-is-affected` (guide for families)
  - `work-with-william.html` → `/work-with-william`
  - `contact.html` → `/contact` (form; `/contact?enquiry=bulk` preselects the enquiry type)
  - `404.html` — not indexed
  - `contact.php` — form handler (not indexed)
  - `assets/css/site.css`, `assets/js/site.js` — shared by every page
  - `assets/brand/` — WM logo files and usage notes
  - `.htaccess` — one address (https://williammatovu.com, no www), clean URLs, no folder listings
  - `robots.txt`, `sitemap.xml` — for search engines. Add any new page to the sitemap.
- `tools/contact-form-google-script.gs` — mailer for when hello@ moves to Google Workspace
- `.cpanel.yml` — deploy tasks

## Contact form

`site/contact.php` emails each enquiry to **hello@williammatovu.com** and stores nothing. Spam is filtered with a hidden field and a minimum fill time.

- **While hello@ is a cPanel mailbox:** nothing to set up; the server delivers locally.
- **After moving hello@ to Google Workspace:**
  1. william1 cPanel → **Email Routing** → williammatovu.com → **Remote Mail Exchanger** (otherwise the server keeps delivering to the old cPanel mailbox).
  2. Set up `tools/contact-form-google-script.gs` in the hello@ Google account (steps in the file).
  3. Create `/home/william1/wm-mail-config.php` (outside `public_html`, never in this repo):
     ```php
     <?php return ['to' => 'hello@williammatovu.com', 'script_url' => 'https://script.google.com/macros/s/.../exec', 'secret' => '...'];
     ```
  4. Send a test message.

## Amazon button

"Buy on Amazon" sends readers to their own country's Amazon store, using the Kindle edition's ASIN in `site/assets/js/site.js`:

```js
var AMAZON_ASIN = "B0B9K66JQT";
```

Print in Uganda: [Aristoc Booklex](https://www.aristocbooklex.com/book/compulsory-land-acquisition-for-road-infrastructure-in-uganda).

## Search engines

- Google Search Console: domain property `williammatovu.com`, sitemap `https://williammatovu.com/sitemap.xml`.
- The homepage carries structured data for the book and its author.
