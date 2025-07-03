const products = [
  { id: 1, name: "Velg Racing", price: 350000 },
  { id: 2, name: "Knalpot Racing", price: 450000 },
  { id: 3, name: "Shockbreaker", price: 550000 }
];

let cart = [];

function formatRupiah(amount) {
  return amount.toLocaleString('id-ID');
}

function renderProducts() {
  const list = document.getElementById("product-list");
  products.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <h3>${product.name}</h3>
      <p>Rp ${formatRupiah(product.price)}</p>
      <button onclick="addToCart(${product.id})">Tambah ke Keranjang</button>
    `;
    list.appendChild(div);
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  cart.push(product);
  updateCart();
}

function updateCart() {
  document.getElementById("cart-count").textContent = cart.length;
}

function openCart() {
  const cartItems = document.getElementById("cart-items");
  const total = document.getElementById("cart-total");
  cartItems.innerHTML = "";

  let sum = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - Rp ${formatRupiah(item.price)}`;
    cartItems.appendChild(li);
    sum += item.price;
  });

  total.textContent = formatRupiah(sum);
  document.getElementById("cart-popup").classList.remove("hidden");
}

function closeCart() {
  document.getElementById("cart-popup").classList.add("hidden");
}

function checkout() {
  alert("Terima kasih sudah berbelanja di DRC RACING VICTORY!");
  cart = [];
  updateCart();
  closeCart();
}

document.getElementById("cart").addEventListener("click", openCart);
renderProducts();
