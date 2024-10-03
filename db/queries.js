const pool = require("./pool");
const bcrypt = require("bcryptjs");

async function getMessages() {
  const { rows } = await pool.query("SELECT * FROM messages");
  return rows;
}

async function getUser(user) {
  const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [
    user,
  ]);
  return rows;
}

async function createUser(username, password, firstName, lastName) {
  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      console.log("There was an error:", err);
      return err;
    }
    await pool.query(
      `INSERT INTO users (username, password, first_name, last_name)
        VALUES
        ($1, $2, $3, $4)`,
      [username, hash, firstName, lastName]
    );
  });
}

module.exports = {
  getMessages,
  getUser,
  createUser,
};
