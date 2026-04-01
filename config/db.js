const mysql = require('mysql2');

const connection = mysql.createConnection(
  'mysql://root:GiCQHvmOcMcrChyAeCHBBTodiKjsARqU@interchange.proxy.rlwy.net:19249/railway'
);

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to Railway DB");
  }
});

module.exports = connection;