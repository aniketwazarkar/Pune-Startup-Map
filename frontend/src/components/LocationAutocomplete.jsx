import { useEffect, useRef, useState } from "react";

const PUNE_BIAS = { lat: 18.5204, lon: 73.8567 };

function labelFor(feature) {
  const p = feature.properties;
  return [p.name, p.city, p.state].filter(Boolean).join(", ");
}

export default function LocationAutocomplete({ value, onChange, onSelectLocation }) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => setQuery(value || ""), [value]);

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleInput(v) {
    setQuery(v);
    onChange(v);
    onSelectLocation(null); // typing manually clears any previously picked exact coords

    clearTimeout(debounceRef.current);
    if (v.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(v)}&lat=${PUNE_BIAS.lat}&lon=${PUNE_BIAS.lon}&limit=6`;
        const res = await fetch(url);
        const data = await res.json();
        setSuggestions(data.features || []);
        setOpen(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  }

  function handlePick(feature) {
    const label = labelFor(feature);
    const [lng, lat] = feature.geometry.coordinates;
    setQuery(label);
    onChange(label);
    onSelectLocation({ lat, lng });
    setOpen(false);
    setSuggestions([]);
  }

  return (
    <div className="autocomplete" ref={wrapRef}>
      <input
        type="text"
        value={query}
        placeholder="Start typing a Pune neighbourhood…"
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => suggestions.length && setOpen(true)}
        autoComplete="off"
        required
      />
      {open && suggestions.length > 0 && (
        <ul className="autocomplete-list">
          {suggestions.map((f) => (
            <li key={f.properties.osm_id} onClick={() => handlePick(f)}>
              {labelFor(f)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
