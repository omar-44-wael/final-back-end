

const express = require('express');
const router = express.Router();
const db = require('../config/db');


router.post('/', (req, res) => {
  const { customer_name, email, address, total_price, session_id, items } = req.body;

  if (!customer_name || !email || !address || !total_price || !session_id) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Order must have at least one item.' });
  }


  const orderSql = `
    INSERT INTO orders (customer_name, email, address, total_price)
    VALUES (?, ?, ?, ?)
  `;

  db.query(orderSql, [customer_name, email, address, total_price], (err, orderResult) => {
    if (err) return res.status(500).json({ error: 'Failed to save order.' });


    const orderId = orderResult.insertId;


    const itemRows = items.map(item => [
      orderId,
      item.product_id,
      item.name,
      item.price,
      item.quantity
    ]);

    const itemsSql = `
      INSERT INTO order_items (order_id, product_id, name, price, quantity)
      VALUES ?
    `;

    db.query(itemsSql, [itemRows], (err2) => {
      if (err2) return res.status(500).json({ error: 'Failed to save order items.' });


      db.query('DELETE FROM cart WHERE session_id = ?', [session_id], (err3) => {
        if (err3) {
          
          console.error('Warning: could not clear cart after order:', err3.message);
        }

        
        res.json({
          message: 'Order placed successfully and saved to MySQL!',
          orderId: orderId
        });
      });
    });
  });
});


router.get('/', (req, res) => {
  db.query('SELECT * FROM orders ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch orders.' });
    res.json(results);
  });
});


router.get('/:orderId/items', (req, res) => {
  const orderId = req.params.orderId;

  db.query('SELECT * FROM order_items WHERE order_id = ?', [orderId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch order items.' });
    res.json(results);
  });
});

module.exports = router;
