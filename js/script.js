document.addEventListener("DOMContentLoaded", function () {

    const getStartedButton =
        document.getElementById("getStartedBtn");

    getStartedButton.addEventListener("click", function () {

        alert(
            "Welcome to the Sales and Inventory Management System!"
        );

    });

});
// Product Form
const productForm = document.getElementById("productForm");
const productTable = document.querySelector("#productTable tbody");

let productID = 1;

productForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const productName =
        document.getElementById("productName").value;

    const category =
        document.getElementById("category").value;

    const price =
        document.getElementById("price").value;

    const quantity =
        document.getElementById("quantity").value;

    const description =
        document.getElementById("description").value;

    // Create a new table row
    const row = productTable.insertRow();

    row.insertCell(0).textContent = productID;
    row.insertCell(1).textContent = productName;
    row.insertCell(2).textContent = category;
    row.insertCell(3).textContent = "₱" + price;
    row.insertCell(4).textContent = quantity;
    row.insertCell(5).textContent = description;

    // Add product to sales dropdown
    const saleProduct =
        document.getElementById("saleProduct");

    const option =
        document.createElement("option");

    option.value = productName;
    option.textContent = productName;

    saleProduct.appendChild(option);

    alert("Product added successfully!");

    productForm.reset();

    productID++;
});
// Sale Form
const saleForm = document.getElementById("saleForm");
const salesTable = document.querySelector("#salesTable tbody");

let saleID = 1;

saleForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const customerName =
        document.getElementById("customerName").value;

    const product =
        document.getElementById("saleProduct").value;

    const quantity =
        document.getElementById("saleQuantity").value;

    const paymentMethod =
        document.getElementById("paymentMethod").value;

    const notes =
        document.getElementById("saleNotes").value;

    // Create a new table row
    const row = salesTable.insertRow();

    row.insertCell(0).textContent = saleID;
    row.insertCell(1).textContent = customerName;
    row.insertCell(2).textContent = product;
    row.insertCell(3).textContent = quantity;
    row.insertCell(4).textContent = paymentMethod;
    row.insertCell(5).textContent = notes;

    alert("Sale recorded successfully!");

    saleForm.reset();

    saleID++;
});
document.getElementById("userForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const department = document.getElementById("department").value;
  const role = document.getElementById("role").value;

  document.getElementById("userMessage").textContent =
    "User information submitted successfully.";

  this.reset();
});
const permissions =
  [...document.querySelectorAll('input[name="permission"]:checked')]
  .map(box => box.value);

if (permissions.length === 0) {
  document.getElementById("privilegeMessage").textContent =
    "Please select at least one permission level.";
  return;
}

// ===== HELPER: Show Error Message =====
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorSpan = formGroup.querySelector('.error-message');
    input.classList.remove('valid');
    input.classList.add('invalid');
    errorSpan.textContent = message;
}

// ===== HELPER: Show Success =====
function showSuccess(input) {
    const formGroup = input.closest('.form-group');
    const errorSpan = formGroup.querySelector('.error-message');
    input.classList.remove('invalid');
    input.classList.add('valid');
    errorSpan.textContent = '';
}

// ===== VALIDATE FULL NAME =====
function validateFullName(input) {
    const value = input.value.trim();
    if (value === '') {
        showError(input, 'Full Name is required. Please enter your full name.');
        return false;
    }
    if (value.length < 3) {
        showError(input, 'Full Name must be at least 3 characters.');
        return false;
    }
    showSuccess(input);
    return true;
}

// ===== VALIDATE EMAIL =====
function validateEmail(input) {
    const value = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value === '') {
        showError(input, 'Email is required. Please enter your email address.');
        return false;
    }
    if (!emailRegex.test(value)) {
        showError(input, 'Invalid email format. Example: name@domain.com');
        return false;
    }
    showSuccess(input);
    return true;
}

// ===== VALIDATE PASSWORD =====
function validatePassword(input) {
    const value = input.value;
    if (value === '') {
        showError(input, 'Password is required. Please enter a password.');
        return false;
    }
    if (value.length < 8) {
        showError(input, 'Password must be at least 8 characters long.');
        return false;
    }
    showSuccess(input);
    return true;
}

// ===== VALIDATE DEPARTMENT =====
function validateDepartment(select) {
    const value = select.value;
    if (value === '') {
        showError(select, 'Please select a department from the list.');
        return false;
    }
    showSuccess(select);
    return true;
}

