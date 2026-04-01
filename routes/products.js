const express = require('express');
const router  = express.Router();
const db      = require('../config/db');


router.get('/', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch products.' });
    res.json(results);
  });
});


router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
    if (err)                 return res.status(500).json({ error: 'Failed to fetch product.' });
    if (results.length === 0) return res.status(404).json({ error: 'Product not found.' });
    res.json(results[0]);
  });
});

module.exports = router;
