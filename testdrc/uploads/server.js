const express = require('express');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.use(session({
  secret: 'ecommerce-secret',
  resave: false,
  saveUninitialized: true
}));

// Upload gambar produk
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Load data
const loadData = (file) => JSON.parse(fs.readFileSync(file));
const saveData = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

const PRODUCTS_FILE = 'products.json';
const SALES_FILE = 'sales-log.json';
const USERS_FILE = 'users.json';


// ======================== ROUTES ========================== //

// Admin login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = loadData(USERS_FILE);
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.user = username;
    res.redirect('/admin.html');
  } else {
    res.send('Login gagal');
  }
});

function isAuth(req, res, next) {
  if (req.session.user) next();
  else res.redirect('/admin-login.html');
}

// Admin tambah produk
app.post('/admin/add', isAuth, upload.single('image'), (req, res) => {
  const { name, price, description } = req.body;
  const image = req.file.filename;
  const products = loadData(PRODUCTS_FILE);
  const newProduct = { id: Date.now().toString(), name, price, description, image };
  products.push(newProduct);
  saveData(PRODUCTS_FILE, products);
  res.redirect('/admin.html');
});

// Get produk
app.get('/products', (req, res) => {
  const products = loadData(PRODUCTS_FILE);
  res.json(products);
});

// Checkout
app.post('/checkout', (req, res) => {
  const { cart, total } = req.body;
  const orders = loadData(SALES_FILE);
  cart.forEach(item => {
    orders.push({
      id: Date.now().toString() + Math.random(),
      product: item.name,
      qty: item.qty,
      total: item.price * item.qty,
      status: 'pending',
      created_at: new Date().toISOString(),
      sentToWhatsApp: false
    });
  });
  saveData(SALES_FILE, orders);
  res.json({ success: true });
});

// Get orders
app.get('/orders', isAuth, (req, res) => {
  const { status } = req.query;
  let orders = loadData(SALES_FILE);
  if (status === 'pending') {
    orders = orders.filter(o => o.status === 'pending');
  } else if (status === 'shipped') {
    orders = orders.filter(o => o.status === 'shipped');
  }
  res.json(orders);
});

// Update status & resi
app.patch('/orders/:id', isAuth, (req, res) => {
  const { id } = req.params;
  const { status, tracking_number } = req.body;
  const orders = loadData(SALES_FILE);
  const order = orders.find(o => o.id === id);
  if (order) {
    order.status = status;
    order.tracking_number = tracking_number;
    saveData(SALES_FILE, orders);
    res.json({ success: true });
  } else {
    res.status(404).send('Not found');
  }
});

// Export laporan penjualan
app.get('/report', isAuth, (req, res) => {
  const sales = loadData(SALES_FILE);
  const summary = {
    daily: {},
    monthly: {},
    yearly: 0
  };

  sales.forEach(order => {
    const date = new Date(order.created_at);
    const day = date.toISOString().split('T')[0];
    const month = date.toISOString().slice(0, 7);

    summary.daily[day] = (summary.daily[day] || 0) + order.total;
    summary.monthly[month] = (summary.monthly[month] || 0) + order.total;
    summary.yearly += order.total;
  });

  res.json(summary);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
