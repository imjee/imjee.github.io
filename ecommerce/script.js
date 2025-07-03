const products = [
  {
    id: 1,
    name: "Velg Racing Hitam",
    price: 350000,
    desc: "Velg racing warna hitam, cocok untuk motor sport.",
    category: "Velg",
    image: "https://via.placeholder.com/200?text=Velg+Hitam"
  },
  {
    id: 2,
    name: "Knalpot Racing Full System",
    price: 450000,
    desc: "Knalpot stainless dengan suara garang.",
    category: "Knalpot",
    image: "https://via.placeholder.com/200?text=Knalpot"
  },
  {
    id: 3,
    name: "Shockbreaker Tabung",
    price: 550000,
    desc: "Shockbreaker nyaman untuk touring dan harian.",
    category: "Shockbreaker",
    image: "https://via.placeholder.com/200?text=Shockbreaker"
  }
];

let cart = [];
let currentCategory = "all";

function formatRupiah(amount) {
  return amount.toLocaleString('id-ID');
}

function renderProducts() {
  const list = document.getElementById("product-list");
  list.innerHTML = "";
  const search = document.getElementById("search-input").value.toLowerCase();
  products
    .filter(p =>
      (currentCategory === "all" || p.category === currentCategory) &&
      (p.name.toLowerCase().includes(search) || p.desc.toLowerCase().includes(search))
    )
    .forEach(product => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>${product.desc}</p>
        <p class="price">Rp ${formatRupiah(product.price)}</p>
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

function filterByCategory(cat) {
  currentCategory = cat;
  renderProducts();
}

function filterProducts() {
  renderProducts();
}

function submitForm(e) {
  e.preventDefault();
  const nama = document.getElementById("nama").value;
  const produk = document.getElementById("produk").value;
  const pesan = `Halo, saya ${nama} ingin memesan produk: ${produk}`;
  window.open(`https://wa.me/6287776696070?text=${encodeURIComponent(pesan)}`, "_blank");
}

document.addEventListener("DOMContentLoaded", renderProducts);
