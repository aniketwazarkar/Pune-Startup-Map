import StartupCard from "./StartupCard";

export default function GridView({ startups, visible, onSelect }) {
  if (!visible) return null;

  if (startups.length === 0) {
    return (
      <div id="gridview">
        <div className="empty">
          No startups match these filters yet.<br />
          Try widening your search, or add one via "Submit a startup".
        </div>
      </div>
    );
  }

  return (
    <div id="gridview">
      {startups.map((d) => (
        <StartupCard key={d._id} startup={d} onClick={() => onSelect(d._id)} />
      ))}
    </div>
  );
}
