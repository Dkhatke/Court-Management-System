// =========================
// ADMIN DASHBOARD SCRIPT (Unified + Search Enabled)
// =========================

// Trigger full data load and set up search listeners
document.addEventListener("DOMContentLoaded", () => {
  loadAll();
  setupSearchListeners();
});

// Set up search listeners for all tables
function setupSearchListeners() {
  const searchInputs = [
    { input: 'courtSearch', endpoint: 'courts' },
    { input: 'judgeSearch', endpoint: 'judges' },
    { input: 'lawyerSearch', endpoint: 'lawyers' },
    { input: 'clientSearch', endpoint: 'clients' },
    { input: 'caseSearch', endpoint: 'cases' },
    { input: 'hearingSearch', endpoint: 'hearings' },
    { input: 'judgementSearch', endpoint: 'judgements' }
  ];

  searchInputs.forEach(({input, endpoint}) => {
    const searchInput = document.getElementById(input);
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        searchRecords(endpoint, input, `${endpoint.slice(0, -1)}TableBody`);
      });
    }
  });
}

// =========================
// LOAD ALL TABLES
// =========================
function loadAll() {
  const tables = ["courts", "judges", "lawyers", "clients", "cases", "hearings", "judgements"];
  tables.forEach(endpoint => loadTable(endpoint, `${endpoint.slice(0, -1)}TableBody`));
}

// =========================
// LOAD TABLE (With Optional Search)
// =========================
async function loadTable(endpoint, tbodyId, query = "") {
  try {
    const url = query ? `${endpoint}?search=${encodeURIComponent(query)}` : endpoint;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    const tbody = document.getElementById(tbodyId);
    tbody.innerHTML = "";

    // If the backend doesn't support search, do client-side filtering here
    const normalizedQuery = query ? query.toLowerCase() : null;
    const rowsToRender = normalizedQuery
      ? data.filter(obj => Object.values(obj).some(v => (v !== null && v !== undefined) && String(v).toLowerCase().includes(normalizedQuery)))
      : data;

    rowsToRender.forEach(obj => {
      let row = "<tr>";
      const cols = Object.values(obj);

      // Special handling for hearings table to ensure proper column alignment
      if (endpoint === 'hearings') {
        // We know the exact column order for hearings
        const [caseId, hearingId, date, nextDate, report] = cols;
        
        // Format dates
        const formatDate = (dateStr) => {
          if (dateStr && typeof dateStr === 'string' && dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
            const date = new Date(dateStr);
            return !isNaN(date) ? date.toLocaleDateString() : "—";
          }
          return dateStr ?? "—";
        };
        
        // Add each column with fixed width to prevent shifting
        row += `<td style="width: 15%">${caseId ?? "—"}</td>`;
        row += `<td style="width: 15%">${hearingId ?? "—"}</td>`;
        row += `<td style="width: 15%">${formatDate(date)}</td>`;
        row += `<td style="width: 15%">${formatDate(nextDate)}</td>`;
        row += `<td style="width: 30%">${report ?? "—"}</td>`;
      } else {
        // Regular handling for other tables
        cols.forEach(c => {
          if (typeof c === 'string' && c.match(/^\d{4}-\d{2}-\d{2}/)) {
            const date = new Date(c);
            if (!isNaN(date)) {
              row += `<td>${date.toLocaleDateString()}</td>`;
              return;
            }
          }
          row += `<td>${c ?? "—"}</td>`;
        });
      }

      // Use first column value as identifier for edit/delete callbacks
      const idVal = cols[0];
      // Always ensure action buttons are in their own column
      row += `
        <td style="width: 100px">
          <button class="btn btn-warning btn-sm me-1" onclick="editRecord('${endpoint}', ${idVal})">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteRecord('${endpoint}', ${idVal})">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>`;
      tbody.innerHTML += row;
    });
  } catch (err) {
    console.error(`Error loading ${endpoint}:`, err);
    alert(`Error loading data: ${err.message}`);
  }
}

