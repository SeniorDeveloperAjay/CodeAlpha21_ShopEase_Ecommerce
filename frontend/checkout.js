const checkoutForm = document.getElementById("checkout-form");

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

const cart = JSON.parse(localStorage.getItem("cart")) || [];

// Check login
if (!loggedInUser) {
  alert("Please login before checkout.");
  window.location.href = "login.html";
}

// Check cart
if (cart.length === 0) {
  alert("Your cart is empty.");
  window.location.href = "cart.html";
}

// Fill user details
if (loggedInUser) {
  document.getElementById("checkout-name").value = loggedInUser.name;

  document.getElementById("checkout-email").value = loggedInUser.email;
}

// Display products
const checkoutItems = document.getElementById("checkout-items");

let totalAmount = 0;

cart.forEach(function (item) {
  const subtotal = item.price * item.quantity;

  totalAmount += subtotal;

  const productDiv = document.createElement("div");

  productDiv.innerHTML =
    "<p><strong>" +
    item.name +
    "</strong></p>" +
    "<p>Price: ₹" +
    item.price +
    "</p>" +
    "<p>Quantity: " +
    item.quantity +
    "</p>" +
    "<p>Subtotal: ₹" +
    subtotal +
    "</p>" +
    "<hr>";

  checkoutItems.appendChild(productDiv);
});

// Display total
document.getElementById("checkout-total").textContent =
  "Total: ₹" + totalAmount;

// Place order
checkoutForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const customerName = document.getElementById("checkout-name").value;

  const email = document.getElementById("checkout-email").value;

  try {
    const response = await fetch("/api/orders", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        customerName: customerName,
        email: email,
        address: document.getElementById("checkout-address").value,
        city: document.getElementById("checkout-city").value,
        pincode: document.getElementById("checkout-pincode").value,
        products: cart,
        totalAmount: totalAmount,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.removeItem("cart");

      localStorage.setItem("lastOrderId", data.orderId);

      window.location.href = "order-success.html";
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log("Checkout error:", error);

    alert("Server error. Please try again.");
  }
});