// ===== VALIDATE USER ID =====
function validateUserID(input) {
    const value = input.value.trim();
    const idRegex = /^[A-Z0-9]+$/;
    if (value === '') {
        showError(input, 'User ID is required. Please enter a User ID.');
        return false;
    }
    if (!idRegex.test(value)) {
        showError(input, 'User ID must contain only uppercase letters and numbers.');
        return false;
    }
    showSuccess(input);
    return true;
}

// ===== VALIDATE EXPIRATION DATE =====
function validateExpDate(input) {
    const selectedDate = new Date(input.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (input.value === '') {
        showError(input, 'Expiration Date is required. Please select a date.');
        return false;
    }
    if (selectedDate < today) {
        showError(input, 'Expiration Date cannot be a previous date. Please select today or later.');
        return false;
    }
    showSuccess(input);
    return true;
}

// ===== VALIDATE PERMISSION CHECKBOXES =====
function validateCheckboxes(containerName) {
    const checkboxes = document.querySelectorAll(`input[name="${containerName}"]`);
    const formGroup = checkboxes[0].closest('.form-group');
    const errorSpan = formGroup.querySelector('.error-message');
    let checkedCount = 0;

    checkboxes.forEach(cb => {
        if (cb.checked) checkedCount++;
    });

    if (checkedCount === 0) {
        errorSpan.textContent = 'Please select at least one permission level.';
        formGroup.classList.add('invalid');
        return false;
    } else {
        errorSpan.textContent = '';
        formGroup.classList.remove('invalid');
        return true;
    }
}

// ===== VALIDATE USERNAME =====
function validateUsername(input) {
    const value = input.value.trim();
    if (value === '') {
        showError(input, 'Username/Email is required. Please enter your username.');
        return false;
    }
    showSuccess(input);
    return true;
}

// ===== VALIDATE MFA CODE =====
function validateMFACode(input) {
    const value = input.value.trim();
    const mfaRegex = /^[0-9]{6}$/;
    if (value === '') {
        showError(input, 'MFA Code is required. Please enter the 6-digit code.');
        return false;
    }
    if (!mfaRegex.test(value)) {
        showError(input, 'MFA Code must be exactly 6 digits (numbers only).');
        return false;
    }
    showSuccess(input);
    return true;
}

// ===== SET MIN DATE FOR EXPIRATION DATE (today onwards) =====
const todayStr = new Date().toISOString().split('T')[0];
document.getElementById('expDate').setAttribute('min', todayStr);

// ===== REAL-TIME VALIDATION ON INPUT =====
document.getElementById('fullName').addEventListener('blur', e => validateFullName(e.target));
document.getElementById('email').addEventListener('blur', e => validateEmail(e.target));
document.getElementById('password').addEventListener('blur', e => validatePassword(e.target));
document.getElementById('department').addEventListener('change', e => validateDepartment(e.target));
document.getElementById('userID').addEventListener('blur', e => validateUserID(e.target));
document.getElementById('expDate').addEventListener('change', e => validateExpDate(e.target));
document.getElementById('username').addEventListener('blur', e => validateUsername(e.target));
document.getElementById('mfaCode').addEventListener('blur', e => validateMFACode(e.target));

// ===== FORM SUBMIT HANDLERS =====

// Add New User Form
document.getElementById('addUserForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const f1 = validateFullName(document.getElementById('fullName'));
    const f2 = validateEmail(document.getElementById('email'));
    const f3 = validatePassword(document.getElementById('password'));
    const f4 = validateDepartment(document.getElementById('department'));

    if (f1 && f2 && f3 && f4) {
        alert('✅ User added successfully! All fields are valid.');
        this.reset();
        document.querySelectorAll('#addUserForm input, #addUserForm select').forEach(el => {
            el.classList.remove('valid', 'invalid');
        });
    }
});

// Assign Privileges Form
document.getElementById('privilegesForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const f1 = validateUserID(document.getElementById('userID'));
    const f2 = validateExpDate(document.getElementById('expDate'));
    const f3 = validateCheckboxes('permissions');

    if (f1 && f2 && f3) {
        alert('✅ Privileges assigned successfully!');
        this.reset();
        document.querySelectorAll('#privilegesForm input, #privilegesForm select').forEach(el => {
            el.classList.remove('valid', 'invalid');
        });
    }
});

// Login Form
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const f1 = validateUsername(document.getElementById('username'));
    const f2 = validatePassword(document.getElementById('loginPassword'));
    const f3 = validateMFACode(document.getElementById('mfaCode'));

    if (f1 && f2 && f3) {
        alert('✅ Login successful! All validations passed.');
        this.reset();
        document.querySelectorAll('#loginForm input').forEach(el => {
            el.classList.remove('valid', 'invalid');
        });
    }
});