// =========================
// SEARCH FUNCTION
// =========================
function searchRecords(endpoint, inputId, tbodyId) {
  const q = document.getElementById(inputId).value.trim();
  loadTable(endpoint, tbodyId, q);
}

// =========================
// DELETE RECORD
// =========================
async function deleteRecord(endpoint, id) {
  if (!confirm("Are you sure you want to delete this record?")) return;
  try {
    const response = await fetch(`${endpoint}?id=${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    await loadTable(endpoint, `${endpoint.slice(0, -1)}TableBody`);
  } catch (error) {
    console.error('Delete error:', error);
    alert('Error deleting record: ' + error.message);
  }
}

// =========================
// SHOW ADD / EDIT MODAL
// =========================
function showAddModal(type, existingData = null) {
  try {
    const modal = new bootstrap.Modal(document.getElementById("addModal"));
    const title = document.getElementById("modalTitle");
    const body = document.getElementById("modalBody");
    const saveBtn = document.getElementById("saveBtn");

    if (!modal || !title || !body || !saveBtn) {
      throw new Error("Required modal elements not found");
    }

    const isEdit = existingData !== null;
    title.innerText = (isEdit ? "Edit " : "Add ") + type.charAt(0).toUpperCase() + type.slice(1);
    body.innerHTML = generateForm(type, existingData);
    
    // Store the record ID for edit operations
    if (isEdit && existingData) {
      const idField = type + 'Id';
      saveBtn.dataset.recordId = existingData[idField] || '';
      if (!saveBtn.dataset.recordId) {
        console.warn(`No ${idField} found in existingData for edit operation`);
      }
    } else {
      delete saveBtn.dataset.recordId;
    }
    
    saveBtn.onclick = () => saveRecord(type, modal, isEdit);
    modal.show();
  } catch (error) {
    console.error('Error showing modal:', error);
    alert('Error showing form: ' + error.message);
  }
}

// =========================
// EDIT RECORD (Fetch existing data)
// =========================
async function editRecord(endpoint, id) {
  try {
    if (!endpoint || !id) {
      throw new Error('Missing required parameters: endpoint or id');
    }

    const response = await fetch(endpoint);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format: expected an array');
    }

    const record = data.find(r => {
      const firstValue = Object.values(r)[0];
      return firstValue === id || firstValue === Number(id);
    });
    
    if (record) {
      const type = endpoint.slice(0, -1);
      
      // Create a clean copy of the record
      const cleanRecord = { ...record };
      
      // Format all possible date fields
      const dateFields = ['doj', 'registrationYear', 'filingDate', 'date', 'nextDate', 'judgementDate'];
      dateFields.forEach(field => {
        if (cleanRecord[field]) {
          try {
            cleanRecord[field] = cleanRecord[field].split('T')[0];
          } catch (e) {
            console.warn(`Failed to format date for field ${field}:`, e);
          }
        }
      });
      
      showAddModal(type, cleanRecord);
    } else {
      throw new Error(`Record with ID ${id} not found`);
    }
  } catch (error) {
    console.error('Edit error:', error);
    alert('Error loading record: ' + error.message);
  }
}

// =========================
// SAVE (POST or PUT)
// =========================
async function saveRecord(type, modal, isEdit = false) {
  try {
    const endpoint = type + "s";
    const body = buildBody(type);
    
    // Validate required fields
    const missingFields = validateRequiredFields(type, body);
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    const method = isEdit ? "PUT" : "POST";
    const recordId = isEdit ? document.getElementById('saveBtn').dataset.recordId : null;
    // For PUT (edit) we send to the base endpoint and include the id in the JSON body.
    // The servlets are mapped to e.g. '/courts' (not '/courts/*'), so sending to '/courts/123' can result in 405.
    if (isEdit && recordId) {
      // Attach the id field expected by backend model (e.g. courtId, judgeId)
      const idField = type + 'Id';
      body[idField] = Number(recordId);
    }
    const url = endpoint;

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    modal.hide();
    await loadTable(endpoint, `${type}TableBody`);
    
  } catch (error) {
    console.error('Save error:', error);
    alert('Error saving record: ' + error.message);
  }
}

// =========================
// FORM VALIDATION
// =========================
function validateRequiredFields(type, body) {
  const required = {
    court: ['courtName', 'city', 'state', 'type'],
    judge: ['courtId', 'firstName', 'lastName', 'designation', 'email'],
    lawyer: ['firstName', 'lastName', 'email', 'specialization', 'licenceNo'],
    client: ['clientName', 'clientEmail', 'clientAddress'],
    case: ['caseTitle', 'filingDate', 'courtId', 'judgeId'],
    hearing: ['caseId', 'hearingId', 'date', 'report'],
    judgement: ['caseId', 'judgementId', 'judgementDate', 'verdict']
  };

  return required[type].filter(field => !body[field]);
}

// =========================
// GENERATE FORM INPUTS
// =========================
function generateForm(type, data = null) {
  const val = (k) => {
    if (!data || typeof data !== 'object') return "";
    const value = data[k];
    // Handle date values specifically
    if (value && ['doj', 'registrationYear', 'filingDate', 'date', 'nextDate', 'judgementDate'].includes(k)) {
      return value.split('T')[0]; // Split ISO date string to get just the date part
    }
    return value !== undefined && value !== null ? value : "";
  };

  // Validate form type
  if (!['court', 'judge', 'lawyer', 'client', 'case', 'hearing', 'judgement'].includes(type)) {
    console.error(`Invalid form type: ${type}`);
    return '<div class="alert alert-danger">Invalid form type requested</div>';
  }

  const forms = {
    court: `
      <input class="form-control mb-2" id="courtName" value="${val("courtName")}" placeholder="Court Name" required>
      <input class="form-control mb-2" id="city" value="${val("city")}" placeholder="City" required>
      <input class="form-control mb-2" id="state" value="${val("state")}" placeholder="State" required>
      <select class="form-control mb-2" id="type" required>
      <option value="">Select Court Type</option>
      <option value="Civil" ${val("type") === "Civil" ? "selected" : ""}>Civil Court</option>
      <option value="Family" ${val("type") === "Family" ? "selected" : ""}>Family Court</option>
      <option value="Criminal" ${val("type") === "Criminal" ? "selected" : ""}>Criminal Court</option>
      <option value="Commercial" ${val("type") === "Commercial" ? "selected" : ""}>Commercial Court</option>
      <option value="Corporate" ${val("type") === "Corporate" ? "selected" : ""}>Corporate Court</option>
      <option value="Juvenile" ${val("type") === "Juvenile" ? "selected" : ""}>Juvenile Court</option>
      </select>`,
    judge: `
      <input class="form-control mb-2" id="courtId" value="${val("courtId")}" placeholder="Court ID" required type="number">
      <input class="form-control mb-2" id="firstName" value="${val("firstName")}" placeholder="First Name" required>
      <input class="form-control mb-2" id="lastName" value="${val("lastName")}" placeholder="Last Name" required>
      <input class="form-control mb-2" id="designation" value="${val("designation")}" placeholder="Designation" required>
      <input class="form-control mb-2" id="email" value="${val("email")}" placeholder="Email" required type="email">
      <input class="form-control mb-2" id="doj" type="date" value="${val("doj")}" required>`,
    lawyer: `
      <input class="form-control mb-2" id="firstName" value="${val("firstName")}" placeholder="First Name" required>
      <input class="form-control mb-2" id="lastName" value="${val("lastName")}" placeholder="Last Name" required>
      <input class="form-control mb-2" id="email" value="${val("email")}" placeholder="Email" required type="email">
      <input class="form-control mb-2" id="address" value="${val("address")}" placeholder="Address" required>
      <input class="form-control mb-2" id="specialization" value="${val("specialization")}" placeholder="Specialization" required>
      <input class="form-control mb-2" id="licenceNo" value="${val("licenceNo")}" placeholder="Licence No" required type="number">
      <input class="form-control mb-2" id="registrationYear" type="date" value="${val("registrationYear")}" required>`,
    client: `
      <input class="form-control mb-2" id="clientName" value="${val("clientName")}" placeholder="Client Name" required>
      <input class="form-control mb-2" id="clientEmail" value="${val("clientEmail")}" placeholder="Email" required type="email">
      <textarea class="form-control mb-2" id="clientAddress" placeholder="Address" required>${val("clientAddress")}</textarea>`,
    case: `
      <input class="form-control mb-2" id="caseTitle" value="${val("caseTitle")}" placeholder="Case Title" required>
      <input class="form-control mb-2" id="filingDate" type="date" value="${val("filingDate")}" required>
      <input class="form-control mb-2" id="courtId" value="${val("courtId")}" placeholder="Court ID" required type="number">
      <input class="form-control mb-2" id="judgeId" value="${val("judgeId")}" placeholder="Judge ID" required type="number">`,
    hearing: `
      <input class="form-control mb-2" id="caseId" value="${val("caseId")}" placeholder="Case ID" required type="number">
      <input class="form-control mb-2" id="hearingId" value="${val("hearingId")}" placeholder="Hearing ID" required type="number">
      <input class="form-control mb-2" id="date" type="date" value="${val("date")}" required>
      <input class="form-control mb-2" id="nextDate" type="date" value="${val("nextDate")}">
      <textarea class="form-control mb-2" id="report" placeholder="Report" required>${val("report")}</textarea>`,
    judgement: `
      <input class="form-control mb-2" id="caseId" value="${val("caseId")}" placeholder="Case ID" required type="number">
      <input class="form-control mb-2" id="judgementId" value="${val("judgementId")}" placeholder="Judgement ID" required type="number">
      <input class="form-control mb-2" id="judgementDate" type="date" value="${val("judgementDate")}" required>
      <textarea class="form-control mb-2" id="verdict" placeholder="Verdict" required>${val("verdict")}</textarea>`
  };

  return forms[type] || '<div class="alert alert-danger">Unknown form type</div>';
}

// =========================
// BUILD BODY FOR SUBMIT
// =========================
function buildBody(type) {
  const val = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  };
  const intVal = (id) => {
    const value = val(id);
    return value ? parseInt(value, 10) : null;
  };

  const bodies = {
    court: { 
      courtName: val("courtName"), 
      city: val("city"), 
      state: val("state"), 
      type: val("type") 
    },
    judge: { 
      courtId: intVal("courtId"), 
      firstName: val("firstName"), 
      lastName: val("lastName"), 
      designation: val("designation"), 
      email: val("email"), 
      doj: val("doj") 
    },
    lawyer: { 
      firstName: val("firstName"), 
      lastName: val("lastName"), 
      address: val("address"),
      email: val("email"), 
      specialization: val("specialization"), 
      licenceNo: intVal("licenceNo"), 
      registrationYear: val("registrationYear")
    },
    client: { 
      clientName: val("clientName"), 
      clientEmail: val("clientEmail"), 
      clientAddress: val("clientAddress") 
    },
    case: { 
      caseTitle: val("caseTitle"), 
      filingDate: val("filingDate"),
      courtId: intVal("courtId"), 
      judgeId: intVal("judgeId") 
    },
    hearing: { 
      caseId: intVal("caseId"), 
      hearingId: intVal("hearingId"), 
      date: val("date"),
      nextDate: val("nextDate") || null,
      report: val("report") 
    },
    judgement: { 
      caseId: intVal("caseId"), 
      judgementId: intVal("judgementId"), 
      judgementDate: val("judgementDate"),
      verdict: val("verdict") 
    }
  };

  const body = bodies[type];
  // Remove null/undefined/empty values
  return Object.fromEntries(Object.entries(body).filter(([_, v]) => v != null && v !== ""));
}