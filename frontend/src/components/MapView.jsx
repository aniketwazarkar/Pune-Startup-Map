import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { pinIcon, popupHtml } from "../utils/mapIcons";

export default function MapView({ startups, visible, onSelect }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersLayerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map(containerRef.current, { scrollWheelZoom: false, zoomControl: false })
      .setView([18.5450, 73.8500], 12);

    let pinchAccum = 0;
    const PINCH_STEP = 40;
    map.getContainer().addEventListener("wheel", (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        pinchAccum += e.deltaY;
        while (pinchAccum <= -PINCH_STEP) { map.zoomIn(); pinchAccum += PINCH_STEP; }
        while (pinchAccum >= PINCH_STEP) { map.zoomOut(); pinchAccum -= PINCH_STEP; }
      }
    }, { passive: false });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
      maxZoom: 19,
    }).addTo(map);

    const markersLayer = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        const size = count >= 20 ? 46 : count >= 10 ? 40 : 34;
        return L.divIcon({
          className: "",
          html: `<div class="cluster-badge" style="width:${size}px;height:${size}px;font-size:${size * 0.36}px;">${count}</div>`,
          iconSize: [size, size],
        });
      },
    }).addTo(map);

    const FullscreenControl = L.Control.extend({
      options: { position: "topright" },
      onAdd: function () {
        const container = L.DomUtil.create("div", "leaflet-bar leaflet-control fullscreen-control");
        const link = L.DomUtil.create("a", "", container);
        link.href = "#";
        link.title = "Toggle fullscreen";
        link.innerHTML = "&#10529;";
        L.DomEvent.on(link, "click", L.DomEvent.stop).on(link, "click", () => {
          const el = containerRef.current;
          const isFull = document.fullscreenElement || document.webkitFullscreenElement;
          if (!isFull) {
            (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
          } else {
            (document.exitFullscreen || document.webkitExitFullscreen).call(document);
          }
        });
        return container;
      },
    });
    map.addControl(new FullscreenControl());

    ["fullscreenchange", "webkitfullscreenchange"].forEach((evt) => {
      document.addEventListener(evt, () => setTimeout(() => map.invalidateSize(), 120));
    });

    mapRef.current = map;
    markersLayerRef.current = markersLayer;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const layer = markersLayerRef.current;
    if (!layer) return;
    layer.clearLayers();
    startups.forEach((d) => {
      const marker = L.marker([d.lat, d.lng], { icon: pinIcon(d) });
      marker.bindPopup(popupHtml(d));
      marker.on("popupopen", (e) => {
        const el = e.popup.getElement()?.querySelector(".popup-more");
        el?.addEventListener("click", () => onSelect(d._id));
      });
      marker.addTo(layer);
    });
  }, [startups, onSelect]);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.style.display = visible ? "block" : "none";
    if (visible) setTimeout(() => mapRef.current?.invalidateSize(), 50);
  }, [visible]);

  return <div id="mapview" ref={containerRef} />;
}
