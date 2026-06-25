const express = require('express');
const cors = require('cors');
let sql; // assigned dynamically to either mssql (tedious) or mssql/msnodesqlv8
let usingNativeDriver = false;

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:4200' || 'http://localhost',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
app.use(express.json());

const dbPort = process.env.DB_PORT || '51657';
const connectionString = process.env.DB_CONNECTION_STRING ||
  `Server=127.0.0.1,${dbPort};Database=AidaSpace;User Id=Daryaarjmand;Password=Daryaarjmand1234!;Encrypt=true;TrustServerCertificate=true;`;

console.log('Starting server with SQL connection:', {
  server: '127.0.0.1',
  port: dbPort,
  database: 'AidaSpace',
  user: 'Daryaarjmand'
});

sql = require('mssql');

let pool;
async function getPool() {
  if (!pool) {
    try {
      pool = await sql.connect(connectionString);
    } catch (e) {
      try {
        console.error('DB connection error:', e && (e.message || e));
        console.error('Full error:', JSON.stringify(e, Object.getOwnPropertyNames(e)));
      } catch (logErr) {
        console.error('DB connection error (inspect failed):', e);
      }
      throw e;
    }
  }
  return pool;
}

function createCrudRouter(tableName, fields) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const pool = await getPool();
      const result = await pool.request().query(`SELECT * FROM ${tableName}`);
      res.json(result.recordset);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve records.' });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const pool = await getPool();
      const result = await pool.request()
        .input('id', sql.Int, Number(req.params.id))
        .query(`SELECT * FROM ${tableName} WHERE Id = @id`);
      const record = result.recordset[0];
      if (!record) {
        return res.status(404).json({ error: 'Record not found.' });
      }
      res.json(record);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve the record.' });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const request = (await getPool()).request();
      fields.forEach((field) => {
        request.input(field.name, field.type, req.body[field.name] ?? null);
      });

      const columns = fields.map((field) => `[${field.name}]`).join(', ');
      const values = fields.map((field) => `@${field.name}`).join(', ');
      const result = await request.query(
        `INSERT INTO ${tableName} (${columns}) OUTPUT INSERTED.* VALUES (${values})`
      );

      res.status(201).json(result.recordset[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create the record.' });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const body = req.body;
      const fieldsToUpdate = fields.filter((field) => Object.prototype.hasOwnProperty.call(body, field.name));
      if (fieldsToUpdate.length === 0) {
        return res.status(400).json({ error: 'No fields provided for update.' });
      }

      const request = (await getPool()).request();
      request.input('id', sql.Int, Number(req.params.id));
      const setClauses = fieldsToUpdate.map((field) => {
        request.input(field.name, field.type, body[field.name]);
        return `[${field.name}] = @${field.name}`;
      });

      const query = `UPDATE ${tableName} SET ${setClauses.join(', ')} WHERE Id = @id; SELECT * FROM ${tableName} WHERE Id = @id;`;
      const result = await request.query(query);
      const updated = result.recordset[0];
      if (!updated) {
        return res.status(404).json({ error: 'Record not found.' });
      }
      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update the record.' });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const pool = await getPool();
      const result = await pool.request()
        .input('id', sql.Int, Number(req.params.id))
        .query(`DELETE FROM ${tableName} WHERE Id = @id`);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ error: 'Record not found.' });
      }

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete the record.' });
    }
  });

  return router;
}

const addressFields = [
  { name: 'Street', type: sql.NVarChar(200) },
  { name: 'City', type: sql.NVarChar(100) },
  { name: 'StateProvince', type: sql.NVarChar(100) },
  { name: 'Zip', type: sql.NVarChar(50) },
  { name: 'Country', type: sql.NVarChar(100) }
];

const birthFields = [
  { name: 'FullName', type: sql.NVarChar(100) },
  { name: 'Gender', type: sql.NVarChar(50) },
  { name: 'Age', type: sql.Int },
  { name: 'Comments', type: sql.NVarChar(sql.MAX) },
  { name: 'Retired', type: sql.NVarChar(50) }
];

const informationFields = [
  { name: 'Name', type: sql.NVarChar(100) },
  { name: 'AgeDescription', type: sql.NVarChar(100) },
  { name: 'Address', type: sql.NVarChar(300) },
  { name: 'Phone', type: sql.NVarChar(50) },
  { name: 'Company', type: sql.NVarChar(200) },
  { name: 'Occupation', type: sql.NVarChar(200) },
  { name: 'Notes', type: sql.NVarChar(sql.MAX) }
];

app.use('/api/address', createCrudRouter('Address', addressFields));
app.use('/api/birth', createCrudRouter('BirthInfo', birthFields));
app.use('/api/information', createCrudRouter('Information', informationFields));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
