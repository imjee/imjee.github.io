// Fetch and display products (placeholder)
fetch('/products')
  .then(res => res.json())
  .then(products => {
    const list = document.getElementById('product-list');
    products.forEach(p => {
      const div = document.createElement('div');
      div.innerHTML = `<h3>${p.name}</h3><p>${p.description}</p><p>$${p.price}</p><img src="${p.image}" width="100"/>`;
      list.appendChild(div);
    });
  });
