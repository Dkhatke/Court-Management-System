document.addEventListener("DOMContentLoaded", () => {
  loadCases();
  loadHearings();
  loadJudgements();
  setupSearchListeners();
});

function setupSearchListeners() {
  const caseSearch = document.getElementById('caseSearch');
  if (caseSearch) caseSearch.addEventListener('input', e => loadCases(e.target.value.trim().toLowerCase()));

  const hearingSearch = document.getElementById('hearingSearch');
  if (hearingSearch) hearingSearch.addEventListener('input', e => loadHearings(e.target.value.trim().toLowerCase()));

  const judgementSearch = document.getElementById('judgementSearch');
  if (judgementSearch) judgementSearch.addEventListener('input', e => loadJudgements(e.target.value.trim().toLowerCase()));
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return isNaN(d) ? dateStr : d.toLocaleDateString();
}

// Fetch all records then filter client-side for robust search behavior
async function loadCases(query = '') {
  try {
    const res = await fetch('cases');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const filtered = query ? data.filter(c => Object.values(c).some(v => v !== null && v !== undefined && String(v).toLowerCase().includes(query))) : data;

    document.getElementById('caseTableBody').innerHTML = filtered
      .map(c => `
      <tr>
        <td>${c.caseId ?? '—'}</td>
        <td>${c.caseTitle ?? '—'}</td>
        <td>${c.courtId ?? '—'}</td>
        <td>${c.judgeId ?? '—'}</td>
        <td>${formatDate(c.filingDate)}</td>
      </tr>`)
      .join('');
  } catch (err) {
    console.error('Error loading cases:', err);
  }
}

async function loadHearings(query = '') {
  try {
    const res = await fetch('hearings');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const filtered = query ? data.filter(h => Object.values(h).some(v => v !== null && v !== undefined && String(v).toLowerCase().includes(query))) : data;

    document.getElementById('hearingTableBody').innerHTML = filtered
      .map(h => `
      <tr>
        <td>${h.hearingId ?? '—'}</td>
        <td>${h.caseId ?? '—'}</td>
        <td>${formatDate(h.date)}</td>
        <td>${formatDate(h.nextDate)}</td>
        <td>${h.report ?? '—'}</td>
      </tr>`)
      .join('');
  } catch (err) {
    console.error('Error loading hearings:', err);
  }
}

async function loadJudgements(query = '') {
  try {
    const res = await fetch('judgements');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const filtered = query ? data.filter(j => Object.values(j).some(v => v !== null && v !== undefined && String(v).toLowerCase().includes(query))) : data;

    document.getElementById('judgementTableBody').innerHTML = filtered
      .map(j => `
      <tr>
        <td>${j.judgementId ?? '—'}</td>
        <td>${j.caseId ?? '—'}</td>
        <td>${formatDate(j.judgementDate ?? j.date)}</td>
        <td>${j.verdict ?? '—'}</td>
      </tr>`)
      .join('');
  } catch (err) {
    console.error('Error loading judgements:', err);
  }
}
