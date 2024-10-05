const pool = require("./pool");
const bcrypt = require("bcryptjs");

async function getMessages() {
  const { rows } = await pool.query(`
    SELECT messages.id, messages.message, messages.created_at, CONCAT_WS(' ', users.first_name, users.last_name) AS author
    FROM messages
    LEFT JOIN users ON users.id = messages.user_id;
    `);
  return rows;
}

async function getUserByUsername(username) {
  const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return rows;
}

async function getUserById(user_id) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
    user_id,
  ]);
  return rows;
}

async function createUser(username, password, firstName, lastName, admin) {
  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      console.log("There was an error:", err);
      return err;
    }
    await pool.query(
      `INSERT INTO users (username, password, first_name, last_name, admin)
        VALUES
        ($1, $2, $3, $4, $5)`,
      [username, hash, firstName, lastName, admin]
    );
  });
}

async function createMessage(message, user) {
  await pool.query(
    `INSERT INTO messages (message, user_id)
        VALUES
        ($1, $2)
        `,
    [message, user]
  );
}

async function becomeMember(user_id) {
  await pool.query(
    `UPDATE users
        SET member = $1
        WHERE id = $2`,
    [true, user_id]
  );
}

module.exports = {
  getMessages,
  getUserByUsername,
  getUserById,
  createUser,
  createMessage,
  becomeMember,
};
