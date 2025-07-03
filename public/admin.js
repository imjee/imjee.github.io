async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (res.ok) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";
    loadProducts();
  } else {
    alert("Login failed");
  }
}

async function loadProducts() {
  const res = await fetch("/products");
  const products = await res.json();
  const list = document.getElementById("product-list");
  list.innerHTML = "";
  products.forEach((product, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <b>${product.name}</b> - $${product.price}<br>
      <img src="${product.image}" width="100"/><br>
      <button onclick="deleteProduct(${index})">Delete</button>
    `;
    list.appendChild(li);
  });
}

document.getElementById("product-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("name", document.getElementById("name").value);
  formData.append("description", document.getElementById("description").value);
  formData.append("price", document.getElementById("price").value);
  formData.append("image", document.getElementById("image").files[0]);

  const res = await fetch("/products", {
    method: "POST",
    body: formData
  });

  if (res.ok) {
    loadProducts();
    document.getElementById("product-form").reset();
  } else {
    alert("Failed to add product");
  }
});

async function deleteProduct(index) {
  const res = await fetch("/products/" + index, { method: "DELETE" });
  if (res.ok) loadProducts();
}
