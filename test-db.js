const sql = require('mssql/msnodesqlv8');

const port = process.env.DB_PORT || '51657';
const candidates = [
  `Driver={SQL Server Native Client 11.0};Server=127.0.0.1,${port};Database=master;Trusted_Connection=Yes;`,
  `Driver={SQL Server Native Client 11.0};Server=localhost,${port};Database=master;Trusted_Connection=Yes;`,
  `Driver={SQL Server Native Client 11.0};Server=localhost\\MSSQLSERVER;Database=master;Trusted_Connection=Yes;`,
  `Driver={ODBC Driver 17 for SQL Server};Server=127.0.0.1,${port};Database=master;Trusted_Connection=Yes;`,
  `Driver={ODBC Driver 18 for SQL Server};Server=127.0.0.1,${port};Database=master;TrustServerCertificate=Yes;Authentication=ActiveDirectoryIntegrated;`
];

(async () => {
  for (const conn of candidates) {
    console.log('\nAttempting test connection with connection string:', conn);
    try {
      const pool = await sql.connect(conn);
      const result = await pool.request().query('SELECT 1 as n');
      console.log('Query result:', result.recordset);
      pool.close();
      return;
    } catch (e) {
      console.error('Test connection error:', e && (e.message || e));
      try { console.error('Full error:', JSON.stringify(e, Object.getOwnPropertyNames(e))); } catch (_) { console.error(e); }
    }
  }
  console.error('All connection attempts failed.');
})();
