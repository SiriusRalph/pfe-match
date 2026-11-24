// Renders PFE Match and keeps the page in sync with the student's data in js/student.js.
import * as Student from "./student.js";

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtMAD = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const fmtDay = (iso) => iso ? new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";
const modeText = (e) => e.workMode === "remote" ? "Remote" : e.workMode === "hybrid" ? `Hybrid${e.officeDays ? `, ${e.officeDays} ${e.officeDays > 1 ? "days" : "day"} at the office` : ""}` : e.workMode === "on-site" ? "On-site" : "Format not given";

function renderNeeds(s) {
  const p = s.profile, n = p.needs;
  $("#me-name").textContent = p.firstName;
  $("#me-initial").textContent = p.firstName[0] || "S";
  $("#me-school").textContent = p.school;
  $("#n-paid").checked = n.paid;
  $("#n-min").value = n.minStipendMAD;
  $("#n-min-out").textContent = fmtMAD(n.minStipendMAD);
  $("#n-min-wrap").classList.toggle("off", !n.paid);
  $("#n-min").disabled = !n.paid;
  document.querySelectorAll('input[name="mode"]').forEach((el) => { el.checked = n.workModes.includes(el.value); });
  $("#n-start").value = n.startBy || "";
  $("#n-prehire").value = n.preHire;
  $("#p-from").textContent = fmtDay(p.availableFrom);
  $("#p-length").textContent = `${p.durationMonths} months`;
  $("#p-from").textContent = `From ${fmtDay(p.availableFrom)}`;
  $("#p-skills").innerHTML = p.skills.map((k) => `<span>${esc(k)}</span>`).join("");
}

const daysLeft = (iso) => Math.ceil((new Date(iso + "T23:59:59") - new Date()) / 86400000);
const fmtShortDay = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" });

function shortCard(e, needs) {
  const checks = Student.fitChecks(e, needs);
  const good = checks.filter((c) => c.ok === true).length;
  const all = checks.length;
  const company = Student.DIRECTORY.find((c) => c.id === e.companyId);
  const pct = all ? Math.round((good / all) * 100) : 0;
  const key = `${esc(e.companyId)}|${esc(e.offerId)}`;
  return `
  <article class="card" style="--brand:${company ? company.color : "#6D4AFF"}">
    <div class="card-top">
      <span class="co-badge"><span class="co-sq">${esc(e.company[0])}</span>${esc(e.company)}</span>
      <span class="match ${good === all ? "full" : ""}" title="${good} of ${all} needs met">
        <svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" class="ring-bg"/><circle cx="18" cy="18" r="15" class="ring" style="stroke-dasharray:${(pct * 94.2) / 100} 94.2"/></svg>
        <b>${good}/${all}</b></span>
    </div>
    <h3>${esc(e.title)}</h3>
    <dl class="kv">
      <div><dt>Stipend</dt><dd>${e.stipendMAD == null ? "—" : e.stipendMAD > 0 ? `${fmtMAD(e.stipendMAD)} MAD` : "Unpaid"}</dd></div>
      <div><dt>Format</dt><dd>${esc(modeText(e))}</dd></div>
      <div><dt>Starts</dt><dd>${e.startDate ? fmtShortDay(e.startDate) : "—"}</dd></div>
      <div><dt>Hiring</dt><dd>${e.preHire ? { yes: "Planned", possible: "Possible", no: "Not planned" }[e.preHire] : "—"}</dd></div>
    </dl>
    <ul class="checks">${checks.map((c) => `<li class="${c.ok === true ? "ok" : c.ok === false ? "no" : "unk"}">${esc(c.label)}</li>`).join("")}</ul>
    ${e.note ? `<p class="note">${esc(e.note)}</p>` : ""}
    <div class="card-actions">
      ${e.status === "applied"
        ? `<button type="button" class="btn btn-ghost btn-sm" data-status="${key}|saved">Move back to saved</button>`
        : `<a class="btn btn-sm" href="${esc(e.link)}" target="_blank" rel="noopener">Apply on site</a>
           <button type="button" class="btn btn-ghost btn-sm" data-status="${key}|applied">Mark applied</button>`}
      <button type="button" class="icon-btn sm" aria-label="Remove from shortlist" data-remove="${key}"><svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg></button>
    </div>
  </article>`;
}

