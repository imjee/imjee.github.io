async function loadProducts() {
  const res = await fetch('/products');
  const products = await res.json();
  const list = document.getElementById('product-list');
  list.innerHTML = "";
  products.forEach(p => {
    const item = document.createElement('div');
    item.innerHTML = `
      <img src="/uploads/${p.image}" width="100">
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <p>Rp ${p.price}</p>
      <button onclick="addToCart('${p.id}', '${p.name}', ${p.price})">Tambah ke Keranjang</button>
      <hr>
    `;
    list.appendChild(item);
  });
}

loadProducts();
