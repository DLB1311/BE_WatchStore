const sql = require('mssql');

const config = {
  server: 'localhost',
  user: 'sa',
  password: '131101',
  database: 'BanDongHo',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const pool = new sql.ConnectionPool(config);

pool.connect()
  .then(() => console.log('Connected to SQL Server'))
  .catch(error => console.log('SQL Server connection error:', error));

module.exports = pool;