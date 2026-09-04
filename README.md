# Lovely Tiwana — Filmmaker Portfolio & Studio CMS

A high-end, cinematic dark-mode personal portfolio website built for **Lovely Tiwana** (Director · Cinematographer · Editor), inspired by [Chaitanya Chugh's website](https://www.chaitanyachugh.com/).

---

## 🌟 Key Features

1. **Cinematic Dark Editorial Design**:
   - Ultra-clean aesthetic, fluid typography (`Syne` & `Plus Jakarta Sans`), subtle 35mm film grain, and responsive grid layouts.
   - Status ticker: *Available for projects*, location, roles, and showreel timecode.

2. **Featured Showreel Player**:
   - High-impact hero showreel card with play button and glowing pulse indicator.
   - Full-screen Cinema Lightbox Modal supporting **YouTube**, **Vimeo**, and direct **MP4** videos.

3. **Dynamic Work & Filter Engine**:
   - Filter by Role: *All Work*, *Director*, *Cinematographer*, *Editor*.
   - Filter by Genre: *Commercials*, *Music Videos*, *Social Media*, *Fiction & Documentaries*.
   - Dynamic section tagline ("the WORK", "as DIRECTOR", "as CINEMATOGRAPHER", "as EDITOR") with matching blurbs.
   - Live search by project title, brand, or crew credit.

4. **Production Stills & Posters Gallery**:
   - Masonry layout showcasing film posters, anamorphic frames, and camera/lighting specs.
   - Click to open high-resolution image lightbox.

5. **Director Bio & Collaborations**:
   - Editorial monochrome portrait.
   - Story narrative, stats counters (*45+ Projects, 120M+ Views, 8 Awards*), and infinite brand marquee ticker (*Apple, Royal Enfield, Speed Records, White Hill Music, etc.*).

6. **Contact & Project Inquiry**:
   - Direct links for Email, WhatsApp, Phone, Instagram, Vimeo, and YouTube.
   - Interactive project inquiry form.

---

## 🛠 Built-in Studio CMS (Add Videos, Posters & Showreel)

The website comes with a built-in visual editor so you can easily update your portfolio anytime without touching code:

- **Open Studio CMS**: Click the **"Studio CMS"** button in the header or bottom-right corner (or simply press **`E`** on your keyboard).
- **Add New Project**:
  - Enter Project Title, Brand / Artist, select Genre, and check your Roles.
  - Paste any **YouTube Link** (`https://www.youtube.com/watch?v=...` or `https://youtu.be/...`), **Vimeo Link**, or direct **MP4 link**.
  - Paste an image URL or click **Choose File** to upload a poster thumbnail directly from your computer with live preview.
  - Enter year, highlight badge (e.g. *Trending #1*, *4K*), and crew credits.
  - Click **"Add New Project"** — it instantly updates on your live site!
- **Edit / Delete Projects**:
  - Switch to the **Manage** tab to edit details of any project or delete old ones.
- **Update Showreel**:
  - Switch to the **Showreel** tab to paste your new showreel video link, duration, and cover poster.
- **Permanent Backup & Export**:
  - Changes are auto-saved in your browser.
  - Switch to the **Backup** tab and click **"Download Updated projects.json"** to get the latest JSON file and replace `projects.json` in your folder.

---

## 🚀 How to Run the Website

### Option 1: Direct in Browser
Simply double-click **`index.html`** to open it directly in Google Chrome, Microsoft Edge, Brave, or Safari!

### Option 2: Local HTTP Server (Recommended)
Open PowerShell in this folder and run:
```powershell
.\server.ps1
```
This starts the local server at `http://localhost:3000` and automatically opens it in your default browser.
