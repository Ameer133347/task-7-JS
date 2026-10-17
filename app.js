
const orderForm = document.getElementById("orderForm");
const ordersList = document.getElementById("ordersList");

const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const productInput = document.getElementById("product");
const quantityInput = document.getElementById("quantity");

const prices = {
    Espresso: 45,
    Latte: 65,
    Croissant: 40
};

// Display an error message under a field
function showError(field, message) {
    document.getElementById(field + "Error").textContent = message;
}

// Clear all error messages
function clearErrors() {
    ["name", "phone", "product", "quantity"].forEach(function (field) {
        showError(field, "");
    });
}

// Validate all form fields
function validateForm() {
    clearErrors();

    let isValid = true;

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const product = productInput.value;
    const quantity = quantityInput.value.trim();

    // Name validation
    if (name.length < 3) {
        showError("name", "Name must be at least 3 characters.");
        isValid = false;
    }

    // Phone validation: 11 digits, starting with 01
    const phoneRegex = /^01[0-9]{9}$/;

    if (!phoneRegex.test(phone)) {
        showError(
            "phone",
            "Phone must contain 11 digits and start with 01."
        );
        isValid = false;
    }

    // Product validation
    if (!Object.prototype.hasOwnProperty.call(prices, product)) {
        showError("product", "Please choose a product.");
        isValid = false;
    }

    // Quantity validation
    const quantityNumber = Number(quantity);

    if (
        quantity === "" ||
        !Number.isInteger(quantityNumber) ||
        quantityNumber < 1 ||
        quantityNumber > 10
    ) {
        showError("quantity", "Quantity must be an integer from 1 to 10.");
        isValid = false;
    }

    return isValid;
}

// Add a line of text to an order card
function addLine(card, label, value, className = "") {
    const paragraph = document.createElement("p");

    if (className) {
        paragraph.className = className;
    }

    paragraph.textContent = label + ": " + value;
    card.appendChild(paragraph);
}

// Create and display an order
function showOrder(name, phone, product, quantity) {
    const price = prices[product];

    // Business rule 1: Total = price * quantity
    const subtotal = price * quantity;

    // Business rule 2: 10% discount for quantity >= 3
    const discount = quantity >= 3 ? subtotal * 0.10 : 0;

    const total = subtotal - discount;

    // Business rule 3: Free delivery if total > 200 EGP
    const freeDelivery = total > 200;

    // Remove the empty message when the first order is added
    const emptyMessage = ordersList.querySelector(".empty-message");

    if (emptyMessage) {
        emptyMessage.remove();
    }

    // Create a new card for every order
    const card = document.createElement("div");
    card.className = "order-card";

    const heading = document.createElement("h3");
    heading.textContent = "Order Details";
    card.appendChild(heading);

    addLine(card, "Name", name);
    addLine(card, "Phone", phone);
    addLine(card, "Product", product);
    addLine(card, "Quantity", quantity);
    addLine(card, "Price per item", price + " EGP");
    addLine(card, "Subtotal", subtotal.toFixed(2) + " EGP");

    if (discount > 0) {
        addLine(
            card,
            "Discount (10%)",
            "-" + discount.toFixed(2) + " EGP",
            "discount"
        );
    } else {
        addLine(card, "Discount", "0.00 EGP");
    }

    addLine(card, "Total", total.toFixed(2) + " EGP");

    addLine(
        card,
        "Delivery",
        freeDelivery ? "Free Delivery" : "Free delivery for totals above 200 EGP",
        freeDelivery ? "delivery" : ""
    );

    // Bonus: append instead of replacing previous orders
    ordersList.appendChild(card);
}

// Handle form submission
orderForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Do not display the order if any field is invalid
    if (!validateForm()) {
        return;
    }

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const product = productInput.value;
    const quantity = Number(quantityInput.value);

    showOrder(name, phone, product, quantity);

    // Reset the form after displaying the order
    orderForm.reset();
    clearErrors();
});
