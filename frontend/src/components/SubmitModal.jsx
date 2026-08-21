import { useState } from "react";
import { SECTORS, STAGES, TYPES } from "../constants/sectorColors";
import { submitStartup } from "../api/startups";
import LocationAutocomplete from "./LocationAutocomplete";

const EMPTY_FORM = {
  name: "", website: "", area: "", location: null, sector: SECTORS[0], stage: STAGES[0],
  type: TYPES[0], blurb: "", founded: "", founders: "", website_confirm: "",
};

export default function SubmitModal({ open, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleClose() {
    onClose();
    setTimeout(() => { setForm(EMPTY_FORM); setError(null); setSuccess(false); }, 200);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { location, ...rest } = form;
      const payload = location ? { ...rest, lat: location.lat, lng: location.lng } : rest;
      await submitStartup(payload);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="modal">
        <button type="button" className="modal-close" aria-label="Close" onClick={handleClose}>&times;</button>
        <div className="modal-eyebrow">New listing</div>
        <div className="modal-name">Submit a startup</div>

        {success ? (
          <div className="form-success">Thanks — we'll review it shortly and add it to the map once approved.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="form-error">{error}</div>}

            <div className="form-row">
              <label>Name</label>
              <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} required />
            </div>
            <div className="form-row">
              <label>Website</label>
              <input type="url" placeholder="https://" value={form.website} onChange={(e) => update("website", e.target.value)} />
            </div>
            <div className="form-row">
              <label>Area (Pune neighbourhood)</label>
              <LocationAutocomplete
                value={form.area}
                onChange={(v) => update("area", v)}
                onSelectLocation={(loc) => update("location", loc)}
              />
              <div className={`location-hint ${form.location ? "picked" : ""}`}>
                {form.location
                  ? `Pinned at ${form.location.lat.toFixed(4)}, ${form.location.lng.toFixed(4)}`
                  : "Pick a suggestion from the list for an exact pin — otherwise we'll estimate it."}
              </div>
            </div>

            <div className="form-grid">
              <div className="form-row">
                <label>Type</label>
                <select value={form.type} onChange={(e) => update("type", e.target.value)}>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label>Sector</label>
                <select value={form.sector} onChange={(e) => update("sector", e.target.value)}>
                  {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label>Stage</label>
                <select value={form.stage} onChange={(e) => update("stage", e.target.value)}>
                  {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label>Founded (optional)</label>
                <input type="text" placeholder="e.g. 2021" value={form.founded} onChange={(e) => update("founded", e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <label>Founders (optional)</label>
              <input type="text" value={form.founders} onChange={(e) => update("founders", e.target.value)} />
            </div>
            <div className="form-row">
              <label>About</label>
              <textarea value={form.blurb} onChange={(e) => update("blurb", e.target.value)} required />
            </div>

            <input
              type="text"
              name="website_confirm"
              className="honeypot"
              tabIndex={-1}
              autoComplete="off"
              value={form.website_confirm}
              onChange={(e) => update("website_confirm", e.target.value)}
            />

            <button type="submit" className="btn primary" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit for review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
