
const STORAGE_KEY = 'task8_users';
let users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let deleteTargetIndex = -1;

// DOM ELEMENTS
const userForm = document.getElementById('userForm');
const editIndex = document.getElementById('editIndex');
const fullNameEl = document.getElementById('fullName');
const emailEl = document.getElementById('email');
const passwordEl = document.getElementById('password');
const deptEl = document.getElementById('department');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const pwdNote = document.getElementById('pwdNote');
const usersTableBody = document.getElementById('usersTableBody');
const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');


document.addEventListener('DOMContentLoaded', renderUsersTable);

// ===== SAVE TO LOCAL STORAGE =====
function saveUsers() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}


function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorSpan = formGroup.querySelector('.error-message');
    input.classList.remove('valid');
    input.classList.add('invalid');
    errorSpan.textContent = message;
}

function showSuccess(input) {
    const formGroup = input.closest('.form-group');
    const errorSpan = formGroup.querySelector('.error-message');
    input.classList.remove('invalid');
    input.classList.add('valid');
    errorSpan.textContent = '';
}

function validateFullName(input) {
    const val = input.value.trim();
    if (!val) { showError(input, 'Full Name is required.'); return false; }
    if (val.length < 3) { showError(input, 'Minimum 3 characters.'); return false; }
    showSuccess(input); return true;
}

function validateEmail(input) {
    const val = input.value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) { showError(input, 'Email is required.'); return false; }
    if (!re.test(val)) { showError(input, 'Format: name@domain.com'); return false; }
    showSuccess(input); return true;
}

function validatePassword(input, isEdit = false) {
    const val = input.value;
    if (!isEdit && !val) { showError(input, 'Password is required.'); return false; }
    if (val && val.length < 8) { showError(input, 'Minimum 8 characters.'); return false; }
    if (val) showSuccess(input);
    else { input.classList.remove('invalid','valid'); return true; }
    return true;
}

function validateDepartment(select) {
    if (!select.value) { showError(select, 'Select a department.'); return false; }
    showSuccess(select); return true;
}


