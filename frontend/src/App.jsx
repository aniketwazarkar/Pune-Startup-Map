import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Controls from "./components/Controls";
import MapView from "./components/MapView";
import GridView from "./components/GridView";
import DetailModal from "./components/DetailModal";
import SubmitModal from "./components/SubmitModal";
import Footer from "./components/Footer";
import { fetchStartups } from "./api/startups";
import { useFilteredStartups } from "./hooks/useFilteredStartups";

export default function App() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [view, setView] = useState("map");
  const [filters, setFilters] = useState({ type: "", area: "", stage: "", sector: "" });
  const [selectedId, setSelectedId] = useState(null);
  const [submitOpen, setSubmitOpen] = useState(false);

  useEffect(() => {
    fetchStartups()
      .then(setStartups)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const { filteredStartups, filterOptions } = useFilteredStartups(startups, filters);

  const handleFilterChange = useCallback((field, value) => {
    setFilters((f) => ({ ...f, [field]: value }));
  }, []);

  const selectedStartup = useMemo(
    () => startups.find((d) => d._id === selectedId) || null,
    [startups, selectedId]
  );

  return (
    <div className="wrap">
      <Header onSubmitClick={() => setSubmitOpen(true)} />

      <Controls
        view={view}
        onViewChange={setView}
        filters={filters}
        onFilterChange={handleFilterChange}
        filterOptions={filterOptions}
        resultCount={filteredStartups.length}
      />

      {loading && <p style={{ marginTop: 20 }}>Loading startups…</p>}
      {error && <p style={{ marginTop: 20, color: "var(--brick)" }}>Couldn't load data: {error}</p>}

      <MapView startups={filteredStartups} visible={view === "map"} onSelect={setSelectedId} />
      <GridView startups={filteredStartups} visible={view === "grid"} onSelect={setSelectedId} />

      <Footer />

      <DetailModal startup={selectedStartup} onClose={() => setSelectedId(null)} />
      <SubmitModal open={submitOpen} onClose={() => setSubmitOpen(false)} />
    </div>
  );
}
