// Tunggu hingga seluruh halaman HTML dimuat sebelum menjalankan script
document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================================================
    // USERNAME GITHUB ANDA SUDAH DIMASUKKAN DI SINI
    const githubUsername = 'imjee'; 
    // ===================================================================

    // Elemen wadah untuk proyek dan keahlian
    const projectsGrid = document.getElementById('projects-grid');
    const skillsGrid = document.getElementById('skills-grid');
    
    const apiUrl = `https://api.github.com/users/${githubUsername}/repos?sort=updated&direction=desc`;

    // Tampilkan pesan loading awal
    projectsGrid.innerHTML = '<p>Sedang memuat proyek dari GitHub...</p>';
    skillsGrid.innerHTML = '<p>Menghitung bahasa...</p>';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Gagal mengambil data dari GitHub.');
            }
            return response.json();
        })
        .then(repos => {
            projectsGrid.innerHTML = ''; // Hapus loading proyek
            skillsGrid.innerHTML = ''; // Hapus loading skill

            const filteredRepos = repos.filter(repo => repo.name !== githubUsername && repo.description);
            
            if (filteredRepos.length === 0) {
                projectsGrid.innerHTML = '<p>Belum ada proyek publik yang bisa ditampilkan.</p>';
            }

            const languageCounts = {};

            // Loop melalui setiap repositori
            filteredRepos.forEach(repo => {
                // --- Bagian untuk menampilkan proyek ---
                const projectCard = document.createElement('div');
                projectCard.classList.add('project-card');
                projectCard.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description}</p>
                    <div class="project-links">
                        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="btn">Lihat Live</a>` : ''}
                        <a href="${repo.html_url}" target="_blank" class="btn-secondary">Kode GitHub</a>
                    </div>
                `;
                projectsGrid.appendChild(projectCard);

                // --- Bagian untuk menghitung bahasa ---
                const lang = repo.language;
                if (lang) { 
                    languageCounts[lang] = (languageCounts[lang] || 0) + 1;
                }
            });

            // --- Bagian untuk menampilkan bahasa ---
            const sortedLanguages = Object.entries(languageCounts).sort((a, b) => b[1] - a[1]);

            if (sortedLanguages.length === 0) {
                 skillsGrid.innerHTML = '<p>Bahasa pemrograman akan tampil di sini setelah proyek publik dibuat.</p>';
            } else {
                sortedLanguages.slice(0, 8).forEach(([language, count]) => {
                    const skillItem = document.createElement('div');
                    skillItem.classList.add('skill-item');
                    skillItem.textContent = language;
                    skillsGrid.appendChild(skillItem);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            projectsGrid.innerHTML = `<p>Terjadi kesalahan saat memuat proyek. Coba refresh halaman.</p>`;
            skillsGrid.innerHTML = `<p>Gagal memuat keahlian.</p>`;
        });
});
