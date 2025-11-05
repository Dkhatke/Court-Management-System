document.addEventListener("DOMContentLoaded", () => {
  loadCases();
  loadHearings();
  loadJudgements();
  setupSearchListeners();
});

function setupSearchListeners() {
  // Case search
  const caseSearch = document.getElementById('caseSearch');
  if (caseSearch) {
    caseSearch.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      loadCases(query);
    });
  }

  // Hearing search
  const hearingSearch = document.getElementById('hearingSearch');
  if (hearingSearch) {
    hearingSearch.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      loadHearings(query);
    });
  }

  // Judgement search
  const judgementSearch = document.getElementById('judgementSearch');
  if (judgementSearch) {
    judgementSearch.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      loadJudgements(query);
    });
  }
}

// helper to format dates and handle nulls
function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return isNaN(d) ? dateStr : d.toLocaleDateString();
}

// Generic client-side filtering: fetch all then filter locally so search works even if backend
// doesn't implement a search param.
async function loadCases(query = "") {
  try {
    const res = await fetch("cases");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const filtered = query
      ? data.filter(c => Object.values(c).some(v => v !== null && v !== undefined && String(v).toLowerCase().includes(query)))
      : data;

    document.getElementById("caseTableBody").innerHTML = filtered
      .map(c => `
      <tr>
        <td>${c.caseId ?? "—"}</td>
        <td>${c.caseTitle ?? "—"}</td>
        <td>${formatDate(c.filingDate)}</td>
        <td>${c.courtId ?? "—"}</td>
        <td>${c.judgeId ?? "—"}</td>
      </tr>`)
      .join("");
  } catch (err) {
    console.error("Error loading cases:", err);
  }
}

async function loadHearings(query = "") {
  try {
    const res = await fetch("hearings");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const filtered = query
      ? data.filter(h => Object.values(h).some(v => v !== null && v !== undefined && String(v).toLowerCase().includes(query)))
      : data;

    document.getElementById("hearingTableBody").innerHTML = filtered
      .map(h => `
      <tr>
        <td>${h.hearingId ?? "—"}</td>
        <td>${h.caseId ?? "—"}</td>
        <td>${formatDate(h.date)}</td>
        <td>${formatDate(h.nextDate)}</td>
        <td>${h.report ?? "—"}</td>
      </tr>`)
      .join("");
  } catch (err) {
    console.error("Error loading hearings:", err);
  }
}

async function loadJudgements(query = "") {
  try {
    const res = await fetch("judgements");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const filtered = query
      ? data.filter(j => Object.values(j).some(v => v !== null && v !== undefined && String(v).toLowerCase().includes(query)))
      : data;

    // Support both 'judgementDate' and 'date' field names returned by backend
    document.getElementById("judgementTableBody").innerHTML = filtered
      .map(j => `
      <tr>
        <td>${j.judgementId ?? "—"}</td>
        <td>${j.caseId ?? "—"}</td>
        <td>${formatDate(j.judgementDate ?? j.date)}</td>
        <td>${j.verdict ?? "—"}</td>
      </tr>`)
      .join("");
  } catch (err) {
    console.error("Error loading judgements:", err);
  }
}

function searchJudgeData() {
  const q = document.getElementById("judgeSearch").value.trim();
  loadCases(q);
  loadHearings(q);
  loadJudgements(q);
}
