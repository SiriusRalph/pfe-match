// Renders the careers page and connects its controls to the operations in careers.js.
import * as Careers from "./careers.js";

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const fmtDate = (iso, month = "long") => new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month, year: "numeric" });
const fmtDay = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long" });
const fmtMAD = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " MAD";

// A mark says whether a condition is good news for a student: yes, partly, or no.
const mark = (level, text) => `<span class="mark m-${level}" aria-hidden="true"></span><span class="sr">${text}. </span>`;

function payCell(o) {
  return o.stipendMAD > 0
    ? `${mark("yes", "Paid")}<strong>${fmtMAD(o.stipendMAD)}</strong><small>a month</small>`
    : `${mark("no", "Unpaid")}<strong>Unpaid</strong><small>${esc(o.perks[0] || "")}</small>`;
}
function formatCell(o) {
  if (o.workMode === "hybrid") return `${mark("yes", "Hybrid")}<strong>Hybrid</strong><small>${o.officeDays} days a week at the office</small>`;
  if (o.workMode === "remote") return `${mark("yes", "Remote")}<strong>Remote</strong>`;
  return `${mark("no", "On-site")}<strong>On-site</strong><small>5 days a week at the office</small>`;
}
function hireCell(o) {
  const level = { yes: "yes", possible: "part", no: "no" }[o.preHire];
  const word = { yes: "Planned", possible: "Possible", no: "Not planned" }[o.preHire];
  return `${mark(level, "Hiring " + word.toLowerCase())}<strong>${word}</strong><small>${esc(o.preHireNote)}</small>`;
}

const NEEDS = ["#f-paid", "#f-hybrid", "#f-feb", "#f-prehire"];

function readNeeds() {
  return {
    paidOnly: $("#f-paid").checked,
    workMode: $("#f-hybrid").checked ? "hybrid" : undefined,
    startBy: $("#f-feb").checked ? "2027-02-28" : undefined,
    preHire: $("#f-prehire").checked ? "yes-or-possible" : undefined
  };
}

// Small line icons for the comparison cards.
const ICON = {
  where: '<svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-5h6v5"/></svg>',
  start: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  hire: '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="3"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/></svg>',
  seats: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c2.4 0 4 1.5 4.6 4.5"/></svg>'
};

function compareCard(o, state) {
  const where = o.workMode === "hybrid"
    ? { level: "yes", value: "Hybrid", note: `${o.officeDays} days a week at the office` }
    : { level: "no", value: "On-site", note: "5 days a week at the office" };
  const hire = {
    yes: { level: "yes", value: "Planned" },
    possible: { level: "part", value: "Possible" },
    no: { level: "no", value: "Not planned" }
  }[o.preHire];
  const row = (icon, label, value, note, level) => `
      <li>
        <span class="cmp-ic" aria-hidden="true">${icon}</span>
        <div><small>${label}</small><strong>${value}</strong>${note ? `<em>${esc(note)}</em>` : ""}</div>
        ${level ? mark(level, value) : ""}
      </li>`;
  const [main, sub] = o.title.split(" — ");
  return `
  <article class="cmp ${state}">
    <span class="fit-badge" aria-hidden="true">✓ Fits you</span>
    <div class="cmp-head ${TEAM_CLASS[o.team] || ""}">
      <span class="team">${esc(o.team)}</span>
      <h3>${esc(main)}</h3>
      <p>${esc(sub || "")}</p>
    </div>
    <div class="cmp-price">
      ${o.stipendMAD > 0
        ? `<strong>${fmtMAD(o.stipendMAD).replace(" MAD", "")}</strong><span>MAD<br>per month</span>${mark("yes", "Paid")}`
        : `<strong class="unpaid">Unpaid</strong><span>${esc(o.perks[0] || "")}</span>${mark("no", "Unpaid")}`}
    </div>
    <ul class="cmp-rows">
      ${row(ICON.where, "Where you work", where.value, where.note, where.level)}
      ${row(ICON.start, "Starts", fmtDay(o.startDate), `${o.durationMonths} months`, "")}
      ${row(ICON.hire, "Hiring after the PFE", hire.value, o.preHireNote, hire.level)}
      ${row(ICON.seats, "Places", String(o.openings), o.openings > 1 ? "students" : "student", "")}
    </ul>
    <a class="cmp-link" href="#${o.id}">See the full offer</a>
  </article>`;
}

