
const mysql = require('mysql2');


const connection = mysql.createConnection({
  host:     'localhost',
  user:     'root',       
  password: '',           
  database: 'ecommerce_db'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL database.');
});

module.exports = connection;
