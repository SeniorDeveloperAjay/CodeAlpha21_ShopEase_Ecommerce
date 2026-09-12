let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
  const existingProduct = cart.find((item) => item.name === name);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(name + " added to cart!");
}

function scrollToProducts() {
  document.getElementById("products").scrollIntoView({
    behavior: "smooth",
  });
}

async function loadProducts() {
  try {
    const response = await fetch("/api/products");
    const products = await response.json();

    const container = document.getElementById("product-container");

    container.innerHTML = "";

    products.forEach((product) => {
      const card = document.createElement("div");

      card.className = "product-card";

      card.onclick = function () {
        window.location.href = "product.html?id=" + product._id;
      };

      card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">₹${product.price}</p>
                <button>Add to Cart</button>
            `;

      card.querySelector("button").addEventListener("click", function (event) {
        event.stopPropagation();
        addToCart(product.name, product.price);
      });

      container.appendChild(card);
    });
  } catch (error) {
    console.log("Error loading products:", error);
  }
}

loadProducts();
