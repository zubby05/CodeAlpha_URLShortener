import express from "express";
import db from "./db.js";
import { nanoid } from "nanoid";

function isValidUrl(string) {
  try {
    const parsed = new URL(string);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeUrl(string) {
    const parsed = new URL(string);
    let normalized = parsed.href;
    if (normalized.endsWith('/')) {
        normalized = normalized.slice(0, -1);
    }
    return normalized;
}

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("URL Shortner is listening is running");
});

app.post("/api/shorten", (req, res) => {
  const { url } = req.body;

  if (!url || !isValidUrl(url)) {
    return res
      .status(400)
      .json({ error: "A valid http or https URL is required" });
  }

  const normalizedUrl = normalizeUrl(url);

  const existing = db
    .prepare(`SELECT short_code FROM urls WHERE original_url = ?`)
    .get(normalizedUrl);

  if (existing) {
    return res.status(200).json({
      shortCode: existing.short_code,
      shortUrl: `http://localhost:${PORT}/${existing.short_code}`,
      originalUrl: normalizedUrl,
    });
  }

  const shortCode = nanoid(7);

  db.prepare("INSERT INTO urls (short_code, original_url) VALUES (?, ?)")
  .run(
    shortCode,
    normalizedUrl,
  );

  res.status(201).json({
    shortCode,
    shortUrl: `http://localhost:${PORT}/${shortCode}`,
    originalUrl: normalizedUrl,
  });
});


app.get("/:code", (req, res) => {
  const row = db
    .prepare("SELECT original_url FROM urls WHERE short_code = ?")
    .get(req.params.code);

  if (!row) {
    return res.status(404).json({ error: "short URL not found" });
  }

  res.redirect(row.original_url);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
