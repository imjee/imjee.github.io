
let username = "Teman Spesial";

function startApp() {
  document.getElementById("lockscreen").classList.remove("hidden");
}

function unlock() {
  document.getElementById("lockscreen").classList.add("hidden");
  document.getElementById("homescreen").classList.remove("hidden");
}

function openApp(appName) {
  document.getElementById("homescreen").classList.add("hidden");
  document.getElementById("app-view").classList.remove("hidden");
  document.getElementById("app-title").innerText = appName;
  const content = document.getElementById("app-content");

  if (appName === "messages") {
    content.innerHTML = "<p>Hai " + username + " 🌸 Kamu sangat berarti 💖</p>";
  
  } else if (appName === "gallery") {
    content.innerHTML = "<div class='gallery-grid'>" +
      Array.from({length: 12}).map((_,i)=>'<img onclick="openGallery('+i+')" src="assets/images/gallery/img'+(i+1)+'.jpg" class="thumb">').join('') +
      "</div>";

    content.innerHTML = "<div class='gallery-grid'>" +
      Array.from({length: 12}).map((_,i)=>'<img src="assets/images/gallery/img'+(i+1)+'.jpg" class="thumb">').join('') +
      "</div>";
  } else if (appName === "settings") {
    content.innerHTML = `<input type='text' id='newname' placeholder='Ganti nama' />
                         <button onclick='setName()'>Simpan</button>`;
  } else if (appName === "song") {
    document.getElementById("music").play();
    content.innerHTML = "<p>Lagu favoritmu 🎶</p><p>George Benson – Nothing's Gonna Change My Love For You</p>";
  } else if (appName === "movie") {
    content.innerHTML = "<p>Film kesukaanmu 🎬</p><img src='assets/images/poster-jumbo.jpg' class='poster' />";
  } else if (appName === "sendlove") {
    content.innerHTML = "<p>Kirim cinta ke <a href='https://instagram.com/jeesssiixx' target='_blank'>@jeesssiixx</a> 💌</p>";
  }
}

function setName() {
  username = document.getElementById("newname").value || "Teman Spesial";
  alert("Nama diganti jadi: " + username);
}

function goBack() {
  document.getElementById("app-view").classList.add("hidden");
  document.getElementById("homescreen").classList.remove("hidden");
}

window.onload = startApp;
document.getElementById("lockscreen").addEventListener("click", unlock);

let currentImg = 0;
let captions = [
  "Kenangan manis bersamamu 💫",
  "Tertawa adalah bahasamu yang paling indah 😊",
  "Hari biasa jadi luar biasa 🌈",
  "Tatapanmu, ketenangan dunia 🕊️",
  "Langkah kecil ke arah kita 💞",
  "Waktu bersamamu terasa cepat 🕰️",
  "Tiap detik bermakna 🎁",
  "Kamu seperti matahari pagi ☀️",
  "Dunia terasa lebih hangat 🌻",
  "Terima kasih telah hadir 💐",
  "Tersenyum karenamu 😄",
  "Cintaku tak berubah 💖"
];

function openGallery(index) {
  currentImg = index;
  const viewer = document.getElementById('galleryViewer');
  viewer.classList.remove('hidden');
  updateGalleryImage();
}

function closeGallery() {
  document.getElementById('galleryViewer').classList.add('hidden');
}

function updateGalleryImage() {
  const img = document.getElementById('galleryImage');
  const cap = document.getElementById('galleryCaption');
  img.src = 'assets/images/gallery/img' + (currentImg + 1) + '.jpg';
  cap.innerText = captions[currentImg];
}

document.getElementById('prevBtn').onclick = () => {
  currentImg = (currentImg - 1 + 12) % 12;
  updateGalleryImage();
};
document.getElementById('nextBtn').onclick = () => {
  currentImg = (currentImg + 1) % 12;
  updateGalleryImage();
};
