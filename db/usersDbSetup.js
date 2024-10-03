#! /usr/bin/env node

const { Client } = require("pg");
require("dotenv").config();

const setupQuery = `
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   username VARCHAR (255),
   password VARCHAR (255)
)`;

async function runQuery() {
  console.log("seeding...");
  console.log("Connecting to", process.env.DB_URL);
  const client = new Client({
    connectionString: process.env.DB_URL,
  });
  await client.connect();
  await client.query(setupQuery);
  await client.end();
  console.log("done");
}

runQuery();
