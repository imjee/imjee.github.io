// Fitur ini belum diperlukan karena kita menggunakan scroll-behavior dari CSS.
// Kode JavaScript bisa ditambahkan di sini untuk fungsionalitas yang lebih kompleks di masa depan,
// seperti menu hamburger, animasi saat scroll, atau validasi form.

console.log("Portofolio berhasil dimuat!");

// Contoh: Animasi fade-in saat scroll (opsional, untuk pengembangan lebih lanjut)
// const sections = document.querySelectorAll('.section-container');
// const observer = new IntersectionObserver(entries => {
//     entries.forEach(entry => {
//         if (entry.isIntersecting) {
//             entry.target.style.opacity = 1;
//             entry.target.style.transform = 'translateY(0)';
//         }
//     });
// }, { threshold: 0.1 });

// sections.forEach(section => {
//     section.style.opacity = 0;
//     section.style.transform = 'translateY(20px)';
//     section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
//     observer.observe(section);
// });
