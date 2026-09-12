const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

const ordersContainer = document.getElementById("orders-container");

if (!loggedInUser) {
  alert("Please login to view your orders.");

  window.location.href = "login.html";
} else {
  loadOrders();
}

async function loadOrders() {
  try {
    const response = await fetch(
      "/api/orders?email=" + encodeURIComponent(loggedInUser.email),
    );

    const orders = await response.json();

    if (orders.length === 0) {
      ordersContainer.innerHTML = "<p>You have not placed any orders yet.</p>";

      return;
    }

    ordersContainer.innerHTML = "";

    orders.forEach(function (order) {
      const orderDiv = document.createElement("div");

      orderDiv.className = "order-card";

      let productsHTML = "";

      order.products.forEach(function (product) {
        productsHTML += `
                    <p>
                        <strong>${product.name}</strong>
                        <br>
                        ₹${product.price} × ${product.quantity}
                    </p>
                `;
      });

      const orderDate = new Date(order.orderDate);

      const formattedDate = orderDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      });

      orderDiv.innerHTML = `
                <h3>Order ID: ${order._id}</h3>

                ${productsHTML}

                <p>
                    <strong>Total:</strong>
                    ₹${order.totalAmount}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${order.status}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${formattedDate}
                </p>

                <hr>
            `;

      ordersContainer.appendChild(orderDiv);
    });
  } catch (error) {
    console.log("Error loading orders:", error);

    ordersContainer.innerHTML = "<p>Unable to load orders.</p>";
  }
}
