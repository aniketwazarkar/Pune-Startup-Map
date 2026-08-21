import { useMemo } from "react";

function unique(arr) {
  return [...new Set(arr)].sort();
}

export function useFilteredStartups(startups, filters) {
  const filterOptions = useMemo(() => ({
    type: unique(startups.map((d) => d.type)),
    area: unique(startups.map((d) => d.area)),
    stage: unique(startups.map((d) => d.stage)),
    sector: unique(startups.map((d) => d.sector)),
  }), [startups]);

  const filteredStartups = useMemo(() => startups.filter((d) =>
    (!filters.type || d.type === filters.type) &&
    (!filters.area || d.area === filters.area) &&
    (!filters.stage || d.stage === filters.stage) &&
    (!filters.sector || d.sector === filters.sector)
  ), [startups, filters]);

  return { filteredStartups, filterOptions };
}
