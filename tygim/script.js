document.addEventListener('DOMContentLoaded', () => {
    // ELEMEN DARI HTML
    const spinButton = document.getElementById('spin-button');
    const balanceDisplay = document.getElementById('balance');
    const betAmountInput = document.getElementById('bet-amount');
    const increaseBetButton = document.getElementById('increase-bet');
    const decreaseBetButton = document.getElementById('decrease-bet');
    const slotGrid = document.getElementById('slot-grid');
    const resultMessage = document.getElementById('result-message');

    // ================================================================
    // LOGIKA GAME YANG DIPINDAHKAN DARI BACKEND (PYTHON) KE JAVASCRIPT
    // ================================================================

    const SIMBOL = {
        "permata_biru": { nilai: 1, img: "gem_blue.png" },
        "permata_hijau": { nilai: 1.5, img: "gem_green.png" },
        "permata_kuning": { nilai: 2, img: "gem_yellow.png" },
        "cincin": { nilai: 5, img: "ring.png" },
        "mahkota": { nilai: 10, img: "crown.png" },
    };

    const JUMLAH_GULUNGAN = 6;
    const JUMLAH_BARIS = 5;
    const MINIMAL_SIMBOL_MENANG = 8;
    
    // Variabel untuk menyimpan state game
    let saldo = 1000.00;

    function putarGulungan() {
        const daftarSimbol = Object.keys(SIMBOL);
        const gridHasil = [];
        for (let i = 0; i < JUMLAH_GULUNGAN * JUMLAH_BARIS; i++) {
            const simbolTerpilih = daftarSimbol[Math.floor(Math.random() * daftarSimbol.length)];
            gridHasil.push(simbolTerpilih);
        }
        return gridHasil;
    }

    function hitungKemenangan(grid, taruhan) {
        const hitungan = {};
        grid.forEach(simbol => {
            hitungan[simbol] = (hitungan[simbol] || 0) + 1;
        });

        let totalKemenangan = 0;
        const detailKemenangan = {};

        for (const simbol in hitungan) {
            const jumlah = hitungan[simbol];
            if (jumlah >= MINIMAL_SIMBOL_MENANG) {
                const nilaiSimbol = SIMBOL[simbol].nilai;
                const kemenangan = nilaiSimbol * jumlah * (taruhan / 10);
                totalKemenangan += kemenangan;
                detailKemenangan[simbol] = { jumlah, kemenangan };
            }
        }
        return { totalKemenangan, detailKemenangan };
    }
    // ================================================================
    // AKHIR DARI LOGIKA GAME
    // ================================================================

    // KONTROL TARUHAN
    const betIncrements = [10, 20, 50, 100, 200, 500];
    let currentBetIndex = 0;

    const updateBetDisplay = () => {
        betAmountInput.value = betIncrements[currentBetIndex];
    };

    increaseBetButton.addEventListener('click', () => {
        if (currentBetIndex < betIncrements.length - 1) {
            currentBetIndex++;
            updateBetDisplay();
        }
    });

    decreaseBetButton.addEventListener('click', () => {
        if (currentBetIndex > 0) {
            currentBetIndex--;
            updateBetDisplay();
        }
    });

    // FUNGSI UTAMA KETIKA TOMBOL SPIN DITEKAN
    spinButton.addEventListener('click', () => {
        spinButton.disabled = true;
        resultMessage.textContent = 'Berputar...';
        
        const taruhan = parseFloat(betAmountInput.value);

        if (taruhan > saldo) {
            resultMessage.textContent = 'Saldo tidak cukup!';
            spinButton.disabled = false;
            return;
        }

        // Kurangi saldo dengan taruhan
        saldo -= taruhan;

        // Jalankan logika game langsung di sini
        const hasilGrid = putarGulungan();
        const { totalKemenangan, detailKemenangan } = hitungKemenangan(hasilGrid, taruhan);

        // Tambahkan kemenangan ke saldo
        if (totalKemenangan > 0) {
            saldo += totalKemenangan;
            resultMessage.textContent = `🎉 Menang! Anda mendapatkan ${totalKemenangan.toFixed(2)} 🎉`;
        } else {
            resultMessage.textContent = 'Coba lagi lain kali!';
        }

        // Perbarui tampilan
        balanceDisplay.textContent = saldo.toFixed(2);
        displayGrid(hasilGrid, detailKemenangan);
        
        // Aktifkan tombol kembali setelah jeda singkat
        setTimeout(() => {
            spinButton.disabled = false;
        }, 300); // jeda 0.3 detik
    });

    const displayGrid = (gridData, winningDetails) => {
        slotGrid.innerHTML = '';
        const winningSymbols = Object.keys(winningDetails);

        gridData.forEach(simbolNama => {
            const symbolDiv = document.createElement('div');
            symbolDiv.classList.add('symbol');
            symbolDiv.style.backgroundImage = `url('https://via.placeholder.com/80/${getColor(simbolNama)}/FFFFFF?text=${simbolNama.split('_')[0]}')`;
            
            if (winningSymbols.includes(simbolNama)) {
                symbolDiv.classList.add('win');
            }
            slotGrid.appendChild(symbolDiv);
        });
    };

    const getColor = (name) => {
        if (name.includes('biru')) return '0077b6';
        if (name.includes('hijau')) return '2d6a4f';
        if (name.includes('kuning')) return 'fca311';
        if (name.includes('cincin')) return 'c9ada7';
        if (name.includes('mahkota')) return 'ffd60a';
        return '495057';
    };
    
    // Inisialisasi tampilan
    balanceDisplay.textContent = saldo.toFixed(2);
    updateBetDisplay();
});
