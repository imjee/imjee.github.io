<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Dashboard Admin - Tambah Barang</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1><span class="red">Dashboard</span> <span class="white">Admin</span></h1>
        <a href="index.html" class="admin-link">Kembali ke Display</a>
    </header>
    <main>
        <form id="barangForm" autocomplete="off">
            <label>Nama Barang:<br>
                <input type="text" name="nama" required>
            </label>
            <label>Deskripsi:<br>
                <textarea name="deskripsi" required></textarea>
            </label>
            <label>Harga:<br>
                <input type="number" name="harga" required>
            </label>
            <label>Foto Barang:<br>
                <input type="file" name="foto" accept="image/*" required>
            </label>
            <label>Link Pembelian:<br>
                <input type="url" name="link" required placeholder="https://...">
            </label>
            <button type="submit">Tambah Barang</button>
            <div id="success-message"></div>
        </form>
        <div class="preview-area" id="preview-area" style="display:none;">
            <h2>Preview</h2>
            <div class="barang-card preview" id="preview-card"></div>
        </div>
    </main>
    <footer>
        <span>© 2025 Display Barang Indonesia</span>
    </footer>
    <script src="script.js"></script>
</body>
</html>
