# 24 Frames Under

**On film music, buried and otherwise.**

Personal blog covering scores, soundtracks, and composers — the heard and the unheard, the canonical and the neglected. A continuation of the book *24 Frames Under: A Buried History of Film Music*.

Live at [24frames-filmmusic.com](https://24frames-filmmusic.com)

---

## Stack

- **Frontend**: Next.js 14 (App Router)
- **CMS**: Sanity v3
- **Hosting**: Netlify
- **Studio**: [studio.24frames-filmmusic.com](https://studio.24frames-filmmusic.com)

---

## Local development

### Prerequisites

- Node.js v20
- A Sanity account with access to the FilmMusicBlog project

### Setup

```bash
git clone https://github.com/RussellLack/24frames-filmmusic
cd 24frames-filmmusic
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=m9y4l380
NEXT_PUBLIC_SANITY_DATASET=production
```

```bash
npm run dev
```

Blog runs at `http://localhost:3000`.

---

## Content

Posts are managed in Sanity Studio. Each post has:

- **Title** and **slug**
- **Category**: score, composer, soundtrack, or essay
- **Subject**: the specific film, composer, or album
- **Excerpt**: shown on the home page listing
- **Cover image**: optional, displays at natural proportions
- **Body**: rich text with inline images
- **Further reading**: up to 10 external links, shown at the bottom of each post

---

## Deployment

Deploys automatically to Netlify on push to `main`.

Environment variables are set in the Netlify dashboard.

---

## Studio

The Sanity Studio is a separate repository at [RussellLack/24frames-studio](https://github.com/RussellLack/24frames-studio), deployed to Netlify.
