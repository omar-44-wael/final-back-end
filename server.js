const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = 5000;


app.use(cors());


app.use(express.json());

//  Routes 
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);


app.get('/', (req, res) => {
  res.json({ message: '✅ ShopEasy API is running.' });
});

// Start 
app.listen(PORT, () => {
  console.log(`🚀 Server running → http://localhost:${PORT}`);
  console.log(`   Products : http://localhost:${PORT}/api/products`);
  console.log(`   Cart     : http://localhost:${PORT}/api/cart/<sessionId>`);
  console.log(`   Orders   : http://localhost:${PORT}/api/orders`);
});
