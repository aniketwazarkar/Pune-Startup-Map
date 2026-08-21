function Select({ label, value, options, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">All {label}</option>
      {options.map((v) => <option key={v} value={v}>{v}</option>)}
    </select>
  );
}

export default function Controls({ view, onViewChange, filters, onFilterChange, filterOptions, resultCount }) {
  return (
    <div className="controls">
      <div className="view-toggle">
        <button type="button" className={view === "map" ? "active" : ""} onClick={() => onViewChange("map")}>map</button>
        <button type="button" className={view === "grid" ? "active" : ""} onClick={() => onViewChange("grid")}>grid</button>
      </div>
      <Select label="types" value={filters.type} options={filterOptions.type} onChange={(v) => onFilterChange("type", v)} />
      <Select label="areas" value={filters.area} options={filterOptions.area} onChange={(v) => onFilterChange("area", v)} />
      <Select label="stages" value={filters.stage} options={filterOptions.stage} onChange={(v) => onFilterChange("stage", v)} />
      <Select label="sectors" value={filters.sector} options={filterOptions.sector} onChange={(v) => onFilterChange("sector", v)} />
      <div className="result-count"><b>{resultCount}</b>&nbsp;results</div>
    </div>
  );
}
