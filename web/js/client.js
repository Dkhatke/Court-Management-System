document.addEventListener("DOMContentLoaded", () => {
  loadCases();
  loadJudgements();
});

// Load all cases for the client
async function loadCases(query = "") {
  try {
    const res = await fetch(query ? `cases?search=${encodeURIComponent(query)}` : "cases");
    const data = await res.json();
    document.getElementById("caseTableBody").innerHTML = data
      .map(
        c => `
      <tr>
        <td>${c.caseId}</td>
        <td>${c.caseTitle}</td>
        <td>${c.courtId}</td>
        <td>${c.judgeId}</td>
        <td>${c.filingDate}</td>
      </tr>`
      )
      .join("");
  } catch (err) {
    console.error("Error loading cases:", err);
  }
}

// Load judgements for client
async function loadJudgements(query = "") {
  try {
    const res = await fetch(query ? `judgements?search=${encodeURIComponent(query)}` : "judgements");
    const data = await res.json();
    document.getElementById("judgementTableBody").innerHTML = data
      .map(
        j => `
      <tr>
        <td>${j.judgementId}</td>
        <td>${j.caseId}</td>
        <td>${j.judgementDate}</td>
        <td>${j.verdict}</td>
      </tr>`
      )
      .join("");
  } catch (err) {
    console.error("Error loading judgements:", err);
  }
}

// Optional: Live search
function searchClientData() {
  const q = document.getElementById("clientSearch").value.trim();
  loadCases(q);
  loadJudgements(q);
}
