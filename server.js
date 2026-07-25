const express = require('express');
const axios = require('axios');
const { parseHtml } = require('./src/parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// POST /api/audit - Accept a URL and return a JSON audit report
app.post('/api/audit', async (req, res) => {
  const { url } = req.body;

  // 1. Validate URL is present
  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    return res.status(400).json({ error: 'A valid URL is required.' });
  }

  let normalizedUrl = url.trim();

  // 2. Basic URL format validation
  try {
    // If no protocol, prepend https://
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    new URL(normalizedUrl);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format. Please enter a valid URL (e.g., https://example.com).' });
  }

  const startTime = Date.now();

  try {
    // 3. Fetch the page with a timeout
    const response = await axios.get(normalizedUrl, {
      timeout: 10000, // 10s timeout
      responseType: 'text',
      maxRedirects: 5,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PagePulse/1.0; +https://pagepulse.dev)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    const responseTime = Date.now() - startTime;

    // 4. Check content-type is HTML
    const contentType = response.headers['content-type'] || '';
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
      return res.status(400).json({
        error: `The URL did not return an HTML page. Content-Type received: "${contentType}". Only HTML pages can be audited.`,
        status: response.status,
        responseTime,
      });
    }

    const html = response.data;
    // Delegate HTML parsing to the testable parser module
    const parsedData = parseHtml(html, normalizedUrl);

    // 7. Build the report — merge parsed data with fetch metadata
    const report = {
      ...parsedData,
      status: response.status,
      responseTime,
    };

    return res.json(report);
  } catch (error) {
    // 8. Handle specific error types gracefully
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout') || error.message.includes('timeout of')) {
      return res.status(408).json({
        error: 'Request timed out. The URL took too long to respond (limit: 10 seconds).',
      });
    }

    if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
      return res.status(400).json({
        error: `Could not resolve the hostname. Please check that "${normalizedUrl}" is a valid domain.`,
      });
    }

    if (error.code === 'ECONNREFUSED') {
      return res.status(400).json({
        error: 'Connection refused. The server at the given URL is not accepting connections.',
      });
    }

    if (error.response) {
      // HTTP error status (4xx, 5xx)
      const status = error.response.status;
      let message = `The server responded with HTTP status ${status}.`;

      if (status >= 400 && status < 500) {
        message = `Client error: HTTP ${status}. The page could not be accessed (e.g., not found, forbidden).`;
      } else if (status >= 500) {
        message = `Server error: HTTP ${status}. The target server encountered an internal error.`;
      }

      return res.status(502).json({
        error: message,
        status,
      });
    }

    // Fallback for any other unexpected errors
    console.error('Unexpected error auditing URL:', error.message);
    return res.status(500).json({
      error: 'An unexpected error occurred while auditing the URL. Please try again.',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Page Pulse server running on http://localhost:${PORT}`);
});
