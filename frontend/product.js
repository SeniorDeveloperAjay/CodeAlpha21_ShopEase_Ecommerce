// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// Load product from MongoDB
async function loadProduct() {
  if (!productId) {
    document.getElementById("product-name").textContent =
      "Product ID not found";
    return;
  }

  try {
    const response = await fetch(`/api/products/${productId}`);

    if (!response.ok) {
      throw new Error("Product not found");
    }

    const product = await response.json();

    console.log("Product received:", product);

    // Display product information
    const image = document.getElementById("product-image");

    image.src = product.image;
    image.alt = product.name;

    document.getElementById("product-name").textContent = product.name;

    document.getElementById("product-price").textContent = "₹" + product.price;

    document.getElementById("product-description").textContent =
      product.description;

    // Add to Cart button
    document.getElementById("add-product").onclick = function () {
      addToCart(product.name, product.price);
    };

    // If image fails to load
    image.onerror = function () {
      console.log("Image failed to load:", product.image);

      image.alt = "Image unavailable";
    };
  } catch (error) {
    console.log("Error loading product:", error);

    document.getElementById("product-name").textContent =
      "Unable to load product";

    document.getElementById("product-description").textContent =
      "Please try again later.";
  }
}

// Add product to cart
function addToCart(name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

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

// Start loading product
loadProduct();
