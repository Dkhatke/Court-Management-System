document.addEventListener("DOMContentLoaded", () => {
  loadCases();
  loadHearings();
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

function searchLawyerData() {
  const q = document.getElementById("lawyerSearch").value.trim();
  loadCases(q);
  loadHearings(q);
}
