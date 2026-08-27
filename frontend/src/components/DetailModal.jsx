import { useEffect } from "react";

export default function DetailModal({ startup, onClose }) {
  useEffect(() => {
    if (!startup) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [startup, onClose]);

  if (!startup) return null;
  const d = startup;

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>&times;</button>
        <div className="modal-eyebrow">{d.area} &middot; {d.type}</div>
        <div className="modal-name">{d.name}</div>
        <div className="modal-tags">
          <span className={`tag ${d.type === "VC" ? "vc" : "sector"}`}>{d.sector}</span>
          <span className="tag stage">{d.stage}</span>
        </div>
        <div className="modal-section">
          <div className="modal-label">About</div>
          <div className="modal-value">{d.blurb}</div>
        </div>
        {(d.founded || d.founders) && (
          <div className="modal-facts">
            {d.founded && (
              <div>
                <div className="modal-label">Founded</div>
                <div className="modal-value">{d.founded}</div>
              </div>
            )}
            {d.founders && (
              <div>
                <div className="modal-label">Founders</div>
                <div className="modal-value">{d.founders}</div>
              </div>
            )}
          </div>
        )}
        <div className="modal-links">
          {d.website && (
            <a className="btn tag-btn sector" href={d.website} target="_blank" rel="noopener noreferrer">Visit website &rarr;</a>
          )}
          {d.name && (
            <a
              className="btn tag-btn stage"
              href={`https://www.google.com/search?q=${encodeURIComponent(`${d.name} pune careers jobs`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View open jobs &rarr;
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
