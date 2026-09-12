function updateNavbar() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const loginLink = document.getElementById("login-link");
  const userInfo = document.getElementById("user-info");

  if (!loginLink || !userInfo) {
    return;
  }

  if (loggedInUser) {
    userInfo.textContent = "Welcome, " + loggedInUser.name;

    loginLink.textContent = "Logout";
    loginLink.href = "#";

    loginLink.onclick = function (event) {
      event.preventDefault();

      localStorage.removeItem("loggedInUser");

      updateNavbar();
      window.location.href = "index.html";
    };
  } else {
    userInfo.textContent = "";

    loginLink.textContent = "Login";
    loginLink.href = "login.html";
    loginLink.onclick = null;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  updateNavbar();
});
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartCount = document.getElementById("cart-count");

  if (!cartCount) {
    return;
  }

  let totalItems = 0;

  cart.forEach(function (item) {
    totalItems += item.quantity;
  });

  cartCount.textContent = "(" + totalItems + ")";
}

document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
});
