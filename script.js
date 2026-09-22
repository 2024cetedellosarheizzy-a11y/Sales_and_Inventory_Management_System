
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