function renderUsersTable() {
    usersTableBody.innerHTML = '';

    if (users.length === 0) {
        usersTableBody.innerHTML = `<tr><td colspan="5" class="empty-row">No records yet. Add a user below.</td></tr>`;
        return;
    }

    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td>${user.department}</td>
            <td>
                <button class="edit-btn" data-index="${index}">✏️ Edit</button>
                <button class="delete-btn" data-index="${index}">🗑️ Delete</button>
            </td>
        `;
        usersTableBody.appendChild(row);
    });

    // Attach Edit handlers
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => startEdit(parseInt(e.target.dataset.index)));
    });

    // Attach Delete handlers
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => showDeleteModal(parseInt(e.target.dataset.index)));
    });
}


function startEdit(index) {
    const user = users[index];
    
    // Switch form to EDIT mode
    editIndex.value = index;
    formTitle.textContent = 'Edit User';
    submitBtn.textContent = 'Update User';
    cancelBtn.style.display = 'block';
    pwdNote.textContent = ' (leave blank to keep current)';
    
    // Fill with existing data
    fullNameEl.value = user.fullName;
    emailEl.value = user.email;
    passwordEl.value = ''; // Don't show stored password
    deptEl.value = user.department;
    
    // Clear validation styling
    [fullNameEl, emailEl, passwordEl, deptEl].forEach(el => {
        el.classList.remove('valid', 'invalid');
    });
    
    // Scroll to form
    userForm.scrollIntoView({ behavior: 'smooth' });
}

// CANCEL EDIT
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
    editIndex.value = -1;
    formTitle.textContent = 'Add New User';
    submitBtn.textContent = 'Add User';
    cancelBtn.style.display = 'none';
    pwdNote.textContent = ' (min 8 chars)';
    userForm.reset();
    [fullNameEl, emailEl, passwordEl, deptEl].forEach(el => {
        el.classList.remove('valid', 'invalid');
    });
}


function showDeleteModal(index) {
    deleteTargetIndex = index;
    deleteModal.style.display = 'block';
}

cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.style.display = 'none';
    deleteTargetIndex = -1;
});

confirmDeleteBtn.addEventListener('click', () => {
    if (deleteTargetIndex > -1) {
        users.splice(deleteTargetIndex, 1);
        saveUsers();
        renderUsersTable();
        alert('✅ Record deleted successfully.');
    }
    deleteModal.style.display = 'none';
    deleteTargetIndex = -1;
});

userForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const isEditing = parseInt(editIndex.value) > -1;
    
    // Validate ALL fields
    const v1 = validateFullName(fullNameEl);
    const v2 = validateEmail(emailEl);
    const v3 = validatePassword(passwordEl, isEditing);
    const v4 = validateDepartment(deptEl);
    
    if (!v1 || !v2 || !v3 || !v4) return;

    const userData = {
        fullName: fullNameEl.value.trim(),
        email: emailEl.value.trim(),
        department: deptEl.value
    };

    if (isEditing) {
        // UPDATE existing record
        const idx = parseInt(editIndex.value);
        // Only update password if new one provided
        if (passwordEl.value.trim()) {
            userData.password = passwordEl.value;
        } else {
            userData.password = users[idx].password; // Keep old
        }
        users[idx] = userData;
        alert('✅ Record updated successfully!');
    } else {
        // ADD new record
        userData.password = passwordEl.value;
        users.push(userData);
        alert('✅ Record added successfully!');
    }

    saveUsers();
    renderUsersTable();
    resetForm();
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        deleteModal.style.display = 'none';
        deleteTargetIndex = -1;
    }
});
// =====================================================
// TASK 7: DATA STORAGE & RECORD MANAGEMENT
// =====================================================

// ===== STORAGE CONFIGURATION =====
const STORAGE_KEY = 'task7_inventory_records';

// Load existing records from Local Storage
let records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// ===== DOM ELEMENTS =====
const form = document.getElementById('recordForm');
const recordsBody = document.getElementById('recordsBody');
const recordCount = document.getElementById('recordCount');

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', renderTable);

// =====================================================
// VALIDATION (from Task 6 — Only valid data is saved)
// =====================================================
function showError(input, message) {
    const errorSpan = input.parentElement.querySelector('.error-message');
    input.classList.add('invalid');
    errorSpan.textContent = message;
}

function clearError(input) {
    const errorSpan = input.parentElement.querySelector('.error-message');
    input.classList.remove('invalid');
    errorSpan.textContent = '';
}

function validateField(input) {
    const value = input.value.trim();
    const name = input.id;

    // Required fields
    if (input.hasAttribute('required') && value === '') {
        showError(input, 'This field is required.');
        return false;
    }

    // Email format
    if (name === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            showError(input, 'Enter a valid email (e.g. name@example.com)');
            return false;
        }
    }

    // Phone — if entered, must be numbers only
    if (name === 'phone' && value) {
        const phonePattern = /^[\d\s\-+()]{7,}$/;
        if (!phonePattern.test(value)) {
            showError(input, 'Enter a valid phone number');
            return false;
        }
    }

    // Quantity — must be at least 1
    if (name === 'quantity' && value) {
        if (parseInt(value) < 1) {
            showError(input, 'Quantity must be at least 1');
            return false;
        }
    }

    // Price — must be positive
    if (name === 'price' && value) {
        if (parseFloat(value) <= 0) {
            showError(input, 'Price must be greater than 0');
            return false;
        }
    }

    clearError(input);
    return true;
}

// Real-time validation on typing
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) validateField(input);
    });
});

// =====================================================
// SAVE TO LOCAL STORAGE
// =====================================================
function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

// =====================================================
// RENDER TABLE — Dynamic Interface Update
// =====================================================
function renderTable() {
    // Clear existing content
    recordsBody.innerHTML = '';

    // Show empty message if no records
    if (records.length === 0) {
        recordsBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-row">No records yet. Submit the form above to add your first entry.</td>
            </tr>
        `;
        recordCount.textContent = 'Total Records: 0';
        return;
    }

    // Build and insert each record row
    records.forEach((record, index) => {
        const total = (record.quantity * record.price).toFixed(2);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${record.fullName}</td>
            <td>${record.email}</td>
            <td>${record.itemName}</td>
            <td>${record.quantity}</td>
            <td>₱${parseFloat(record.price).toFixed(2)}</td>
            <td><strong>₱${total}</strong></td>
        `;
        recordsBody.appendChild(row);
    });

    // Update count
    recordCount.textContent = `Total Records: ${records.length}`;
}

// =====================================================
// FORM SUBMISSION — Add New Record
// =====================================================
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get all input elements
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const itemNameInput = document.getElementById('itemName');
    const quantityInput = document.getElementById('quantity');
    const priceInput = document.getElementById('price');

    // Validate ALL fields
    const isNameValid = validateField(fullNameInput);
    const isEmailValid = validateField(emailInput);
    const isPhoneValid = validateField(phoneInput);
    const isItemValid = validateField(itemNameInput);
    const isQtyValid = validateField(quantityInput);
    const isPriceValid = validateField(priceInput);

    // Stop if any validation fails
    if (!isNameValid || !isEmailValid || !isPhoneValid || !isItemValid || !isQtyValid || !isPriceValid) {
        alert('⚠️ Please fix the errors before saving.');
        return;
    }

    // Create record object
    const newRecord = {
        fullName: fullNameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim() || 'Not provided',
        itemName: itemNameInput.value.trim(),
        quantity: parseInt(quantityInput.value),
        price: parseFloat(priceInput.value),
        createdAt: new Date().toLocaleString()
    };

    // Add to array
    records.push(newRecord);

    // Save to Local Storage
    saveToStorage();

    // Refresh table instantly
    renderTable();

    // Reset form
    form.reset();

    // Success message
    alert('✅ Record saved successfully!');
});
// =====================================================
// TASK 8: EDIT & DELETE — COMPLETE CRUD SYSTEM
// =====================================================

// ===== STORAGE CONFIGURATION =====
const STORAGE_KEY = 'task8_inventory_records';
let records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let deleteIndexTarget = -1; // Track which record to delete

// ===== DOM ELEMENTS =====
const form = document.getElementById('recordForm');
const editIndex = document.getElementById('editIndex');
const formHeading = document.getElementById('formHeading');
const formSubmitBtn = document.getElementById('formSubmitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const recordsBody = document.getElementById('recordsBody');
const recordCount = document.getElementById('recordCount');
const deleteModal = document.getElementById('deleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', renderTable);

// =====================================================
// VALIDATION RULES (from Task 6 — maintained on Edit)
// =====================================================
function showError(input, message) {
    const errorSpan = input.parentElement.querySelector('.error-message');
    input.classList.add('invalid');
    errorSpan.textContent = message;
}

function clearError(input) {
    const errorSpan = input.parentElement.querySelector('.error-message');
    input.classList.remove('invalid');
    errorSpan.textContent = '';
}

function validateField(input) {
    const value = input.value.trim();
    const name = input.id;

    if (input.hasAttribute('required') && value === '') {
        showError(input, 'This field is required.');
        return false;
    }

    if (name === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            showError(input, 'Enter a valid email (name@example.com)');
            return false;
        }
    }

    if (name === 'phone' && value) {
        const phonePattern = /^[\d\s\-+()]{7,}$/;
        if (!phonePattern.test(value)) {
            showError(input, 'Enter a valid phone number');
            return false;
        }
    }

    if (name === 'quantity' && value && parseInt(value) < 1) {
        showError(input, 'Quantity must be at least 1');
        return false;
    }

    if (name === 'price' && value && parseFloat(value) <= 0) {
        showError(input, 'Price must be greater than 0');
        return false;
    }

    clearError(input);
    return true;
}

// Real-time validation
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) validateField(input);
    });
});

// =====================================================
// SAVE TO LOCAL STORAGE
// =====================================================
function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

// =====================================================
// RENDER TABLE — Dynamic Updates
// =====================================================
function renderTable() {
    recordsBody.innerHTML = '';

    if (records.length === 0) {
        recordsBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-row">No records yet. Submit the form above to add your first entry.</td>
            </tr>
        `;
        recordCount.textContent = 'Total Records: 0';
        return;
    }

    records.forEach((record, index) => {
        const total = (record.quantity * record.price).toFixed(2);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${record.fullName}</td>
            <td>${record.email}</td>
            <td>${record.itemName}</td>
            <td>${record.quantity}</td>
            <td>₱${parseFloat(record.price).toFixed(2)}</td>
            <td><strong>₱${total}</strong></td>
            <td>
                <button class="edit-btn" data-index="${index}">✏️ Edit</button>
                <button class="delete-btn" data-index="${index}">🗑️ Delete</button>
            </td>
        `;
        recordsBody.appendChild(row);
    });

    recordCount.textContent = `Total Records: ${records.length}`;

    // Attach Edit handlers
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => startEdit(parseInt(e.target.dataset.index)));
    });

    // Attach Delete handlers
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => openDeleteModal(parseInt(e.target.dataset.index)));
    });
}

// =====================================================
// EDIT FUNCTION — Load Record into Form
// =====================================================
function startEdit(index) {
    const rec = records[index];

    // Switch form to EDIT MODE
    editIndex.value = index;
    formHeading.textContent = 'Edit Record';
    formSubmitBtn.textContent = 'Update Record';
    cancelEditBtn.style.display = 'block';

    // Fill form with current data
    document.getElementById('fullName').value = rec.fullName;
    document.getElementById('email').value = rec.email;
    document.getElementById('phone').value = rec.phone === 'Not provided' ? '' : rec.phone;
    document.getElementById('itemName').value = rec.itemName;
    document.getElementById('quantity').value = rec.quantity;
    document.getElementById('price').value = rec.price;

    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth' });
}

// CANCEL EDIT — Return to ADD mode
cancelEditBtn.addEventListener('click', resetFormMode);

function resetFormMode() {
    editIndex.value = -1;
    formHeading.textContent = 'Add New Record';
    formSubmitBtn.textContent = 'Save Record';
    cancelEditBtn.style.display = 'none';
    form.reset();
    
    // Clear validation styling
    document.querySelectorAll('input').forEach(input => {
        input.classList.remove('invalid');
        input.parentElement.querySelector('.error-message').textContent = '';
    });
}

// =====================================================
// DELETE FUNCTION — Confirmation & Removal
// =====================================================
function openDeleteModal(index) {
    deleteIndexTarget = index;
    deleteModal.style.display = 'block';
}

// Cancel Delete
cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.style.display = 'none';
    deleteIndexTarget = -1;
});

// Confirm Delete
confirmDeleteBtn.addEventListener('click', () => {
    if (deleteIndexTarget > -1) {
        // Remove from array
        records.splice(deleteIndexTarget, 1);
        // Save to storage
        saveToStorage();
        // Refresh table instantly
        renderTable();
        alert('✅ Record deleted successfully.');
    }
    deleteModal.style.display = 'none';
    deleteIndexTarget = -1;
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        deleteModal.style.display = 'none';
        deleteIndexTarget = -1;
    }
});

// =====================================================
// FORM SUBMIT — ADD NEW OR UPDATE EXISTING
// =====================================================
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const isUpdating = parseInt(editIndex.value) > -1;

    // Get all inputs
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const itemNameInput = document.getElementById('itemName');
    const quantityInput = document.getElementById('quantity');
    const priceInput = document.getElementById('price');

    // Validate ALL fields
    const v1 = validateField(fullNameInput);
    const v2 = validateField(emailInput);
    const v3 = validateField(phoneInput);
    const v4 = validateField(itemNameInput);
    const v5 = validateField(quantityInput);
    const v6 = validateField(priceInput);

    if (!v1 || !v2 || !v3 || !v4 || !v5 || !v6) {
        alert('⚠️ Please fix the errors before saving.');
        return;
    }

    // Build record object
    const recordData = {
        fullName: fullNameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim() || 'Not provided',
        itemName: itemNameInput.value.trim(),
        quantity: parseInt(quantityInput.value),
        price: parseFloat(priceInput.value),
        updatedAt: new Date().toLocaleString()
    };

    if (isUpdating) {
        // UPDATE existing record
        recordData.createdAt = records[parseInt(editIndex.value)].createdAt;
        records[parseInt(editIndex.value)] = recordData;
        alert('✅ Record updated successfully!');
    } else {
        // ADD new record
        recordData.createdAt = new Date().toLocaleString();
        records.push(recordData);
        alert('✅ Record added successfully!');
    }

    // Save & Refresh
    saveToStorage();
    renderTable();
    resetFormMode();
});

function deleteRecord(index) {
  if (confirm("Are you sure you want to delete this record?")) {
    records.splice(index, 1);
    localStorage.setItem("records", JSON.stringify(records));
    renderTable();
  }
}
function renderTable() {
  const tableBody = document.getElementById("recordsTableBody");
  tableBody.innerHTML = "";
  records.forEach((record, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${record.name}</td>
      <td>${record.quantity}</td>
      <td>${record.price}</td>
      <td>
        <button class="edit-btn" onclick="editRecord(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteRecord(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}
// =====================================================
// UPGRADED TASK 8 — Enhanced Design & Complete CRUD
// =====================================================

const STORAGE_KEY = 'task8_inventory_records';
let records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let deleteTargetIndex = -1;

// DOM Elements
const form = document.getElementById('recordForm');
const editIndex = document.getElementById('editIndex');
const formTitle = document.getElementById('formTitle');
const formIcon = document.getElementById('formIcon');
const submitBtn = document.getElementById('submitBtn');
const btnIcon = document.getElementById('btnIcon');
const cancelBtn = document.getElementById('cancelBtn');
const recordsBody = document.getElementById('recordsBody');
const recordCount = document.getElementById('recordCount');
const deleteModal = document.getElementById('deleteModal');
const cancelDelete = document.getElementById('cancelDelete');
const confirmDelete = document.getElementById('confirmDelete');

// Initialize
document.addEventListener('DOMContentLoaded', renderTable);

// =====================================================
// VALIDATION
// =====================================================
function showError(input, message) {
    const errorSpan = input.parentElement.parentElement.querySelector('.error-message');
    input.classList.add('invalid');
    errorSpan.textContent = message;
}

function clearError(input) {
    const errorSpan = input.parentElement.parentElement.querySelector('.error-message');
    input.classList.remove('invalid');
    errorSpan.textContent = '';
}

function validateField(input) {
    const value = input.value.trim();
    const name = input.id;

    if (input.hasAttribute('required') && value === '') {
        showError(input, 'This field is required.');
        return false;
    }

    if (name === 'fullName' && value && value.length < 3) {
        showError(input, 'Minimum 3 characters required.');
        return false;
    }

    if (name === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            showError(input, 'Format: name@example.com');
            return false;
        }
    }

    if (name === 'phone' && value) {
        const phonePattern = /^[\d\s\-+()]{7,}$/;
        if (!phonePattern.test(value)) {
            showError(input, 'Enter a valid phone number');
            return false;
        }
    }

    if (name === 'quantity' && value && parseInt(value) < 1) {
        showError(input, 'Must be at least 1');
        return false;
    }

    if (name === 'price' && value && parseFloat(value) <= 0) {
        showError(input, 'Must be greater than 0');
        return false;
    }

    clearError(input);
    return true;
}

// Real-time validation
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) validateField(input);
    });
});

// =====================================================
// STORAGE
// =====================================================
function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

// =====================================================
// RENDER TABLE
// =====================================================
function renderTable() {
    recordsBody.innerHTML = '';

    if (records.length === 0) {
        recordsBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="9">📭 No records yet. Add your first record using the form above!</td>
            </tr>
        `;
        recordCount.textContent = '0';
        return;
    }

    records.forEach((record, index) => {
        const total = (record.quantity * record.price).toFixed(2);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${index + 1}</strong></td>
            <td>${record.fullName}</td>
            <td>${record.email}</td>
            <td>${record.phone}</td>
            <td>${record.itemName}</td>
            <td>${record.quantity}</td>
            <td>₱${parseFloat(record.price).toFixed(2)}</td>
            <td><strong class="total-amount">₱${total}</strong></td>
            <td class="action-col">
                <button class="edit-btn" data-index="${index}">✏️ Edit</button>
                <button class="delete-btn" data-index="${index}">🗑️ Delete</button>
            </td>
        `;
        recordsBody.appendChild(row);
    });

    recordCount.textContent = records.length;

    // Attach handlers
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => startEdit(parseInt(e.target.dataset.index)));
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => openDeleteModal(parseInt(e.target.dataset.index)));
    });
}

// =====================================================
// EDIT FUNCTION
// =====================================================
function startEdit(index) {
    const rec = records[index];

    // Switch to Edit Mode
    editIndex.value = index;
    formTitle.innerHTML = '<span id="formIcon">✏️</span> Edit Record';
    submitBtn.innerHTML = '<span id="btnIcon">🔄</span> Update Record';
    cancelBtn.style.display = 'flex';

    // Fill form
    document.getElementById('fullName').value = rec.fullName;
    document.getElementById('email').value = rec.email;
    document.getElementById('phone').value = rec.phone === 'Not provided' ? '' : rec.phone;
    document.getElementById('itemName').value = rec.itemName;
    document.getElementById('quantity').value = rec.quantity;
    document.getElementById('price').value = rec.price;

    // Clear errors
    document.querySelectorAll('input').forEach(input => {
        input.classList.remove('invalid');
        input.parentElement.parentElement.querySelector('.error-message').textContent = '';
    });

    form.scrollIntoView({ behavior: 'smooth' });
}

// Cancel Edit
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
    editIndex.value = -1;
    formTitle.innerHTML = '<span id="formIcon">➕</span> Add New Record';
    submitBtn.innerHTML = '<span id="btnIcon">💾</span> Save Record';
    cancelBtn.style.display = 'none';
    form.reset();
    document.querySelectorAll('input').forEach(input => {
        input.classList.remove('invalid');
        input.parentElement.parentElement.querySelector('.error-message').textContent = '';
    });
}

// =====================================================
// DELETE FUNCTION
// =====================================================
function openDeleteModal(index) {
    deleteTargetIndex = index;
    deleteModal.style.display = 'flex';
}

cancelDelete.addEventListener('click', () => {
    deleteModal.style.display = 'none';
    deleteTargetIndex = -1;
});

confirmDelete.addEventListener('click', () => {
    if (deleteTargetIndex > -1) {
        records.splice(deleteTargetIndex, 1);
        saveToStorage();
        renderTable();
        showToast('✅ Record deleted successfully!');
    }
    deleteModal.style.display = 'none';
    deleteTargetIndex = -1;
});

window.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        deleteModal.style.display = 'none';
        deleteTargetIndex = -1;
    }
});

// =====================================================
// TOAST NOTIFICATION
// =====================================================
function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: #1e293b; color: white;
        padding: 15px 25px; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 2000; font-weight: 600; animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Add toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
    .total-amount { color: var(--primary); font-weight: 700; }
`;
document.head.appendChild(style);

// =====================================================
// FORM SUBMIT — ADD OR UPDATE
// =====================================================
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const isUpdating = parseInt(editIndex.value) > -1;

    const inputs = {
        fullName: document.getElementById('fullName'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        itemName: document.getElementById('itemName'),
        quantity: document.getElementById('quantity'),
        price: document.getElementById('price')
    };

    const valid = Object.values(inputs).every(validateField);
    if (!valid) {
        showToast('⚠️ Please fix errors before saving!');
        return;
    }

    const recordData = {
        fullName: inputs.fullName.value.trim(),
        email: inputs.email.value.trim(),
        phone: inputs.phone.value.trim() || 'Not provided',
        itemName: inputs.itemName.value.trim(),
        quantity: parseInt(inputs.quantity.value),
        price: parseFloat(inputs.price.value),
        createdAt: isUpdating ? records[parseInt(editIndex.value)].createdAt : new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
    };

    if (isUpdating) {
        records[parseInt(editIndex.value)] = recordData;
        showToast('✅ Record updated successfully!');
    } else {
        records.push(recordData);
        showToast('✅ Record added successfully!');
    }

    saveToStorage();
    renderTable();
    resetForm();
});
// ==========================================
// STUDENT EXAM ELIGIBILITY SYSTEM
// TASK 8 - CRUD OPERATIONS
// ==========================================

// Local Storage Key
const STORAGE_KEY = "studentRecords";

// Eligibility requirements
const REQUIRED_ATTENDANCE = 75;
const REQUIRED_GRADE = 75;

// ==========================================
// GET HTML ELEMENTS
// ==========================================

const studentForm = document.getElementById("studentForm");

const studentIdInput = document.getElementById("studentId");
const studentNameInput = document.getElementById("studentName");
const courseInput = document.getElementById("course");
const yearLevelInput = document.getElementById("yearLevel");
const attendanceInput = document.getElementById("attendance");
const gradeInput = document.getElementById("grade");

const tableBody = document.getElementById("studentTableBody");
const emptyMessage = document.getElementById("emptyMessage");

const searchInput = document.getElementById("searchInput");

const totalStudents = document.getElementById("totalStudents");
const eligibleStudents = document.getElementById("eligibleStudents");
const notEligibleStudents = document.getElementById("notEligibleStudents");

// Edit modal
const editModal = document.getElementById("editModal");
const editStudentForm = document.getElementById("editStudentForm");

const editRecordId = document.getElementById("editRecordId");
const editStudentId = document.getElementById("editStudentId");
const editStudentName = document.getElementById("editStudentName");
const editCourse = document.getElementById("editCourse");
const editYearLevel = document.getElementById("editYearLevel");
const editAttendance = document.getElementById("editAttendance");
const editGrade = document.getElementById("editGrade");

const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");


// ==========================================
// LOAD RECORDS FROM LOCAL STORAGE
// ==========================================

let students = loadStudents();


// ==========================================
// INITIAL DISPLAY
// ==========================================

renderStudents();
updateDashboard();


// ==========================================
// LOAD DATA
// ==========================================

function loadStudents() {

    const storedData = localStorage.getItem(STORAGE_KEY);

    if (!storedData) {
        return [];
    }

    try {
        return JSON.parse(storedData);
    } catch (error) {
        console.error("Error loading records:", error);
        return [];
    }
}
/* ==========================================
   SALES AND INVENTORY MANAGEMENT SYSTEM
   TASK 8 - CRUD OPERATIONS
========================================== */


/* ==========================================
   GET HTML ELEMENTS
========================================== */

const productForm = document.getElementById("productForm");

const productId = document.getElementById("productId");

const productName = document.getElementById("productName");

const category = document.getElementById("category");

const price = document.getElementById("price");

const stock = document.getElementById("stock");

const productTableBody =
    document.getElementById("productTableBody");

const searchInput =
    document.getElementById("searchInput");

const submitButton =
    document.getElementById("submitButton");

const cancelButton =
    document.getElementById("cancelButton");

const formTitle =
    document.getElementById("formTitle");

const noRecords =
    document.getElementById("noRecords");

const totalProducts =
    document.getElementById("totalProducts");

const totalStock =
    document.getElementById("totalStock");

const totalValue =
    document.getElementById("totalValue");


/* ==========================================
   LOCAL STORAGE KEY
========================================== */

const STORAGE_KEY = "salesInventoryProducts";


/* ==========================================
   GET PRODUCTS FROM LOCAL STORAGE
========================================== */

let products = JSON.parse(
    localStorage.getItem(STORAGE_KEY)
) || [];


/* ==========================================
   SAVE PRODUCTS TO LOCAL STORAGE
========================================== */

function saveProducts() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(products)
    );

}


/* ==========================================
   GENERATE UNIQUE ID
========================================== */

function generateId() {

    return Date.now().toString();

}


/* ==========================================
   FORM SUBMIT
========================================== */

productForm.addEventListener("submit", function(event) {

    event.preventDefault();


    /* GET FORM VALUES */

    const nameValue =
        productName.value.trim();

    const categoryValue =
        category.value;

    const priceValue =
        parseFloat(price.value);

    const stockValue =
        parseInt(stock.value);


    /* ======================================
       VALIDATION
    ====================================== */

    if (nameValue === "") {

        alert("Please enter the product name.");

        productName.focus();

        return;
    }


    if (categoryValue === "") {

        alert("Please select a category.");

        category.focus();

        return;
    }


    if (isNaN(priceValue) || priceValue <= 0) {

        alert("Please enter a valid price greater than 0.");

        price.focus();

        return;
    }


    if (
        isNaN(stockValue) ||
        stockValue < 0 ||
        !Number.isInteger(stockValue)
    ) {

        alert(
            "Please enter a valid whole number for stock."
        );

        stock.focus();

        return;
    }


    /* ======================================
       CHECK IF EDITING
    ====================================== */

    if (productId.value !== "") {

        updateProduct(
            productId.value,
            nameValue,
            categoryValue,
            priceValue,
            stockValue
        );

    }

    else {

        addProduct(
            nameValue,
            categoryValue,
            priceValue,
            stockValue
        );

    }

});


/* ==========================================
   ADD PRODUCT
========================================== */

function addProduct(
    name,
    categoryName,
    productPrice,
    productStock
) {

    const newProduct = {

        id: generateId(),

        name: name,

        category: categoryName,

        price: productPrice,

        stock: productStock

    };


    products.push(newProduct);


    saveProducts();


    renderProducts();


    updateDashboard();


    productForm.reset();


    alert("Product successfully added!");

}


/* ==========================================
   DISPLAY PRODUCTS
========================================== */

function renderProducts(searchTerm = "") {

    productTableBody.innerHTML = "";


    const filteredProducts =
        products.filter(function(product) {

            const name =
                product.name.toLowerCase();

            const categoryName =
                product.category.toLowerCase();

            const search =
                searchTerm.toLowerCase();

            return (
                name.includes(search) ||
                categoryName.includes(search)
            );

        });


    /* ======================================
       NO RECORDS
    ====================================== */

    if (filteredProducts.length === 0) {

        noRecords.style.display = "block";

        return;

    }

    else {

        noRecords.style.display = "none";

    }


    /* ======================================
       CREATE TABLE ROWS
    ====================================== */

    filteredProducts.forEach(function(product, index) {

        const row =
            document.createElement("tr");


        const inventoryValue =
            product.price * product.stock;


        row.innerHTML = `

            <td>${index + 1}</td>

            <td>${escapeHTML(product.name)}</td>

            <td>${escapeHTML(product.category)}</td>

            <td>₱${product.price.toFixed(2)}</td>

            <td>${product.stock}</td>

            <td>₱${inventoryValue.toFixed(2)}</td>

            <td>

                <button
                    class="btn btn-edit"
                    onclick="editProduct('${product.id}')"
                >
                    Edit
                </button>

                <button
                    class="btn btn-delete"
                    onclick="deleteProduct('${product.id}')"
                >
                    Delete
                </button>

            </td>

        `;


        productTableBody.appendChild(row);

    });

}


/* ==========================================
   EDIT PRODUCT
========================================== */

function editProduct(id) {

    const product =
        products.find(function(item) {

            return item.id === id;

        });


    if (!product) {

        alert("Product record not found.");

        return;

    }


    /* ======================================
       POPULATE FORM
    ====================================== */

    productId.value =
        product.id;

    productName.value =
        product.name;

    category.value =
        product.category;

    price.value =
        product.price;

    stock.value =
        product.stock;


    /* ======================================
       CHANGE FORM TO EDIT MODE
    ====================================== */

    formTitle.textContent =
        "Edit Product";

    submitButton.textContent =
        "Update Product";

    cancelButton.style.display =
        "inline-block";


    /* ======================================
       SCROLL TO FORM
    ====================================== */

    document
        .querySelector(".form-section")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* ==========================================
   UPDATE PRODUCT
========================================== */

function updateProduct(
    id,
    name,
    categoryName,
    productPrice,
    productStock
) {

    const productIndex =
        products.findIndex(function(product) {

            return product.id === id;

        });


    if (productIndex === -1) {

        alert("Product record not found.");

        return;

    }


    /* ======================================
       REPLACE OLD DATA
    ====================================== */

    products[productIndex] = {

        id: id,

        name: name,

        category: categoryName,

        price: productPrice,

        stock: productStock

    };


    /* ======================================
       SAVE UPDATED DATA
    ====================================== */

    saveProducts();


    /* ======================================
       REFRESH TABLE
    ====================================== */

    renderProducts();


    updateDashboard();


    /* ======================================
       RESET FORM
    ====================================== */

    cancelEdit();


    alert("Product successfully updated!");

}


/* ==========================================
   CANCEL EDIT
========================================== */

function cancelEdit() {

    productId.value = "";

    productForm.reset();


    formTitle.textContent =
        "Add New Product";

    submitButton.textContent =
        "Add Product";

    cancelButton.style.display =
        "none";

}


/* ==========================================
   DELETE PRODUCT
========================================== */

function deleteProduct(id) {

    const product =
        products.find(function(product) {

            return product.id === id;

        });


    if (!product) {

        alert("Product record not found.");

        return;

    }


    /* ======================================
       CONFIRMATION
    ====================================== */

    const confirmation = confirm(

        `Are you sure you want to delete "${product.name}"?\n\n` +
        `This action cannot be undone.`

    );


    if (!confirmation) {

        return;

    }


    /* ======================================
       REMOVE PRODUCT
    ====================================== */

    products =
        products.filter(function(item) {

            return item.id !== id;

        });


    /* ======================================
       UPDATE LOCAL STORAGE
    ====================================== */

    saveProducts();


    /* ======================================
       UPDATE TABLE
    ====================================== */

    renderProducts();


    updateDashboard();


    alert("Product successfully deleted!");

}


/* ==========================================
   CLEAR ALL PRODUCTS
========================================== */

function clearAllProducts() {

    if (products.length === 0) {

        alert("There are no records to delete.");

        return;

    }


    const confirmation = confirm(

        "Are you sure you want to delete ALL product records?\n\n" +
        "This action cannot be undone."

    );


    if (!confirmation) {

        return;

    }


    products = [];


    saveProducts();


    renderProducts();


    updateDashboard();


    cancelEdit();


    alert("All product records have been deleted.");

}


/* ==========================================
   SEARCH FUNCTION
========================================== */

searchInput.addEventListener(
    "input",
    function() {

        renderProducts(
            searchInput.value
        );

    }
);


/* ==========================================
   UPDATE DASHBOARD
========================================== */

function updateDashboard() {

    let stockTotal = 0;

    let inventoryTotal = 0;


    products.forEach(function(product) {

        stockTotal += product.stock;

        inventoryTotal +=
            product.price * product.stock;

    });


    totalProducts.textContent =
        products.length;


    totalStock.textContent =
        stockTotal;


    totalValue.textContent =
        "₱" +
        inventoryTotal.toFixed(2);

}


/* ==========================================
   ESCAPE HTML
   Prevents unsafe HTML from being inserted
========================================== */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* ==========================================
   INITIAL DISPLAY
========================================== */

renderProducts();

updateDashboard();