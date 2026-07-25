/**
 * parser.js — HTML parsing logic for Page Pulse.
 *
 * Extracts audit data (title, meta description, H1 count,
 * images missing alt text, word count) from raw HTML using Cheerio.
 *
 * Extracted from server.js to enable unit testing.
 */

const cheerio = require('cheerio');

/**
 * Parse raw HTML and return a structured audit report fragment.
 *
 * @param {string} html — The raw HTML string to parse.
 * @param {string} url  — The URL that was fetched (included in output for context).
 * @returns {object}    — Report object containing title, metaDescription,
 *                        h1Count, imagesMissingAlt, imagesMissingAltCount, wordCount.
 */
function parseHtml(html, url) {
  // Handle empty or non-string input gracefully
  if (!html || typeof html !== 'string' || html.trim().length === 0) {
    return {
      url: url || '',
      title: null,
      metaDescription: null,
      h1Count: 0,
      imagesMissingAlt: [],
      imagesMissingAltCount: 0,
      wordCount: 0,
    };
  }

  const $ = cheerio.load(html);

  // Extract page title (first <title> tag)
  const title = $('title').first().text().trim() || null;

  // Extract meta description content attribute
  const metaDescription = $('meta[name="description"]').attr('content') || null;

  // Count <h1> elements
  const h1Count = $('h1').length;

  // Collect all <img> elements that are missing or have empty alt text
  const imagesMissingAlt = [];
  $('img').each((i, el) => {
    const src = $(el).attr('src');
    const alt = $(el).attr('alt');
    if (!alt || alt.trim() === '') {
      imagesMissingAlt.push(src || '(no src attribute)');
    }
  });

  // Approximate word count from <body> text content
  const textContent = $('body').text();
  const words = textContent
    .replace(/[\s]+/g, ' ')
    .trim()
    .split(' ')
    .filter(w => w.length > 0);
  const wordCount = words.length;

  return {
    url,
    title,
    metaDescription,
    h1Count,
    imagesMissingAlt,
    imagesMissingAltCount: imagesMissingAlt.length,
    wordCount,
  };
}

module.exports = { parseHtml };