function renderShortlist(s) {
  const saved = s.shortlist.filter((e) => e.status !== "applied");
  const applied = s.shortlist.filter((e) => e.status === "applied");
  $("#short-count").textContent = s.shortlist.length ? `${s.shortlist.length} offer${s.shortlist.length > 1 ? "s" : ""}` : "";
  $("#nav-count").textContent = s.shortlist.length;
  $("#n-saved").textContent = saved.length;
  $("#n-applied").textContent = applied.length;
  $("#short-list").innerHTML = saved.length ? saved.map((e) => shortCard(e, s.profile.needs)).join("")
    : `<div class="empty"><strong>No saved offers yet</strong><span>Ask your agent: "Find PFEs that match my needs", then "Save the best match".</span></div>`;
  $("#applied-list").innerHTML = applied.length ? applied.map((e) => shortCard(e, s.profile.needs)).join("")
    : `<div class="empty"><span>When you apply on a company's site, mark the offer as applied.</span></div>`;

  // overview stats
  $("#st-saved").textContent = s.shortlist.length;
  $("#st-applied").textContent = `${applied.length} applied`;
  let best = null;
  for (const e of s.shortlist) {
    const c = Student.fitChecks(e, s.profile.needs);
    const score = c.filter((x) => x.ok === true).length / (c.length || 1);
    if (!best || score > best.score) best = { e, score, label: `${c.filter((x) => x.ok === true).length}/${c.length}` };
  }
  $("#st-best").textContent = best ? best.label : "—";
  $("#st-best-sub").textContent = best ? `${best.e.company} · ${best.e.title.split(" — ")[0]}` : "save an offer to see it";
}

function renderCompanies(s) {
  $("#st-companies").textContent = s.companies.length;
  $("#company-list").innerHTML = s.companies.map((c) => `
    <li style="--brand:${c.color}"><span class="co-sq">${esc(c.name[0])}</span>
      <div><strong>${esc(c.name)}</strong><small>${esc(c.city)} · PFE agent</small></div>
      <span class="status-dot" title="Agent online"></span></li>`).join("");
  $("#company-cards").innerHTML = s.companies.map((c) => `
    <article class="co-card" style="--brand:${c.color}">
      <span class="co-sq lg">${esc(c.name[0])}</span>
      <div><h3>${esc(c.name)}</h3><p>${esc(c.tagline)} · ${esc(c.city)}</p>
        <p class="agent-on"><span class="live"></span>PFE agent online</p></div>
      <a class="btn btn-ghost btn-sm" href="${esc(c.page)}" target="_blank" rel="noopener">Visit careers site</a>
    </article>`).join("") + `
    <article class="co-card add"><span class="co-sq lg">+</span>
      <div><h3>Your company here</h3><p>Publish a PFE agent on your own careers site, and students' agents can find it.</p></div></article>`;
  const upcoming = s.companies.filter((c) => c.deadline).sort((a, b) => a.deadline.localeCompare(b.deadline));
  $("#deadline-list").innerHTML = upcoming.map((c) => {
    const d = daysLeft(c.deadline);
    return `<li style="--brand:${c.color}"><span class="co-sq">${esc(c.name[0])}</span>
      <div><strong>${esc(c.name)}</strong><small>Applications close ${fmtShortDay(c.deadline)}</small></div>
      <span class="days ${d <= 30 ? "soon" : ""}">${d > 0 ? `${d} days` : "Closed"}</span></li>`;
  }).join("");
  const next = upcoming.find((c) => daysLeft(c.deadline) > 0);
  $("#st-deadline").textContent = next ? `${daysLeft(next.deadline)} days` : "—";
  $("#st-deadline-sub").textContent = next ? `${next.name}, ${fmtShortDay(next.deadline)}` : "";
}

function greet() {
  const h = new Date().getHours();
  const part = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  $("#greet-h").textContent = `${part}, ${Student.getState().profile.firstName}`;
}

function render(s = Student.getState()) {
  renderNeeds(s);
  renderShortlist(s);
  renderCompanies(s);
}

function wire() {
  $("#n-paid").addEventListener("change", (e) => Student.updateNeeds({ paid: e.target.checked }));
  $("#n-min").addEventListener("input", (e) => { $("#n-min-out").textContent = fmtMAD(e.target.value); });
  $("#n-min").addEventListener("change", (e) => Student.updateNeeds({ minStipendMAD: Number(e.target.value) }));
  document.querySelectorAll('input[name="mode"]').forEach((el) => el.addEventListener("change", () => {
    const modes = [...document.querySelectorAll('input[name="mode"]:checked')].map((x) => x.value);
    const res = Student.updateNeeds({ workModes: modes });
    if (!res.ok) { el.checked = true; }
  }));
  $("#n-start").addEventListener("change", (e) => Student.updateNeeds({ startBy: e.target.value }));
  $("#n-prehire").addEventListener("change", (e) => Student.updateNeeds({ preHire: e.target.value }));
  document.querySelector(".board").addEventListener("click", (e) => {
    const rm = e.target.closest("[data-remove]");
    if (rm) {
      const [companyId, offerId] = rm.dataset.remove.split("|");
      Student.removeFromShortlist({ companyId, offerId });
      return;
    }
    const st = e.target.closest("[data-status]");
    if (st) {
      const [companyId, offerId, status] = st.dataset.status.split("|");
      Student.setStatus({ companyId, offerId, status });
    }
  });
  $("#new-search").addEventListener("click", () => {
    setTimeout(() => document.querySelector(".atlas-suggest button")?.focus(), 400);
  });
  $("#reset-demo").addEventListener("click", () => Student.resetDemo());
}

export const App = { page: { ...Student } };
window.PfeMatch = App;

Student.subscribe(render);
greet();
render();
wire();
