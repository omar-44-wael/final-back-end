const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/:sessionId', (req, res) => {
  const sessionId = req.params.sessionId;

  const sql = `
    SELECT
      cart.id,
      cart.session_id,
      cart.product_id,
      cart.quantity,
      products.name,
      products.price,
      products.image
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.session_id = ?
    ORDER BY cart.added_at ASC
  `;

  db.query(sql, [sessionId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch cart.' });
    res.json(results);
  });
});



router.post('/', (req, res) => {
  const { session_id, product_id, quantity } = req.body;

  if (!session_id || !product_id || !quantity) {
    return res.status(400).json({ error: 'session_id, product_id, and quantity are required.' });
  }

  // Check if this product already exists in cart for this session
  const checkSql = 'SELECT * FROM cart WHERE session_id = ? AND product_id = ?';
  db.query(checkSql, [session_id, product_id], (err, existing) => {
    if (err) return res.status(500).json({ error: 'Database error.' });

    if (existing.length > 0) {
      // Product already in cart → just add to its quantity
      const updateSql = 'UPDATE cart SET quantity = quantity + ? WHERE session_id = ? AND product_id = ?';
      db.query(updateSql, [quantity, session_id, product_id], (err2) => {
        if (err2) return res.status(500).json({ error: 'Failed to update cart.' });
        res.json({ message: 'Cart updated in MySQL.' });
      });
    } else {
      // New product → insert a new row
      const insertSql = 'INSERT INTO cart (session_id, product_id, quantity) VALUES (?, ?, ?)';
      db.query(insertSql, [session_id, product_id, quantity], (err2) => {
        if (err2) return res.status(500).json({ error: 'Failed to add to cart.' });
        res.json({ message: 'Product added to cart in MySQL.' });
      });
    }
  });
});



router.put('/:cartRowId', (req, res) => {
  const cartRowId = req.params.cartRowId;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    // If invalid quantity, just delete the row
    db.query('DELETE FROM cart WHERE id = ?', [cartRowId], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to remove item.' });
      res.json({ message: 'Item removed from MySQL cart.' });
    });
    return;
  }

  db.query('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, cartRowId], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update quantity.' });
    res.json({ message: 'Quantity updated in MySQL.' });
  });
});




router.delete('/:cartRowId', (req, res) => {
  const cartRowId = req.params.cartRowId;

  db.query('DELETE FROM cart WHERE id = ?', [cartRowId], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to remove item.' });
    res.json({ message: 'Item deleted from MySQL cart.' });
  });
});



router.delete('/session/:sessionId', (req, res) => {
  const sessionId = req.params.sessionId;

  db.query('DELETE FROM cart WHERE session_id = ?', [sessionId], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to clear cart.' });
    res.json({ message: 'Cart cleared from MySQL.' });
  });
});

module.exports = router;
