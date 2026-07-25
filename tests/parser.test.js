/**
 * parser.test.js — Unit tests for the HTML parsing logic.
 *
 * Tests three scenarios:
 * 1. Happy path — valid HTML with all expected elements.
 * 2. Missing title & meta description.
 * 3. Invalid / empty HTML input.
 */

const { parseHtml } = require('../src/parser');

// ---------------------------------------------------------------------------
// Test 1: Happy path — valid HTML with title, meta description, h1, images
// ---------------------------------------------------------------------------
test('parses valid HTML and extracts all fields correctly', () => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>My Test Page</title>
        <meta name="description" content="A page for testing." />
      </head>
      <body>
        <h1>Welcome</h1>
        <p>Hello world. This is some text content for word count.</p>
        <img src="logo.png" alt="Logo" />
        <img src="banner.jpg" alt="" />
        <img src="photo.jpg" />
      </body>
    </html>
  `;

  const result = parseHtml(html, 'https://example.com');

  expect(result).toMatchObject({
    url: 'https://example.com',
    title: 'My Test Page',
    metaDescription: 'A page for testing.',
    h1Count: 1,
    imagesMissingAlt: ['banner.jpg', 'photo.jpg'],
    imagesMissingAltCount: 2,
  });
  // wordCount: "Welcome Hello world. This is some text content for word count." = 11 words
  expect(result.wordCount).toBeGreaterThanOrEqual(10);
});

// ---------------------------------------------------------------------------
// Test 2: HTML without title or meta description
// ---------------------------------------------------------------------------
test('returns null for missing title and meta description', () => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head></head>
      <body>
        <h1>Only Heading</h1>
        <p>Some text.</p>
      </body>
    </html>
  `;

  const result = parseHtml(html, 'https://example.com');

  expect(result.title).toBeNull();
  expect(result.metaDescription).toBeNull();
  expect(result.h1Count).toBe(1);
  expect(result.imagesMissingAlt).toEqual([]);
  expect(result.imagesMissingAltCount).toBe(0);
  expect(result.wordCount).toBeGreaterThanOrEqual(2);
});

// ---------------------------------------------------------------------------
// Test 3: Invalid / empty HTML input
// ---------------------------------------------------------------------------
test('handles empty HTML gracefully', () => {
  const result = parseHtml('', 'https://example.com');

  expect(result.title).toBeNull();
  expect(result.metaDescription).toBeNull();
  expect(result.h1Count).toBe(0);
  expect(result.imagesMissingAlt).toEqual([]);
  expect(result.imagesMissingAltCount).toBe(0);
  expect(result.wordCount).toBe(0);
});

test('handles null HTML gracefully', () => {
  const result = parseHtml(null, 'https://example.com');

  expect(result.title).toBeNull();
  expect(result.h1Count).toBe(0);
  expect(result.wordCount).toBe(0);
});
