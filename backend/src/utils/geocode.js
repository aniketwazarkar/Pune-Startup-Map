import { PUNE_CENTER } from "./constants.js";

export async function geocodeArea(area) {
  const query = encodeURIComponent(`${area}, Pune, India`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "PuneStartupTracker/1.0 (contact: submissions form)" },
    });
    if (!res.ok) return PUNE_CENTER;
    const results = await res.json();
    if (!results.length) return PUNE_CENTER;
    return { lat: Number(results[0].lat), lng: Number(results[0].lon) };
  } catch {
    return PUNE_CENTER;
  }
}
