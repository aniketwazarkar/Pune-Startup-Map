const API_URL = import.meta.env.VITE_API_URL;

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body.errors?.join(", ") || body.error || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return res.json();
}

export function fetchStartups() {
  return fetch(`${API_URL}/startups`).then(handle);
}

export function submitStartup(payload) {
  return fetch(`${API_URL}/startups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(handle);
}

export function fetchPending(adminToken) {
  return fetch(`${API_URL}/startups/pending`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  }).then(handle);
}

export function fetchApproved(adminToken) {
  return fetch(`${API_URL}/startups`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  }).then(handle);
}

export function fetchRejected(adminToken) {
  return fetch(`${API_URL}/startups/rejected`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  }).then(handle);
}

export function approveStartup(id, adminToken) {
  return fetch(`${API_URL}/startups/${id}/approve`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${adminToken}` },
  }).then(handle);
}

export function rejectStartup(id, adminToken) {
  return fetch(`${API_URL}/startups/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${adminToken}` },
  }).then(handle);
}

export function adminLogin(username, password) {
  return fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  }).then(handle);
}
