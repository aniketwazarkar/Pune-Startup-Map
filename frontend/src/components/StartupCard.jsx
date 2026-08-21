import { SECTOR_COLORS } from "../constants/sectorColors";

export default function StartupCard({ startup, onClick }) {
  const d = startup;
  return (
    <div className="card" onClick={onClick}>
      <div className="card-top">
        <div>
          <div className="card-name">{d.name}</div>
          <div className="card-area">{d.area}</div>
        </div>
        <div className="type-dot" style={{ background: d.type === "VC" ? "#A8432E" : (SECTOR_COLORS[d.sector] || "#8A8F79") }} />
      </div>
      <div className="card-blurb">{d.blurb}</div>
      <div className="tag-row">
        <span className={`tag ${d.type === "VC" ? "vc" : "sector"}`}>{d.sector}</span>
        <span className="tag stage">{d.stage}</span>
      </div>
    </div>
  );
}
