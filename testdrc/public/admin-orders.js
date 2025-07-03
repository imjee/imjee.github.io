async function loadOrders() {
  const status = document.getElementById("filter").value;
  const res = await fetch("/orders?status=" + status);
  const orders = await res.json();
  const list = document.getElementById("orders-list");
  list.innerHTML = "";
  orders.forEach(o => {
    const d = document.createElement("div");
    d.innerHTML = `
      <p><b>${o.product}</b> | Qty: ${o.qty} | Rp${o.total}</p>
      <p>Status: ${o.status}</p>
      <input id="resi-${o.id}" value="${o.tracking_number || ''}" placeholder="No. Resi"><br>
      <button onclick="markShipped('${o.id}')">Tandai Terkirim</button><hr>
    `;
    list.appendChild(d);
  });
}

async function markShipped(id) {
  const resi = document.getElementById("resi-" + id).value;
  await fetch("/orders/" + id, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "shipped", tracking_number: resi })
  });
  loadOrders();
}

loadOrders();
