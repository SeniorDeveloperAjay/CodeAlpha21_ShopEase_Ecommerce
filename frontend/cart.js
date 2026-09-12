let cart = JSON.parse(localStorage.getItem("cart")) || [];

function displayCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "Total: ₹0";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const div = document.createElement("div");

    div.innerHTML = `
            <h3>${item.name}</h3>
            <p>Price: ₹${item.price}</p>

            <button onclick="decreaseQuantity(${index})">-</button>
            <span> ${item.quantity} </span>
            <button onclick="increaseQuantity(${index})">+</button>

            <p>Subtotal: ₹${subtotal}</p>

            <button onclick="removeItem(${index})">Remove</button>
            <hr>
        `;

    cartItems.appendChild(div);
  });

  cartTotal.textContent = "Total: ₹" + total;
}

function increaseQuantity(index) {
  cart[index].quantity += 1;

  localStorage.setItem("cart", JSON.stringify(cart));

  displayCart();
}

function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  displayCart();
}

function removeItem(index) {
  cart.splice(index, 1);

  localStorage.setItem("cart", JSON.stringify(cart));

  displayCart();
}
displayCart();
function goToCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser) {
    alert("Please login before checkout.");
    window.location.href = "login.html";
    return;
  }

  window.location.href = "checkout.html";
}
