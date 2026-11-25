# URL Shortener

A simple URL shortener built during my CodeAlpha Backend Development internship.

## Features
- Shorten any http/https URL into a 7-character code
- Redirect from the short link to the original URL
- Input validation (only http/https allowed)
- Duplicate detection: the same URL always returns the same code
- URL normalization (trailing slash, letter case)
- Simple web frontend with a copy button

## Tech Stack
- Node.js, Express
- SQLite (better-sqlite3)
- nanoid
- HTML, CSS, JavaScript

## Setup
1. Clone the repo
2. `npm install`
3. `npm start`
4. Open http://localhost:3000

## API

### POST /api/shorten
Body: `{ "url": "https://example.com" }`

| Status | Meaning |
|---|---|
| 201 | New short URL created |
| 200 | URL already existed, existing code returned |
| 400 | Invalid or missing URL |

### GET /:code
Redirects to the original URL, or returns 404 if the code doesn't exist.

## What I learned
- **Building a REST API with Express:** I made a POST route that creates short codes and a GET route with a route parameter (`/:code`) that redirects. I learned that route order matters, because Express uses the first match, so the `/:code` route has to come after the specific ones.
- **SQL and SQLite basics:** I created a table with a UNIQUE short code and a database index to make the duplicate lookup fast. I used placeholders (`?`) in every query so user input is treated as data, which prevents SQL injection.
- **Debugging:** A one-letter mismatch (`originalUrl` instead of `original_url`) made my redirect go to `/undefined`, with no error message. A mismatched HTML id caused a `null` error in the browser console. I learned that JavaScript fails silently on wrong names, so I now read the terminal and console first and compare names character by character.