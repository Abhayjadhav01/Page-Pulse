# Page Pulse ⚡

A web tool that audits any URL and returns a detailed page report.

**Live demo:** [https://page-pulse.onrender.com](https://page-pulse.onrender.com)

## Features

- **HTTP Status** & Response Time
- **Page Title** & Meta Description extraction
- **H1 Heading** count
- **Images missing alt text** detection (accessibility check)
- **Approximate word count**
- Clean, responsive dark UI
- Comprehensive error handling (invalid URLs, timeouts, non-HTML responses)

## Tech Stack

- **Backend:** Node.js + Express + Axios + Cheerio
- **Frontend:** Vanilla HTML, CSS, JavaScript (no frameworks)

## Installation

```bash
git clone https://github.com/Abhayjadhav01/Page-Pulse.git
cd Page-Pulse
npm install
npm start
```

The server will start at `http://localhost:3000`.

## API

### `POST /api/audit`

**Request body:**
```json
{ "url": "https://example.com" }
```

**Response (200):**
```json
{
  "url": "https://example.com",
  "status": 200,
  "responseTime": 342,
  "title": "Example Domain",
  "metaDescription": null,
  "h1Count": 1,
  "imagesMissingAlt": [],
  "imagesMissingAltCount": 0,
  "wordCount": 17
}
```

## Deploy to Render (Free)

This is the easiest way to get your instance live.

1. Go to **[https://render.com](https://render.com)** and sign up (GitHub login works)
2. Click **New +** → **Web Service**
3. Connect your GitHub account and select the `Page-Pulse` repo
4. Configure:
   - **Name:** `page-pulse` (or any name)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free
5. Click **Create Web Service**

Render will auto-deploy. Your URL will be: `https://page-pulse.onrender.com`

> ⚠️ The free tier spins down after 15 mins of inactivity. The first request after idle may take ~30s to wake up.

### Using the Live API

```bash
curl -X POST https://page-pulse.onrender.com/api/audit \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

## Project Structure

```
Page-Pulse/
├── package.json          # Dependencies
├── server.js             # Express API server
├── .gitignore
├── README.md
└── public/
    ├── index.html        # Frontend UI
    ├── style.css         # Dark theme styles
    └── script.js         # Frontend logic
```

## License

MIT

