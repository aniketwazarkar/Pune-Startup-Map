import { config } from "../config/env.js";

export function domainOf(website) {
  if (!website) return null;
  try {
    return new URL(website).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function buildLogoUrl(website) {
  const domain = domainOf(website);
  if (!domain) return null;
  return `https://img.logo.dev/${domain}?token=${config.logoDevToken}&size=64&format=png`;
}