function renderMatrix() {
  const all = Careers.listOffers().offers;
  const anyNeed = NEEDS.some((s) => $(s).checked);
  const fitting = new Set(Careers.listOffers(readNeeds()).offers.map((o) => o.id));
  const state = (o) => (anyNeed ? (fitting.has(o.id) ? "fit" : "unfit") : "");
  $("#offer-matrix").innerHTML = all.map((o) => compareCard(o, state(o))).join("");

  document.querySelectorAll("#offer-list .offer").forEach((card) => {
    card.classList.toggle("fit", anyNeed && fitting.has(card.id));
    card.classList.toggle("unfit", anyNeed && !fitting.has(card.id));
  });
  const n = fitting.size;
  $("#offer-count").innerHTML = !anyNeed
    ? "Pick what you need below"
    : n === 0 ? "No subject fits all of these. Try removing one."
    : `<b>${n === all.length ? "All" : n}</b> of ${all.length} subjects fit.`;
}

const TEAM_CLASS = { "Data Platform": "t-de", "AI Lab": "t-ai", "Analytics": "t-bi" };
const fmtShort = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function offerCard(o) {
  const pay = o.stipendMAD > 0 ? `<span class="badge">${fmtMAD(o.stipendMAD)} / month</span>` : `<span class="badge off">Unpaid</span>`;
  const mode = `<span class="badge ${o.workMode === "hybrid" ? "" : "warn"}">${o.workMode === "hybrid" ? `Hybrid · ${o.officeDays} days office` : "On-site"}</span>`;
  const hire = `<span class="badge ${{ yes: "", possible: "warn", no: "off" }[o.preHire]}">${{ yes: "Pre-hire", possible: "Pre-hire possible", no: "No pre-hire" }[o.preHire]}</span>`;
  return `
  <article class="offer" id="${o.id}">
    <div class="banner ${TEAM_CLASS[o.team] || ""}"><span class="team">${esc(o.team)}</span><span class="code">${esc(o.id)}</span></div>
    <div class="offer-body">
      <h3>${esc(o.title)}</h3>
      <p class="offer-summary">${esc(o.summary)}</p>
      <div class="badges">${pay}${mode}${hire}</div>
      <div class="meta">
        <div>Starts<b>${fmtShort(o.startDate)}</b></div>
        <div>Length<b>${o.durationMonths} months</b></div>
        <div>Places<b>${o.openings}</b></div>
      </div>
      <details>
        <summary>See the details</summary>
        <div class="more">
          <h4>What you'll do</h4>
          <ul>${o.missions.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>
          <h4>What you bring</h4>
          <p class="chips">${o.skills.map((s) => `<span>${esc(s)}</span>`).join("")}</p>
          <p class="small">Nice to have: ${o.niceToHave.map(esc).join(", ")}</p>
          <h4>Good to know</h4>
          <ul class="small">
            <li>Mentor: ${esc(o.mentor.name)}, ${esc(o.mentor.role)}</li>
            <li>${esc(o.preHireNote)}</li>
            ${o.perks.map((p) => `<li>${esc(p)}</li>`).join("")}
            <li>Working language: ${esc(o.language)}</li>
          </ul>
          <a class="btn" href="#apply" data-apply="${o.id}">Apply for this PFE</a>
        </div>
      </details>
    </div>
  </article>`;
}

function renderStatic() {
  const c = Careers.getCompany();
  $("#deadline").textContent = fmtDate(c.applicationDeadline, "short").replace(/ \d{4}$/, "");
  $("#process").innerHTML = c.process.map((p) => `<li><span>${esc(p)}</span></li>`).join("");
  $("#response-time").textContent = c.responseTime;
  const offers = Careers.listOffers().offers;
  $("#offer-list").innerHTML = offers.map(offerCard).join("");
  $("#apply-offer").innerHTML = `<option value="">Choose a subject</option>` +
    offers.map((o) => `<option value="${o.id}">${esc(o.title)}</option>`).join("");
}

function wire() {
  NEEDS.forEach((s) => $(s).addEventListener("change", renderMatrix));
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-apply]");
    if (a) $("#apply-offer").value = a.dataset.apply;
  });
  $("#apply-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const res = Careers.submitApplication({
      offerId: $("#apply-offer").value, fullName: $("#apply-name").value,
      email: $("#apply-email").value, school: $("#apply-school").value, message: $("#apply-message").value
    });
    const out = $("#apply-result");
    out.hidden = false;
    if (!res.ok) { out.className = "result error"; out.textContent = res.reason; return; }
    out.className = "result success";
    out.innerHTML = `Application sent for <strong>${esc(res.application.offerTitle)}</strong>. Your reference is <strong>${res.application.reference}</strong>.`;
    e.target.reset();
  });
}

export const App = { page: { ...Careers } };
window.AtlasCareers = App;

renderStatic();
renderMatrix();
wire();
