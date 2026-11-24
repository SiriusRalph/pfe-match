// The student's own data on PFE Match: profile, needs, the companies with a PFE agent, and a shortlist.
// Everything stays in this browser. The page and the student's assistant both use these operations.

const STORE_KEY = "pfe-match-v1";

const DEFAULT_PROFILE = {
  firstName: "Sara",
  school: "HESTIM, Casablanca",
  field: "Cycle Ingénieur d'État, AI & Big Data (final year)",
  availableFrom: "2027-02-01",
  durationMonths: 6,
  skills: ["Python", "SQL", "Machine learning", "NLP", "Docker"],
  needs: {
    paid: true,
    minStipendMAD: 2500,
    workModes: ["hybrid", "remote"],
    startBy: "2027-02-28",
    preHire: "would-like"
  }
};

// Companies that publish a PFE agent. In the real open agentic web this list would come
// from a public index; here it is the two demo companies.
export const DIRECTORY = [
  {
    id: "atlas",
    name: "Atlas Data",
    tagline: "Data & AI consultancy",
    city: "Casablanca",
    page: "https://atlas-data-pfe.netlify.app/",
    agentTool: "atlas_data_pfe",
    deadline: "2026-12-20",
    color: "#0E9F6E"
  },
  {
    id: "nour",
    name: "Nour Analytics",
    tagline: "Machine learning for finance & retail",
    city: "Rabat",
    page: "https://nour-analytics-pfe.netlify.app/",
    agentTool: "nour_analytics_pfe",
    deadline: "2027-01-10",
    color: "#2B3A8C"
  }
];

const WORK_MODES = ["on-site", "hybrid", "remote"];
const PRE_HIRE = ["must", "would-like", "dont-mind"];
const clone = (x) => JSON.parse(JSON.stringify(x));

let state = load();
let version = 0;
const listeners = new Set();

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    if (saved && saved.profile && Array.isArray(saved.shortlist)) return saved;
  } catch { /* storage can be unavailable; start fresh */ }
  return { profile: clone(DEFAULT_PROFILE), shortlist: [] };
}

function commit() {
  version++;
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* keep working in memory */ }
  listeners.forEach((fn) => fn(getState()));
}

export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function getState() {
  return {
    profile: clone(state.profile),
    shortlist: clone(state.shortlist),
    companies: clone(DIRECTORY),
    version
  };
}

// partial: { paid, minStipendMAD, workModes, startBy, preHire }
export function updateNeeds(partial = {}) {
  const n = { ...state.profile.needs };
  if ("paid" in partial) n.paid = Boolean(partial.paid);
  if ("minStipendMAD" in partial) {
    const v = Number(partial.minStipendMAD);
    if (!Number.isFinite(v) || v < 0 || v > 20000) return { ok: false, reason: "The minimum stipend must be between 0 and 20 000 MAD." };
    n.minStipendMAD = Math.round(v);
  }
  if ("workModes" in partial) {
    const modes = [...new Set(partial.workModes || [])];
    if (!modes.length || modes.some((m) => !WORK_MODES.includes(m))) return { ok: false, reason: "Choose at least one of on-site, hybrid or remote." };
    n.workModes = modes;
  }
  if ("startBy" in partial) {
    if (partial.startBy && !/^\d{4}-\d{2}-\d{2}$/.test(partial.startBy)) return { ok: false, reason: "Give the latest start date as YYYY-MM-DD." };
    n.startBy = partial.startBy || "";
  }
  if ("preHire" in partial) {
    if (!PRE_HIRE.includes(partial.preHire)) return { ok: false, reason: "Pre-hire must be must, would-like or dont-mind." };
    n.preHire = partial.preHire;
  }
  state.profile.needs = n;
  commit();
  return { ok: true, needs: clone(n) };
}

