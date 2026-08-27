import { useEffect, useState } from "react";
import { fetchPending, fetchApproved, fetchRejected, approveStartup, rejectStartup, adminLogin } from "./api/startups";

const STORAGE_KEY = "pst_admin_token";

export default function AdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem(STORAGE_KEY) || "");
  const [loginMode, setLoginMode] = useState("credentials"); // "credentials" | "token"
  const [tokenInput, setTokenInput] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [tab, setTab] = useState("pending"); // "pending" | "approved" | "rejected"
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function load(t) {
    setLoading(true);
    setError(null);
    Promise.all([fetchPending(t), fetchApproved(t), fetchRejected(t)])
      .then(([p, a, r]) => {
        setPending(p);
        setApproved(a);
        setRejected(r);
      })
      .catch((err) => {
        setError(err.message);
        if (err.message.includes("401") || err.message.toLowerCase().includes("unauthorized")) {
          sessionStorage.removeItem(STORAGE_KEY);
          setToken("");
        }
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (token) load(token);
  }, [token]);

  function handleTokenSubmit(e) {
    e.preventDefault();
    sessionStorage.setItem(STORAGE_KEY, tokenInput);
    setToken(tokenInput);
  }

  async function handleCredentialsSubmit(e) {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      const { token: resolvedToken } = await adminLogin(username, password);
      sessionStorage.setItem(STORAGE_KEY, resolvedToken);
      setToken(resolvedToken);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleApprove(id) {
    await approveStartup(id, token);
    load(token);
  }

  async function handleReject(id) {
    if (!confirm("Reject this submission?")) return;
    await rejectStartup(id, token);
    load(token);
  }

  function handleLogout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setToken("");
    setTokenInput("");
    setUsername("");
    setPassword("");
    setPending([]);
    setApproved([]);
    setRejected([]);
  }

  if (!token) {
    return (
      <div className="admin-wrap admin-login">
        <div className="admin-login-card">
          <div className="admin-login-eyebrow">Pune Startup Map</div>
          <div className="admin-login-title">Admin sign in</div>

          <div className="admin-login-tabs">
            <button type="button" className={loginMode === "credentials" ? "active" : ""} onClick={() => setLoginMode("credentials")}>ID &amp; password</button>
            <button type="button" className={loginMode === "token" ? "active" : ""} onClick={() => setLoginMode("token")}>Token</button>
          </div>

          {loginMode === "credentials" ? (
            <form onSubmit={handleCredentialsSubmit}>
              {loginError && <div className="form-error">{loginError}</div>}
              <div className="form-row">
                <label>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
              </div>
              <div className="form-row">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
              </div>
              <button type="submit" className="btn primary" disabled={loggingIn}>
                {loggingIn ? "Signing in…" : "Sign in"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleTokenSubmit}>
              <div className="form-row">
                <label>Admin token</label>
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Paste your secret token"
                />
              </div>
              <button type="submit" className="btn primary">Enter</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "pending", label: "Pending", rows: pending },
    { key: "approved", label: "Approved", rows: approved },
    { key: "rejected", label: "Rejected", rows: rejected },
  ];
  const activeRows = tabs.find((t) => t.key === tab).rows;
  const emptyText = {
    pending: "Nothing pending review.",
    approved: "No approved submissions yet.",
    rejected: "No rejected submissions yet.",
  }[tab];

  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <h1>Submissions</h1>
        <button type="button" className="btn" onClick={handleLogout}>Log out</button>
      </div>

      <div className="admin-login-tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            className={tab === t.key ? "active" : ""}
            onClick={() => setTab(t.key)}
          >
            {t.label} ({t.rows.length})
          </button>
        ))}
      </div>

      {loading && <p>Loading…</p>}
      {error && <p className="form-error">{error}</p>}
      {!loading && activeRows.length === 0 && <p>{emptyText}</p>}
      {activeRows.map((d) => (
        <div className="admin-row" key={d._id}>
          <div>
            <strong>{d.name}</strong> — {d.area} · {d.sector} · {d.stage}
            <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4 }}>{d.blurb}</div>
            {d.website && <div style={{ fontSize: 12, marginTop: 4 }}><a href={d.website} target="_blank" rel="noopener noreferrer">{d.website}</a></div>}
          </div>
          <div className="admin-actions">
            {tab !== "approved" && (
              <button type="button" className="btn approve" onClick={() => handleApprove(d._id)}>Approve</button>
            )}
            {tab !== "rejected" && (
              <button type="button" className="btn reject" onClick={() => handleReject(d._id)}>Reject</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
