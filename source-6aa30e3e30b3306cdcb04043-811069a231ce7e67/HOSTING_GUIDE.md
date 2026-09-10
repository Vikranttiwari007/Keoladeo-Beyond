# Hosting & Admin Guide — manojtiwariphotography.com

This site is plain HTML/CSS/JS — no server, no database, no monthly software cost.
It's hosted for free on **Netlify**, content lives in a **GitHub** repository, and the
photographer manages everything through a visual **admin panel** at `/admin` — no code
ever needs to be touched again after today.

Total time to get live: **20–30 minutes**. You only do this once.

---

## Part 1 — Put the site on GitHub

GitHub is just the storage locker for the website's files. Netlify will watch it and
publish automatically every time something changes.

1. Go to **github.com** and create a free account (if you don't have one).
2. Click **New repository**. Name it `manoj-tiwari-photography`. Keep it **Public** or
   **Private** — either works. Click **Create repository**.
3. On the new repo's page, click **uploading an existing file**.
4. Drag in the entire website folder's contents (everything inside the `site` folder
   you received — `index.html`, `gallery.html`, the `css`, `js`, `data`, `assets`, and
   `admin` folders, `netlify.toml`, `404.html`).
5. Scroll down, click **Commit changes**.

That's it — your website's source files now live in GitHub.

---

## Part 2 — Publish it with Netlify

1. Go to **netlify.com** → sign up free, choosing **"Sign up with GitHub"** (simplest —
   it links the two automatically).
2. Click **Add new site → Import an existing project**.
3. Choose **GitHub**, then pick the `manoj-tiwari-photography` repository.
4. Build settings: leave everything as default (this site needs no build step —
   **Publish directory** should just be `/` or blank). Click **Deploy site**.
5. Within a minute, Netlify gives you a live URL like `chic-heron-1234.netlify.app`.
   Open it — the site is now live on the internet.

### Connect your real domain (optional but recommended)

If you own `manojtiwariphotography.com` (or want to buy it — any registrar like
Namecheap or GoDaddy works):

1. In Netlify: **Site settings → Domain management → Add a domain**.
2. Enter your domain and follow Netlify's instructions — it will give you either
   nameservers to set at your registrar, or a couple of DNS records to add. Netlify's
   on-screen instructions are copy-paste; no technical knowledge is required.
3. Netlify also provisions a free HTTPS certificate automatically — nothing to do there.

---

## Part 3 — Turn on the admin panel

The admin panel (`/admin`) needs two free Netlify features switched on: **Identity**
(login accounts) and **Git Gateway** (lets logged-in editors save changes without
needing a GitHub account themselves).

1. In your Netlify site dashboard: **Site configuration → Identity → Enable Identity**.
2. Under **Identity → Registration**, set it to **Invite only** (so strangers can't
   sign up to your admin panel).
3. Under **Identity → Services → Git Gateway**, click **Enable Git Gateway**.
4. Go to the **Identity** tab → **Invite users** → enter the photographer's email
   address. They'll get an email with a link to set a password.
5. Once the password is set, they can log in at:

   **`https://yoursite.com/admin/`**

That's the entire setup. From here on, no one needs GitHub, Netlify, or code again.

---

## Part 4 — Using the admin panel (for Manoj)

Go to **yoursite.com/admin**, log in, and you'll see two sections:

### "Photographs"
- Click **New Photo collection entry** — actually, since all photos live in one
  organized list, click into **Photo collection**, then **Add "Photographs"** to add a
  new photo, or click any existing entry in the list to edit or delete it.
- Fill in: title, species, location, category (Birds / Mammals / Reptiles /
  Landscapes), whether it should appear on the Home page ("Show on Home page"), an
  optional field-note caption, and upload the photo itself.
- Click **Publish** (top right). The live site updates automatically within about a
  minute — no need to touch anything else.

### "Site settings"
- Edit the homepage headline/subheading, the About page story and photo, and the
  contact email, Instagram link, and location shown in the footer.
- Click **Publish** to push the change live.

**Tip on photo size:** upload photos around 2000px on the long edge. Anything larger
just slows the site down without looking any sharper on screen. Any free tool (or even
just resizing in the phone's Photos app before uploading) works fine.

---

## Part 5 — Connect the contact form (5 minutes, optional)

The contact form currently falls back to opening an email draft. To have submissions
land straight in an inbox instead:

1. Go to **formspree.io** → sign up free.
2. Create a new form, copy the **Form ID** it gives you (looks like `xborqzpa`).
3. Open `contact.html` in GitHub (or ask whoever manages the code), find this line:

   ```html
   <form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

4. Replace `YOUR_FORM_ID` with the real ID, save/commit the change. Netlify redeploys
   automatically. Formspree's free plan covers 50 submissions/month, which is plenty
   for a photography enquiry form.

---

## What "non-technical maintenance" looks like day-to-day

- **Add a new photo from a shoot:** log into `/admin`, add a photograph entry, upload
  the file, publish. Done.
- **Change the homepage text:** `/admin` → Site settings → edit → publish.
- **Nothing to update, back up, patch, or pay for** — Netlify's free tier comfortably
  covers a portfolio site like this one (100GB bandwidth/month), and there's no
  database to maintain.

## If something looks broken

- Check **Netlify → Deploys** tab — it shows the build log for every publish and will
  flag if a save failed.
- The site itself never goes down because of an admin mistake — the admin panel only
  ever edits two data files (`photos.json`, `settings.json`); it can't touch the code
  that makes the site work.
