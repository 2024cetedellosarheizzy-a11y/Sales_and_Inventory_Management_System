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