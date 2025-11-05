// ---------------------- UTILS ----------------------
async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return await res.json().catch(() => []); // handle empty response
}

function createRow(data, cols, deleteFn, idField) {
  let row = "<tr>";
  cols.forEach(c => (row += `<td>${data[c] || ""}</td>`));
  if (deleteFn && idField)
    row += `<td><button class="btn btn-danger btn-sm" onclick="${deleteFn}(${data[idField]})">Delete</button></td>`;
  row += "</tr>";
  return row;
}

// ---------------------- COURTS ----------------------
async function loadCourts() {
  const tbody = document.querySelector("#courtTableBody");
  if (!tbody) return;
  const courts = await fetchJSON("courts");
  tbody.innerHTML = courts.map(c =>
    createRow(c, ["courtId", "courtName", "city", "state", "type"], "deleteCourt", "courtId")
  ).join("");
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
  setTimeout(loadCourts, 200);
}

async function deleteCourt(id) {
  await fetch(`courts?id=${id}`, { method: "DELETE" });
  setTimeout(loadCourts, 200);
}

// ---------------------- JUDGES ----------------------
async function loadJudges() {
  const tbody = document.querySelector("#judgeTableBody");
  if (!tbody) return;
  const judges = await fetchJSON("judges");
  tbody.innerHTML = judges.map(j =>
    createRow(j, ["judgeId", "judgeName", "judgeCourt"], "deleteJudge", "judgeId")
  ).join("");
}

async function addJudge() {
  const judge = {
    judgeName: prompt("Enter judge name:"),
    judgeCourt: prompt("Enter court name:")
  };
  if (!judge.judgeName) return;
  await fetch("judges", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(judge)
  });
  setTimeout(loadJudges, 200);
}

async function deleteJudge(id) {
  await fetch(`judges?id=${id}`, { method: "DELETE" });
  setTimeout(loadJudges, 200);
}

// ---------------------- LAWYERS ----------------------
async function loadLawyers() {
  const tbody = document.querySelector("#lawyerTableBody");
  if (!tbody) return;
  const lawyers = await fetchJSON("lawyers");
  tbody.innerHTML = lawyers.map(l =>
    createRow(l, ["lawyerId", "lawyerName", "lawyerEmail", "lawyerPhone"], "deleteLawyer", "lawyerId")
  ).join("");
}

async function addLawyer() {
  const lawyer = {
    lawyerName: prompt("Enter lawyer name:"),
    lawyerEmail: prompt("Enter email:"),
    lawyerPhone: prompt("Enter phone:")
  };
  if (!lawyer.lawyerName) return;
  await fetch("lawyers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lawyer)
  });
  setTimeout(loadLawyers, 200);
}

async function deleteLawyer(id) {
  await fetch(`lawyers?id=${id}`, { method: "DELETE" });
  setTimeout(loadLawyers, 200);
}

// ---------------------- CLIENTS ----------------------
async function loadClients() {
  const tbody = document.querySelector("#clientTableBody");
  if (!tbody) return;
  const clients = await fetchJSON("clients");
  tbody.innerHTML = clients.map(c =>
    createRow(c, ["clientId", "clientName", "clientAddress", "clientEmail"], "deleteClient", "clientId")
  ).join("");
}

async function addClient() {
  const client = {
    clientName: prompt("Enter client name:"),
    clientAddress: prompt("Enter address:"),
    clientEmail: prompt("Enter email:")
  };
  if (!client.clientName) return;
  await fetch("clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(client)
  });
  setTimeout(loadClients, 200);
}

async function deleteClient(id) {
  await fetch(`clients?id=${id}`, { method: "DELETE" });
  setTimeout(loadClients, 200);
}

// ---------------------- CASES ----------------------
async function loadCases() {
  const tbody = document.querySelector("#caseTableBody");
  if (!tbody) return;
  const cases = await fetchJSON("cases");
  tbody.innerHTML = cases.map(c =>
    createRow(c, ["caseId", "caseTitle", "clientId", "lawyerId", "judgeId", "status"], "deleteCase", "caseId")
  ).join("");
}

async function addCase() {
  const caseData = {
    caseTitle: prompt("Enter case title:"),
    clientId: prompt("Enter client ID:"),
    lawyerId: prompt("Enter lawyer ID:"),
    judgeId: prompt("Enter judge ID:"),
    status: prompt("Enter status:")
  };
  if (!caseData.caseTitle) return;
  await fetch("cases", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(caseData)
  });
  setTimeout(loadCases, 200);
}

async function deleteCase(id) {
  await fetch(`cases?id=${id}`, { method: "DELETE" });
  setTimeout(loadCases, 200);
}

// ---------------------- HEARINGS ----------------------
async function loadHearings() {
  const tbody = document.querySelector("#hearingTableBody");
  if (!tbody) return;
  const hearings = await fetchJSON("hearings");
  tbody.innerHTML = hearings.map(h =>
    createRow(h, ["hearingId", "caseId", "hearingDate", "remarks"], "deleteHearing", "hearingId")
  ).join("");
}

async function addHearing() {
  const hearing = {
    caseId: prompt("Enter case ID:"),
    hearingDate: prompt("Enter hearing date (YYYY-MM-DD):"),
    remarks: prompt("Enter remarks:")
  };
  if (!hearing.caseId) return;
  await fetch("hearings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hearing)
  });
  setTimeout(loadHearings, 200);
}

async function deleteHearing(id) {
  await fetch(`hearings?id=${id}`, { method: "DELETE" });
  setTimeout(loadHearings, 200);
}

// ---------------------- JUDGEMENTS ----------------------
async function loadJudgements() {
  const tbody = document.querySelector("#judgementTableBody");
  if (!tbody) return;
  const judgements = await fetchJSON("judgements");
  tbody.innerHTML = judgements.map(j =>
    createRow(j, ["judgementId", "caseId", "decision", "judgementDate"], "deleteJudgement", "judgementId")
  ).join("");
}

async function addJudgement() {
  const judgement = {
    caseId: prompt("Enter case ID:"),
    decision: prompt("Enter decision:"),
    judgementDate: prompt("Enter judgement date (YYYY-MM-DD):")
  };
  if (!judgement.caseId) return;
  await fetch("judgements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(judgement)
  });
  setTimeout(loadJudgements, 200);
}

async function deleteJudgement(id) {
  await fetch(`judgements?id=${id}`, { method: "DELETE" });
  setTimeout(loadJudgements, 200);
}

// ---------------------- ROLE LOADER ----------------------
document.addEventListener("DOMContentLoaded", () => {
  loadCourts();
  loadJudges();
  loadLawyers();
  loadClients();
  loadCases();
  loadHearings();
  loadJudgements();
});
