# Jacopo & Silvia — wedding website

Static site (HTML/CSS/JS, no build step) ready for GitHub Pages. Italian and English with a switch in the header.

## Files
```
index.html      home: blooming flower arch, falling petals (tap to throw more), countdown, links
location.html   ceremony + reception, maps, directions
gifts.html      honeymoon / IBAN with copy button, optional wish list
rsvp.html       RSVP with diet + allergy questions
photos.html     upload link + QR code for guests
css/style.css   all styling (colours at the top)
js/config.js    ← ALL YOUR DETAILS GO HERE
js/main.js      language, animations, forms
```

## 1. Fill in your details
Open `js/config.js` and change date, venues, addresses, IBAN, links. Every page reads from it.
To change a text, edit the HTML: each sentence appears twice, `<span lang="it">…</span>` and `<span lang="en">…</span>`.

## 2. RSVP answers (GitHub Pages can't store data by itself)
1. Create a free account at https://formspree.io and make a new form.
2. Copy the endpoint (looks like `https://formspree.io/f/abcdwxyz`) into `rsvpEndpoint` in `config.js`.
3. Answers arrive by e-mail and in the Formspree dashboard (exportable to CSV).

If `rsvpEndpoint` is empty, the form opens the guest's e-mail app pre-filled to `rsvpEmail`.

## 3. Photo uploads
Create an upload link and put it in `photoUploadUrl`:
- **Dropbox → File requests**: guests can upload without a Dropbox account (recommended).
- or a **Google Photos shared album** (guests need a Google account to add photos).

The QR code on the Photos page is generated automatically from that link — print it for the tables.

## 4. Publish on GitHub Pages
1. Create a repository (e.g. `wedding`) and upload all files keeping the folders.
2. Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. After a minute the site is at `https://<your-username>.github.io/wedding/`.
