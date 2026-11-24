// Careers operations. The page's buttons and forms call these, and later the agent will too.
import { COMPANY, OFFERS } from "./offers-data.js";

const applications = [];   // demo only: kept in page memory
let version = 0;

const clone = (x) => JSON.parse(JSON.stringify(x));
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getCompany() { return clone(COMPANY); }

export function getOffer(id) {
  const offer = OFFERS.find((o) => o.id === id);
  return offer ? { ok: true, offer: clone(offer) } : { ok: false, reason: `No offer with id ${id}.` };
}

// filters: { paidOnly, workMode ("hybrid" | "remote" | "on-site" | "flexible" = hybrid or remote), preHire, startBy: "YYYY-MM-DD", skill }
export function listOffers(filters = {}) {
  let list = OFFERS;
  if (filters.paidOnly) list = list.filter((o) => o.stipendMAD > 0);
  if (filters.workMode === "flexible") list = list.filter((o) => o.workMode === "hybrid" || o.workMode === "remote");
  else if (filters.workMode) list = list.filter((o) => o.workMode === filters.workMode);
  if (filters.preHire === "yes") list = list.filter((o) => o.preHire === "yes");
  if (filters.preHire === "yes-or-possible") list = list.filter((o) => o.preHire !== "no");
  if (filters.startBy) list = list.filter((o) => o.startDate <= filters.startBy);
  if (filters.skill) {
    const s = String(filters.skill).toLowerCase();
    list = list.filter((o) => [...o.skills, ...o.niceToHave].some((k) => k.toLowerCase().includes(s)));
  }
  return { ok: true, count: list.length, offers: clone(list) };
}

// Read-only check, used before submitting.
export function checkApplication(a = {}) {
  const offer = OFFERS.find((o) => o.id === a.offerId);
  if (!offer) return { ok: false, reason: "Choose one of the open offers." };
  if (!a.fullName || a.fullName.trim().length < 3) return { ok: false, reason: "Please give your full name." };
  if (!EMAIL_RE.test(a.email || "")) return { ok: false, reason: "Please give a valid email address." };
  if (!a.school || a.school.trim().length < 2) return { ok: false, reason: "Please give your school." };
  if (applications.some((x) => x.offerId === a.offerId && x.email.toLowerCase() === a.email.toLowerCase()))
    return { ok: false, reason: "You have already applied to this offer with this email." };
  return { ok: true, offerTitle: offer.title };
}

export function submitApplication(a = {}) {
  const check = checkApplication(a);
  if (!check.ok) return check;
  const ref = "APP-" + Math.random().toString(36).slice(2, 6).toUpperCase();
  const record = {
    reference: ref, offerId: a.offerId, offerTitle: check.offerTitle,
    fullName: a.fullName.trim(), email: a.email.trim(), school: a.school.trim(),
    message: (a.message || "").trim().slice(0, 1000),
    status: "received", receivedAt: new Date().toISOString()
  };
  applications.push(record);
  version++;
  return { ok: true, application: clone(record) };
}

// What the assistant reads on this page: the company, every offer and this visitor's latest application.
export function getState() {
  const latest = applications[applications.length - 1];
  return {
    company: getCompany(),
    offers: clone(OFFERS),
    latestApplication: latest ? { reference: latest.reference, offerId: latest.offerId, offerTitle: latest.offerTitle, status: latest.status } : null,
    version
  };
}

export function offerIds() { return OFFERS.map((o) => o.id); }
