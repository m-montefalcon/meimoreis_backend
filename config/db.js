import pg from "pg";
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "meinardz",
    port: 5432,
  });
  

export default db;