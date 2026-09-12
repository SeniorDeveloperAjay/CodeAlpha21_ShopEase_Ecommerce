const orderId = localStorage.getItem("lastOrderId");

const orderIdElement = document.getElementById("order-id");

if (orderId) {
  orderIdElement.textContent = "Your Order ID: " + orderId;
} else {
  orderIdElement.textContent = "Order information not available.";
}
