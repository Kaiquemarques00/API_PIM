import pg from "pg";

const db = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'fazenda_urbana',
  password: 'k26m03s2004',
  port: 5432,
});

export default db;
