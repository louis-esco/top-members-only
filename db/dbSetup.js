#! /usr/bin/env node

const { Client } = require("pg");
require("dotenv").config();

const setupQuery = `
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   username VARCHAR (255),
   password VARCHAR (255),
   first_name VARCHAR (255),
   last_name VARCHAR (255),
   member BOOLEAN DEFAULT FALSE,
   admin BOOLEAN DEFAULT FALSE
);
   
CREATE TABLE IF NOT EXISTS messages (
   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   message VARCHAR,
   user_id INTEGER,
   created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE messages 
ADD CONSTRAINT fk_users_messages
FOREIGN KEY (user_id) REFERENCES users (id)
ON DELETE SET NULL;
`;

async function runQuery() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DB_URL,
  });
  await client.connect();
  await client.query(setupQuery);
  await client.end();
  console.log("done");
}

runQuery();
