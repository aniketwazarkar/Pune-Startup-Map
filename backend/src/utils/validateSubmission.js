import { SECTORS, STAGES, TYPES } from "./constants.js";

function isNonEmptyString(v, maxLen) {
  return typeof v === "string" && v.trim().length > 0 && v.trim().length <= maxLen;
}

function isValidUrl(v) {
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
}

export function validateSubmission(body) {
  const errors = [];

  if (!isNonEmptyString(body.name, 120)) errors.push("name is required (max 120 chars)");
  if (!isNonEmptyString(body.area, 80)) errors.push("area is required (max 80 chars)");
  if (!isNonEmptyString(body.blurb, 400)) errors.push("blurb is required (max 400 chars)");
  if (!TYPES.includes(body.type)) errors.push(`type must be one of: ${TYPES.join(", ")}`);
  if (!SECTORS.includes(body.sector)) errors.push(`sector must be one of: ${SECTORS.join(", ")}`);
  if (!STAGES.includes(body.stage)) errors.push(`stage must be one of: ${STAGES.join(", ")}`);
  if (body.website && !isValidUrl(body.website)) errors.push("website must be a valid URL");
  if (body.founded && !isNonEmptyString(body.founded, 20)) errors.push("founded must be a short string (max 20 chars)");
  if (body.founders && !isNonEmptyString(body.founders, 200)) errors.push("founders must be a string (max 200 chars)");

  return errors;
}
