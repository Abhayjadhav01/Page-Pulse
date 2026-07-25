# Page Pulse ⚡

A web tool that audits any URL and returns a detailed page report — including HTTP status, response time, SEO metadata, heading structure, image accessibility checks, and word count.

**Live demo:** [https://page-pulse-tgcn.onrender.com](https://page-pulse-tgcn.onrender.com)

---

## Features

- **HTTP Status** & response time measurement
- **Page Title** and **Meta Description** extraction
- **H1 Heading** count
- **Images missing alt text** detection (accessibility compliance check)
- **Approximate word count** from body content
- Clean, responsive dark UI (no framework dependencies)
- Comprehensive error handling (invalid URLs, timeouts, non-HTML responses, network failures)
- Modular, testable parsing logic with unit test coverage

## Tech Stack

| Layer      | Technology                                |
| ---------- | ----------------------------------------- |
| Backend    | Node.js, Express                          |
| HTTP       | Axios (with timeout & redirect handling)  |
| HTML Parse | Cheerio (fast jQuery-like DOM traversal)  |
| Frontend   | Vanilla HTML, CSS, JavaScript             |
| Testing    | Jest                                      |

## Installation

```bash
git clone https://github.com/Abhayjadhav01/Page-Pulse.git
cd Page-Pulse
npm install
npm start
```

The server will start at `http://localhost:3000`.

## How to Run Locally

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run unit tests
npm test
```

Open your browser to [http://localhost:3000](http://localhost:3000), enter a URL, and click **Audit**.

## API Contract

### `POST /api/audit`

Audit a URL and receive a structured JSON report.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Success Response (200):**
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

### Error Responses

| Status | Condition                                  | Example Body |
| ------ | ------------------------------------------ | ------------ |
| 400    | Missing or malformed URL / non-HTML content | `{ "error": "A valid URL is required." }` |
| 400    | DNS resolution failure                     | `{ "error": "Could not resolve the hostname..." }` |
| 408    | Request timeout (10s limit)                | `{ "error": "Request timed out..." }` |
| 502    | Target server HTTP error (4xx/5xx)         | `{ "error": "Client error: HTTP 404..." }` |
| 500    | Unexpected server error                    | `{ "error": "An unexpected error occurred..." }` |

## Design Decisions

### 1. Modular parsing extracted into `src/parser.js`

The HTML parsing logic was originally inlined inside the Express route handler. By extracting it into a dedicated, pure-function module, we gain:
- **Testability:** The parser can be unit-tested with mock HTML without spinning up a server or making network requests.
- **Separation of concerns:** Route handlers focus on request/response flow; the parser focuses on data extraction.
- **Reusability:** The same parsing function could be reused in batch processing, CLI tools, or worker threads.

### 2. Cheerio over JSDOM

Cheerio was chosen instead of JSDOM because:
- It is significantly faster and lighter (no full DOM emulation).
- Page Pulse only needs querying and traversing — Cheerio's jQuery-like API is ideal.
- Smaller memory footprint per request, important for a free-tier deployment.

### 3. Vanilla frontend (no framework)

The UI is intentionally built with plain HTML, CSS, and JavaScript:
- Zero build step — no webpack, Babel, or bundler required.
- Instant page loads with no framework runtime overhead.
- The application is simple enough that a framework would add unnecessary complexity.
- Easy to understand and modify by any developer familiar with the platform.

## Future Improvements

- [ ] Add a **loading skeleton** while the audit request is in flight
- [ ] Support **batch auditing** (multiple URLs in one request)
- [ ] Export report as **PDF or CSV**
- [ ] **SEO score** calculation based on extracted metadata
- [ ] **History dashboard** — save past audits in local storage or a database
- [ ] **Dark/Light theme toggle**
- [ ] **Rate limiting** to prevent abuse on public deployments
- [ ] **Open Graph / Twitter Card** metadata extraction
- [ ] **Lighthouse-style** performance suggestions

## Deployment

### Deploy to Render (Free)

1. Go to **[https://render.com](https://render.com)** and sign up (GitHub login works)
2. Click **New +** → **Web Service**
3. Connect your GitHub account and select the `Page-Pulse` repo
4. Configure:
   - **Name:** `page-pulse`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free
5. Click **Create Web Service**

Render will auto-deploy. Your URL will be: `https://page-pulse-tgcn.onrender.com`

> ⚠️ The free tier spins down after 15 minutes of inactivity. The first request after idle may take ~30s to wake up.

### Using the Live API

```bash
curl -X POST https://page-pulse-tgcn.onrender.com/api/audit \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

## Loom Demo

[▶️ Watch a walkthrough of Page Pulse](https://www.loom.com) *(https://www.loom.com/share/fb714ffb1b2e4112823a7b3c934d1d2c)*

## Project Structure

```
Page-Pulse/
├── package.json          # Dependencies & scripts
├── server.js             # Express API server (entry point)
├── src/
│   └── parser.js         # HTML parsing logic (extracted for testability)
├── tests/
│   └── parser.test.js    # Jest unit tests for the parser
├── .gitignore
├── README.md
└── public/
    ├── index.html        # Frontend UI
    ├── style.css         # Dark theme styles
    └── script.js         # Frontend logic
```

## License

MIT
