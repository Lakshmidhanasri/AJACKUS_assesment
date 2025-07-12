let filteredEmployees = [...mockEmployees];
let itemsPerPage = 10;
let currentPage = 1;

// DOM Elements
const employeeList = document.getElementById('employeeList');
const formModal = document.getElementById('employeeFormModal');
const form = document.getElementById('employeeForm');
const formTitle = document.getElementById('formTitle');

// Display Employees
function renderEmployees() {
  employeeList.innerHTML = '';
  let start = (currentPage - 1) * itemsPerPage;
  let end = start + itemsPerPage;
  let pageData = filteredEmployees.slice(start, end);

  pageData.forEach(emp => {
    const card = document.createElement('div');
    card.className = 'employee-card';
    card.innerHTML = `
      <p><strong>${emp.firstName} ${emp.lastName}</strong></p>
      <p>${emp.email}</p>
      <p>${emp.department}</p>
      <p>${emp.role}</p>
      <button onclick="editEmployee('${emp.id}')">Edit</button>
      <button onclick="deleteEmployee('${emp.id}')">Delete</button>
    `;
    employeeList.appendChild(card);
  });

  renderPagination();
}

// Pagination Controls
function renderPagination() {
  const controls = document.getElementById('paginationControls');
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  controls.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    let btn = document.createElement('button');
    btn.innerText = i;
    btn.disabled = i === currentPage;
    btn.onclick = () => {
      currentPage = i;
      renderEmployees();
    };
    controls.appendChild(btn);
  }
}

// Form Logic
function openForm() {
  form.reset();
  formTitle.textContent = 'Add Employee';
  document.getElementById('empId').value = '';
  formModal.classList.remove('hidden');
}

function closeForm() {
  formModal.classList.add('hidden');
}

form.onsubmit = function (e) {
  e.preventDefault();
  const id = document.getElementById('empId').value;
  const newEmp = {
    id: id || Date.now().toString(),
    firstName: form.firstName.value.trim(),
    lastName: form.lastName.value.trim(),
    email: form.email.value.trim(),
    department: form.department.value.trim(),
    role: form.role.value.trim()
  };

  if (!validateForm(newEmp)) return;

  if (id) {
    const index = mockEmployees.findIndex(e => e.id === id);
    mockEmployees[index] = newEmp;
  } else {
    mockEmployees.push(newEmp);
  }

  applyFilters(); // refresh based on filters
  closeForm();
};

function editEmployee(id) {
  const emp = mockEmployees.find(e => e.id === id);
  if (!emp) return;
  document.getElementById('empId').value = emp.id;
  form.firstName.value = emp.firstName;
  form.lastName.value = emp.lastName;
  form.email.value = emp.email;
  form.department.value = emp.department;
  form.role.value = emp.role;
  formTitle.textContent = 'Edit Employee';
  formModal.classList.remove('hidden');
}

function deleteEmployee(id) {
  if (confirm('Are you sure you want to delete this employee?')) {
    mockEmployees = mockEmployees.filter(e => e.id !== id);
    applyFilters();
  }
}

// Search / Filter / Sort
document.getElementById('searchBar').addEventListener('input', applyFilters);
document.getElementById('sortSelect').addEventListener('change', applyFilters);

function applyFilters() {
  const searchTerm = document.getElementById('searchBar').value.toLowerCase();
  const filterFirst = document.getElementById('filterFirstName').value.toLowerCase();
  const filterDept = document.getElementById('filterDepartment').value.toLowerCase();
  const filterRole = document.getElementById('filterRole').value.toLowerCase();
  const sortValue = document.getElementById('sortSelect').value;

  filteredEmployees = mockEmployees.filter(emp => {
    return (
      (emp.firstName + emp.lastName + emp.email).toLowerCase().includes(searchTerm) &&
      emp.firstName.toLowerCase().includes(filterFirst) &&
      emp.department.toLowerCase().includes(filterDept) &&
      emp.role.toLowerCase().includes(filterRole)
    );
  });

  if (sortValue === 'firstName') {
    filteredEmployees.sort((a, b) => a.firstName.localeCompare(b.firstName));
  } else if (sortValue === 'department') {
    filteredEmployees.sort((a, b) => a.department.localeCompare(b.department));
  }

  currentPage = 1;
  renderEmployees();
}

// Form Validation
function validateForm(emp) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emp.firstName || !emp.lastName || !emp.email || !emp.department || !emp.role) {
    alert('All fields are required.');
    return false;
  }
  if (!emailRegex.test(emp.email)) {
    alert('Invalid email format.');
    return false;
  }
  return true;
}

// Initial Load
applyFilters();
