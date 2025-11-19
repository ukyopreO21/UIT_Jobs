import mysql from "mysql2/promise";

const dbConfig = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "uit_jobs",
};

const db = mysql.createPool(dbConfig);

export default db;
