const venom = require('venom-bot');
const fs = require('fs');

venom
  .create()
  .then(client => start(client))
  .catch(err => console.log(err));

function start(client) {
  fs.watchFile('./sales-log.json', (curr, prev) => {
    const data = JSON.parse(fs.readFileSync('./sales-log.json'));
    const latest = data[data.length - 1];
    if (!latest.sentToWhatsApp) {
      const msg = `🛒 Pesanan baru!\nProduk: ${latest.product}\nJumlah: ${latest.qty}\nTotal: Rp${latest.total}`;
      client.sendText('628XXXXXXX@c.us', msg); // ganti dengan nomor admin
      latest.sentToWhatsApp = true;
      fs.writeFileSync('./sales-log.json', JSON.stringify(data, null, 2));
    }
  });
}
