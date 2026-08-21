import L from "leaflet";
import { SECTOR_COLORS } from "../constants/sectorColors";

export function pinIcon(d) {
  const isVC = d.type === "VC";
  const color = isVC ? "#A8432E" : (SECTOR_COLORS[d.sector] || "#8A8F79");
  const size = isVC ? 34 : 30;
  const initial = d.name.trim().charAt(0).toUpperCase();
  const imgHtml = d.logoUrl
    ? `<img src="${d.logoUrl}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">`
    : "";
  return L.divIcon({
    className: "",
    html: `<div class="logo-pin" style="width:${size}px;height:${size}px;border-color:${color};">
             ${imgHtml}
             <div class="logo-pin-fallback" style="display:${d.logoUrl ? "none" : "flex"};background:${color};font-size:${size * 0.42}px;">${initial}</div>
           </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function popupHtml(d) {
  return `<div class="popup-name">${d.name}</div>
    <div class="popup-tags">
      <span class="tag sector">${d.sector}</span>
      <span class="tag stage">${d.stage}</span>
    </div>
    <div class="popup-blurb">${d.blurb}<br><span style="font-family:'IBM Plex Mono',monospace;font-size:11px;">${d.area}</span></div>
    <span class="popup-more">More details &rarr;</span>`;
}
