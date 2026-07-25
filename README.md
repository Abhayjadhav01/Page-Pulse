# Page Pulse ⚡

A web tool that audits any URL and returns a detailed page report.

## Features

- **HTTP Status** & Response Time
- **Page Title** & Meta Description extraction
- **H1 Heading** count
- **Images missing alt text** detection (accessibility check)
- **Approximate word count**
- Clean, responsive UI
- Comprehensive error handling (invalid URLs, timeouts, non-HTML responses)

## Tech Stack

- **Backend:** Node.js + Express + Axios + Cheerio
- **Frontend:** Vanilla HTML, CSS, JavaScript (no frameworks)

## Installation

```bash
git clone https://github.com/yourusername/page-pulse.git
cd page-pulse
npm install
npm start
```

The server will start at `http://localhost:3000`.

## API

### `POST /api/audit`

**Request body:** `{ "url": "https://example.com" }`

**Response (200):**
```json
{
  "url": "https://example.com",
  "status": 200,
  "responseTime": 342,
  "title": "Example Domain",
  "metaDescription": "Example description",
  "h1Count": 1,
  "imagesMissingAlt": [],
  "imagesMissingAltCount": 0,
  "wordCount": 150
}
```

## Deployment

Can be deployed to any Node.js hosting platform (Render, Railway, Fly.io, etc.).

## License

MIT

