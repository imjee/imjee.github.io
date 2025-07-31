const STORAGE_KEY = "barang_data_v1";

// Data awal contoh produk racing exhaust
function loadBarangList() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        return JSON.parse(data);
    }
    // Data awal jika belum ada data
    return [
        {
            nama: "DRC Victory Racing Series V1",
            deskripsi: "Knalpot racing stainless untuk harian dan kompetisi, suara ngebass dan ringan.",
            harga: 550000,
            foto: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
            link: "https://shopee.co.id/knalpot-drc-victory-racing-v1"
        },
        {
            nama: "DRC Racing Exhaust Pro Edition",
            deskripsi: "Edisi khusus dengan suara menggelegar, material premium, cocok untuk semua motor sport.",
            harga: 990000,
            foto: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80",
            link: "https://tokopedia.com/knalpot-drc-pro-edition"
        }
    ];
}

// Render produk
function renderBarangList() {
    const container = document.getElementById("barang-list");
    if (!container) return;
    const barangList = loadBarangList();
    if (barangList.length === 0) {
        container.innerHTML = "<p>Belum ada produk tersedia.</p>";
        return;
    }
    container.innerHTML = "";
    barangList.slice().reverse().forEach(barang => {
        const card = document.createElement("div");
        card.className = "barang-card";
        card.innerHTML = `
            <img src="${barang.foto}" alt="${barang.nama}">
            <h3>${barang.nama}</h3>
            <div class="harga">Rp${barang.harga.toLocaleString("id-ID")}</div>
            <p>${barang.deskripsi}</p>
            <a class="beli-btn" href="${barang.link}" target="_blank" rel="noopener">Beli</a>
        `;
        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    renderBarangList();
});