export function updateProfile(partial = {}) {
  const p = state.profile;
  if ("availableFrom" in partial && /^\d{4}-\d{2}-\d{2}$/.test(partial.availableFrom)) p.availableFrom = partial.availableFrom;
  if ("durationMonths" in partial) { const d = Number(partial.durationMonths); if (d >= 1 && d <= 12) p.durationMonths = Math.round(d); }
  if ("skills" in partial && Array.isArray(partial.skills)) p.skills = partial.skills.map(String).map((s) => s.trim()).filter(Boolean).slice(0, 15);
  commit();
  return { ok: true, profile: clone(p) };
}

// item: { companyId, offerId, title, stipendMAD, workMode, officeDays, startDate, durationMonths, preHire, note }
export function saveToShortlist(item = {}) {
  const company = DIRECTORY.find((c) => c.id === item.companyId);
  if (!company) return { ok: false, reason: "Unknown company. Use a company id from the directory." };
  if (!item.title || String(item.title).trim().length < 3) return { ok: false, reason: "Give the offer's title." };
  const offerId = String(item.offerId || "").trim() || String(item.title).trim();
  if (state.shortlist.some((s) => s.companyId === company.id && s.offerId === offerId)) {
    return { ok: false, reason: "This offer is already in the shortlist." };
  }
  if (state.shortlist.length >= 12) return { ok: false, reason: "The shortlist is full (12 offers). Remove one first." };
  const entry = {
    companyId: company.id,
    company: company.name,
    offerId,
    title: String(item.title).trim().slice(0, 120),
    stipendMAD: Number.isFinite(Number(item.stipendMAD)) ? Number(item.stipendMAD) : null,
    workMode: WORK_MODES.includes(item.workMode) ? item.workMode : null,
    officeDays: Number.isFinite(Number(item.officeDays)) ? Number(item.officeDays) : null,
    startDate: /^\d{4}-\d{2}-\d{2}$/.test(item.startDate || "") ? item.startDate : null,
    durationMonths: Number.isFinite(Number(item.durationMonths)) ? Number(item.durationMonths) : null,
    preHire: ["yes", "possible", "no"].includes(item.preHire) ? item.preHire : null,
    note: String(item.note || "").trim().slice(0, 200),
    link: company.page,
    status: "saved",
    savedAt: new Date().toISOString()
  };
  state.shortlist.push(entry);
  commit();
  return { ok: true, saved: clone(entry), shortlistSize: state.shortlist.length };
}

// Move a saved offer between the board's columns: "saved" or "applied". Page-only.
export function setStatus({ companyId, offerId, status } = {}) {
  const entry = state.shortlist.find((s) => s.companyId === companyId && s.offerId === offerId);
  if (!entry) return { ok: false, reason: "That offer is not in the shortlist." };
  if (!["saved", "applied"].includes(status)) return { ok: false, reason: "Status must be saved or applied." };
  entry.status = status;
  commit();
  return { ok: true };
}

export function removeFromShortlist({ companyId, offerId } = {}) {
  const before = state.shortlist.length;
  state.shortlist = state.shortlist.filter((s) => !(s.companyId === companyId && s.offerId === offerId));
  if (state.shortlist.length === before) return { ok: false, reason: "That offer is not in the shortlist." };
  commit();
  return { ok: true, shortlistSize: state.shortlist.length };
}

// How well a saved offer fits the needs: a list of { label, ok } checks.
export function fitChecks(entry, needs = state.profile.needs) {
  const checks = [];
  if (needs.paid) checks.push({ label: "Paid", ok: entry.stipendMAD == null ? null : entry.stipendMAD >= Math.max(1, needs.minStipendMAD || 0) });
  checks.push({ label: "Format", ok: entry.workMode == null ? null : needs.workModes.includes(entry.workMode) });
  if (needs.startBy) checks.push({ label: "Start date", ok: entry.startDate == null ? null : entry.startDate <= needs.startBy });
  if (needs.preHire !== "dont-mind") checks.push({ label: "Pre-hire", ok: entry.preHire == null ? null : needs.preHire === "must" ? entry.preHire === "yes" : entry.preHire !== "no" });
  return checks;
}

export function resetDemo() {
  state = { profile: clone(DEFAULT_PROFILE), shortlist: [] };
  commit();
  return { ok: true };
}
