
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