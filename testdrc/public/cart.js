let cart = [];

function addToCart(id, name, price) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty += 1;
  else cart.push({ id, name, price, qty: 1 });
  alert('Ditambahkan ke keranjang!');
}

function openCart() {
  document.getElementById("cart-modal").classList.remove("hidden");
  renderCart();
}

function closeCart() {
  document.getElementById("cart-modal").classList.add("hidden");
}

function renderCart() {
  const list = document.getElementById("cart-items");
  list.innerHTML = "";
  cart.forEach((item, i) => {
    const row = document.createElement("div");
    row.innerHTML = `
      ${item.name} x ${item.qty} = Rp${item.qty * item.price}
      <button onclick="removeItem(${i})">❌</button>
    `;
    list.appendChild(row);
  });
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

async function checkout() {
  const total = cart.reduce((sum, i) => sum + i.qty * i.price, 0);
  const res = await fetch('/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cart, total })
  });
  if (res.ok) {
    alert('Pesanan berhasil dibuat!');
    cart = [];
    closeCart();
  }
}
