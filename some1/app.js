
function startApp() {
  const name = document.getElementById('username').value || 'Teman Spesial';
  document.body.innerHTML = '<h1>Hai, ' + name + '! Geser untuk membuka 📱</h1>';
}
