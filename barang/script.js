const STORAGE_KEY = "barang_data_v1";

// Load barang list dari localStorage atau data awal
function loadBarangList() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        return JSON.parse(data);
    }
    // Data awal jika belum ada data
    return [
        {
            nama: "Tas Keren",
            deskripsi: "Tas ransel fashion keren dan tahan air.",
            harga: 175000,
            foto: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
            link: "https://tokopedia.com/"
        },
        {
            nama: "Jam Tangan Sport",
            deskripsi: "Jam tangan digital anti air, cocok buat olahraga.",
            harga: 99000,
            foto: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80",
            link: "https://shopee.co.id/"
        }
    ];
}

// Simpan barang list ke localStorage
function saveBarangList(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// Render barang di index.html
function renderBarangList() {
    const container = document.getElementById("barang-list");
    if (!container) return;
    const barangList = loadBarangList();
    if (barangList.length === 0) {
        container.innerHTML = "<p>Belum ada barang tersedia.</p>";
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
        card.querySelector('.beli-btn').addEventListener('click', e => {
            card.style.transform = "scale(0.97)";
            setTimeout(() => { card.style.transform = ""; }, 150);
        });
        container.appendChild(card);
    });
}

// Proses form tambah barang di dashboard.html + live preview
function handleBarangForm() {
    const form = document.getElementById("barangForm");
    if (!form) return;

    const previewArea = document.getElementById('preview-area');
    const previewCard = document.getElementById('preview-card');
    let imgPreview = "";
    let currentFoto = "";

    // Live preview update
    function updatePreview() {
        const nama = form.nama.value.trim();
        const deskripsi = form.deskripsi.value.trim();
        const harga = form.harga.value.trim();
        const link = form.link.value.trim();

        if (!nama && !deskripsi && !harga && !imgPreview) {
            previewArea.style.display = "none";
            previewCard.innerHTML = "";
            return;
        }

        previewCard.innerHTML = `
            ${imgPreview ? `<img src="${imgPreview}" alt="Preview">` : ""}
            <h3>${nama || "-Nama Barang-"}</h3>
            <div class="harga">${harga ? "Rp" + Number(harga).toLocaleString("id-ID") : "-Harga-"}</div>
            <p>${deskripsi || "-Deskripsi-"}</p>
            <a class="beli-btn" href="${link || '#'}" target="_blank" rel="noopener">Beli</a>
        `;
        previewArea.style.display = "";
    }

    form.nama.addEventListener('input', updatePreview);
    form.deskripsi.addEventListener('input', updatePreview);
    form.harga.addEventListener('input', updatePreview);
    form.link.addEventListener('input', updatePreview);

    form.foto.addEventListener('change', function() {
        const file = this.files[0];
        if (!file) {
            imgPreview = "";
            updatePreview();
            return;
        }
        const reader = new FileReader();
        reader.onload = function(ev) {
            imgPreview = ev.target.result;
            updatePreview();
        };
        reader.readAsDataURL(file);
    });

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        const nama = form.nama.value.trim();
        const deskripsi = form.deskripsi.value.trim();
        const harga = parseInt(form.harga.value);
        const link = form.link.value.trim();

        const fotoInput = form.foto;
        if (!fotoInput.files[0]) {
            alert("Mohon upload foto barang.");
            return;
        }
        const reader = new FileReader();
        reader.onload = function(ev) {
            const foto = ev.target.result;
            const barangList = loadBarangList();
            barangList.push({ nama, deskripsi, harga, foto, link });
            saveBarangList(barangList);
            form.reset();
            imgPreview = "";
            updatePreview();
            showSuccess("Barang berhasil ditambahkan!");
        };
        reader.readAsDataURL(fotoInput.files[0]);
    });

    // Success notification
    function showSuccess(msg) {
        const notif = document.getElementById("success-message");
        notif.textContent = msg;
        notif.classList.add("show");
        setTimeout(() => notif.classList.remove("show"), 1700);
    }
}

// Inisialisasi sesuai halaman
document.addEventListener("DOMContentLoaded", function() {
    renderBarangList();
    handleBarangForm();
});
