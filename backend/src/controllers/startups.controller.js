import { Startup } from "../models/Startup.js";
import { buildLogoUrl } from "../utils/logo.js";
import { geocodeArea } from "../utils/geocode.js";
import { validateSubmission } from "../utils/validateSubmission.js";

function withLogoUrl(doc) {
  const obj = doc.toObject();
  return { ...obj, logoUrl: buildLogoUrl(obj.website) };
}

export async function listApproved(req, res) {
  const docs = await Startup.find({ status: "approved" }).sort({ name: 1 });
  res.json(docs.map(withLogoUrl));
}

export async function listPending(req, res) {
  const docs = await Startup.find({ status: "pending" }).sort({ createdAt: -1 });
  res.json(docs.map(withLogoUrl));
}

export async function createSubmission(req, res) {
  const body = req.body || {};

  // Honeypot: bots fill this hidden field, real users never see/touch it.
  if (body.website_confirm) {
    return res.status(200).json({ ok: true });
  }

  const errors = validateSubmission(body);
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  const hasValidCoords = Number.isFinite(body.lat) && Number.isFinite(body.lng)
    && Math.abs(body.lat) <= 90 && Math.abs(body.lng) <= 180;
  const { lat, lng } = hasValidCoords
    ? { lat: body.lat, lng: body.lng }
    : await geocodeArea(body.area);

  const doc = await Startup.create({
    name: body.name.trim(),
    area: body.area.trim(),
    type: body.type,
    stage: body.stage,
    sector: body.sector,
    blurb: body.blurb.trim(),
    founded: body.founded?.trim() || undefined,
    founders: body.founders?.trim() || undefined,
    website: body.website?.trim() || undefined,
    lat,
    lng,
    status: "pending",
  });

  res.status(201).json(withLogoUrl(doc));
}

export async function approveSubmission(req, res) {
  const doc = await Startup.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json(withLogoUrl(doc));
}

export async function rejectSubmission(req, res) {
  const doc = await Startup.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
}
