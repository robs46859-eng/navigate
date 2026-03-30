import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
const configPath = path.join(process.cwd(), "firebase-applet-config.json");
if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  admin.initializeApp({
    projectId: config.projectId,
  });
}

const db = admin.firestore();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Data Ingestion Route
  app.post("/api/admin/ingest", async (req, res) => {
    const { query, category, location } = req.body;
    const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Google Maps API Key not configured" });
    }

    try {
      // 1. Search for places using Google Places API
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (searchData.status !== "OK") {
        return res.status(400).json({ error: searchData.status, message: searchData.error_message });
      }

      const results = searchData.results;
      const ingested = [];

      for (const result of results) {
        const placeData = {
          name: result.name,
          address: result.formatted_address,
          category: category || "rest_stop",
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          source: "Google Places API",
          placeId: result.place_id,
          aggregateStats: {
            avgCleanliness: 0,
            avgPrivacy: 0,
            strollerAccessRate: 0,
            reviewCount: 0
          }
        };

        // 2. Validate/Standardize with Geocoding (Optional since Places gives lat/lng, but good for address consistency)
        // For now, we trust Places API data as it's already standardized.

        // 3. Save to Firestore
        await db.collection("places").doc(result.place_id).set(placeData, { merge: true });
        ingested.push(placeData);
      }

      res.json({ 
        message: `Successfully ingested ${ingested.length} places`,
        count: ingested.length,
        places: ingested 
      });

    } catch (error) {
      console.error("Ingestion error:", error);
      res.status(500).json({ error: "Failed to ingest data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
