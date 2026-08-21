export default function Header({ onSubmitClick }) {
  return (
    <header>
      <div className="devnagari-watermark">पुणे</div>
      <svg className="contour" viewBox="0 0 1180 64" preserveAspectRatio="none">
        <path d="M0 50 Q 90 20 180 44 T 360 40 T 540 50 T 720 30 T 900 46 T 1180 34" fill="none" stroke="#1F6F63" strokeWidth="1.4"/>
        <path d="M0 60 Q 100 34 200 54 T 400 50 T 600 60 T 800 42 T 1000 56 T 1180 46" fill="none" stroke="#D9971F" strokeWidth="1.2"/>
      </svg>
      <div className="eyebrow">411 001 &mdash; 411 057 &amp; growing</div>
      <h1>Pune Startup <em>Map</em></h1>
      <p className="subtitle">A directory of startups founded or based in Pune — from the SaaS towers of Baner to the logistics yards of Magarpatta. Browse by peth, stage, and sector.</p>
      <div className="header-actions">
        <button type="button" className="btn primary" onClick={onSubmitClick}>+ Submit a startup</button>
        {/* <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11.5px", color: "var(--ink-soft)" }}>
          seed dataset · verify before relying on it
        </span> */}
      </div>
    </header>
  );
}
