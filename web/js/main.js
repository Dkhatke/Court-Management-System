// ---------------------- UTILS ----------------------
async function fetchJSON(url, options = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      console.error("Fetch failed:", res.status, res.statusText);
      return [];
    }
    return await res.json().catch(() => []);
  } catch (err) {
    console.error("Network error:", err);
    return [];
  }
}

function createRow(data, cols, deleteFn, idField) {
  let row = "<tr>";
  cols.forEach(c => (row += `<td>${data[c] ?? ""}</td>`));
  if (deleteFn && idField)
    row += `<td><button class="btn btn-danger btn-sm" onclick="${deleteFn}(${data[idField]})">Delete</button></td>`;
  row += "</tr>";
  return row;
}

function safeGet(id) {
  return document.getElementById(id);
}

async function loadTable(url, tbodyId, cols, deleteFn, idField, searchQuery = "") {
  const tbody = safeGet(tbodyId);
  if (!tbody) return;
  const endpoint = searchQuery ? `${url}?search=${encodeURIComponent(searchQuery)}` : url;
  const list = await fetchJSON(endpoint);
  tbody.innerHTML = list.map(e => createRow(e, cols, deleteFn, idField)).join("");
}

// ---------------------- COURTS ----------------------
async function loadCourts(search = "") {
  await loadTable("courts", "courtTableBody", ["courtId", "courtName", "city", "state", "type"], "deleteCourt", "courtId", search);
}
async function addCourt() {
  const court = {
    courtName: prompt("Enter court name:"),
    city: prompt("Enter city:"),
    state: prompt("Enter state:"),
    type: prompt("Enter type:")
  };
  if (!court.courtName) return;
  await fetch("courts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(court)
  });
  loadCourts();
}
async function deleteCourt(id) {
  await fetch(`courts?id=${id}`, { method: "DELETE" });
  loadCourts();
}

// ---------------------- JUDGES ----------------------
async function loadJudges(search = "") {
  await loadTable("judges", "judgeTableBody", ["judgeId", "judgeName", "courtId", "designation"], "deleteJudge", "judgeId", search);
}
async function addJudge() {
  const j = {
    judgeName: prompt("Enter judge name:"),
    courtId: prompt("Enter court ID:"),
    designation: prompt("Enter designation:")
  };
  if (!j.judgeName) return;
  await fetch("judges", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(j)
  });
  loadJudges();
}
async function deleteJudge(id) {
  await fetch(`judges?id=${id}`, { method: "DELETE" });
  loadJudges();
}

// ---------------------- LAWYERS ----------------------
async function loadLawyers(search = "") {
  await loadTable("lawyers", "lawyerTableBody", ["lawyerId", "firstName", "lastName", "specialization", "email"], "deleteLawyer", "lawyerId", search);
}
async function addLawyer() {
  const l = {
    lawyerName: prompt("Enter lawyer name:"),
    specialization: prompt("Enter specialization:"),
    lawyerEmail: prompt("Enter email:")
  };
  if (!l.lawyerName) return;
  await fetch("lawyers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(l)
  });
  loadLawyers();
}
async function deleteLawyer(id) {
  await fetch(`lawyers?id=${id}`, { method: "DELETE" });
  loadLawyers();
}

// ---------------------- CLIENTS ----------------------
async function loadClients(search = "") {
  await loadTable("clients", "clientTableBody", ["clientId", "clientName", "clientAddress", "clientEmail"], "deleteClient", "clientId", search);
}
async function addClient() {
  const c = {
    clientName: prompt("Enter client name:"),
    clientAddress: prompt("Enter address:"),
    clientEmail: prompt("Enter email:")
  };
  if (!c.clientName) return;
  await fetch("clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(c)
  });
  loadClients();
}
async function deleteClient(id) {
  await fetch(`clients?id=${id}`, { method: "DELETE" });
  loadClients();
}

// ---------------------- CASES ----------------------
async function loadCases(search = "") {
  await loadTable("cases", "caseTableBody", ["caseId", "caseTitle", "courtId", "judgeId", "filingDate"], "deleteCase", "caseId", search);
}
async function addCase() {
  const c = {
    caseTitle: prompt("Enter case title:"),
    courtId: prompt("Enter court ID:"),
    judgeId: prompt("Enter judge ID:"),
    filingDate: prompt("Enter filing date (YYYY-MM-DD):")
  };
  if (!c.caseTitle) return;
  await fetch("cases", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(c)
  });
  loadCases();
}
async function deleteCase(id) {
  await fetch(`cases?id=${id}`, { method: "DELETE" });
  loadCases();
}

// ---------------------- HEARINGS ----------------------
async function loadHearings(search = "") {
  await loadTable("hearings", "hearingTableBody", ["hearingId", "caseId", "date", "nextDate", "report"], "deleteHearing", "hearingId", search);
}
async function addHearing() {
  const h = {
    caseId: prompt("Enter case ID:"),
    date: prompt("Enter hearing date (YYYY-MM-DD):"),
    nextDate: prompt("Enter next hearing date (YYYY-MM-DD):"),
    report: prompt("Enter hearing report:")
  };
  if (!h.caseId) return;
  await fetch("hearings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(h)
  });
  loadHearings();
}
async function deleteHearing(id) {
  await fetch(`hearings?id=${id}`, { method: "DELETE" });
  loadHearings();
}

// ---------------------- JUDGEMENTS ----------------------
async function loadJudgements(search = "") {
  await loadTable("judgements", "judgementTableBody", ["judgementId", "caseId", "judgementDate", "verdict"], "deleteJudgement", "judgementId", search);
}
async function addJudgement() {
  const j = {
    caseId: prompt("Enter case ID:"),
    judgementDate: prompt("Enter judgement date (YYYY-MM-DD):"),
    verdict: prompt("Enter verdict:")
  };
  if (!j.caseId) return;
  await fetch("judgements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(j)
  });
  loadJudgements();
}
async function deleteJudgement(id) {
  await fetch(`judgements?id=${id}`, { method: "DELETE" });
  loadJudgements();
}

// ---------------------- ROLE-BASED INITIALIZATION ----------------------
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.includes("admin-dashboard")) {
    loadCourts();
    loadJudges();
    loadLawyers();
    loadClients();
    loadCases();
    loadHearings();
    loadJudgements();
  } else if (path.includes("judge-dashboard")) {
    loadCases();
    loadHearings();
    loadJudgements();
  } else if (path.includes("lawyer-dashboard")) {
    loadCases();
    loadHearings();
  } else if (path.includes("client-dashboard")) {
    loadCases();
    loadJudgements();
  }
});
