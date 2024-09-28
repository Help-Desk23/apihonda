const express = require("express");
const sql = require("mssql");


require("dotenv").config();

const db = {
    server: process.env.SERVER,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

const app = express();

module.exports = {
    db,
    sql
};