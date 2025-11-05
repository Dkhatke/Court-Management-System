document.addEventListener("DOMContentLoaded", () => {
  loadCases();
  loadHearings();
  loadJudgements();
});

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
        <td>${c.filingDate}</td>
        <td>${c.courtId}</td>
        <td>${c.judgeId}</td>
      </tr>`
      )
      .join("");
  } catch (err) {
    console.error("Error loading cases:", err);
  }
}

async function loadHearings(query = "") {
  try {
    const res = await fetch(query ? `hearings?search=${encodeURIComponent(query)}` : "hearings");
    const data = await res.json();
    document.getElementById("hearingTableBody").innerHTML = data
      .map(
        h => `
      <tr>
        <td>${h.hearingId}</td>
        <td>${h.caseId}</td>
        <td>${h.date ?? "—"}</td>
        <td>${h.nextDate ?? "—"}</td>
        <td>${h.report ?? "—"}</td>
      </tr>`
      )
      .join("");
  } catch (err) {
    console.error("Error loading hearings:", err);
  }
}

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

function searchJudgeData() {
  const q = document.getElementById("judgeSearch").value.trim();
  loadCases(q);
  loadHearings(q);
  loadJudgements(q);
}
