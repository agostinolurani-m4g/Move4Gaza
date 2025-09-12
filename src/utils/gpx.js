// Utility functions to load and analyse GPX files client side. The
// `loadGPX` function parses a GPX XML file and returns an object
// describing the polyline and statistics such as total distance and
// elevation gain.

// Haversine formula: compute distance between two points on the globe.
export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// Load a GPX file from a URL. Returns an object with an array of points,
// the total distance in kilometres and the cumulative positive elevation gain.
export async function loadGPX(url) {
  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();
  const xml = new window.DOMParser().parseFromString(text, "application/xml");
  const pts = Array.from(xml.getElementsByTagName("trkpt")).map(n => ({
    lat: parseFloat(n.getAttribute("lat")),
    lon: parseFloat(n.getAttribute("lon")),
    ele: parseFloat(n.getElementsByTagName("ele")[0]?.textContent || "0"),
  }));
  // compute distance and elevation gain
  let dist = 0, gain = 0;
  for (let i = 1; i < pts.length; i++) {
    dist += haversineKm(pts[i - 1].lat, pts[i - 1].lon, pts[i].lat, pts[i].lon);
    const dEle = (pts[i].ele - pts[i - 1].ele);
    if (!isNaN(dEle) && dEle > 0) gain += dEle;
  }
  return { points: pts, distanceKm: dist, gainM: Math.round(gain) };
}