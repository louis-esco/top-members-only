const pool = require("./pool");
const bcrypt = require("bcryptjs");

async function getMessages() {
  try {
    const { rows } = await pool.query(`
    SELECT messages.id, messages.message, messages.created_at, CONCAT_WS(' ', users.first_name, users.last_name) AS author
    FROM messages
    LEFT JOIN users ON users.id = messages.user_id;
    `);
    return rows;
  } catch (error) {
    console.error("Error getting messages from db", error);
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    return rows;
  } catch (error) {
    console.error("Error getting user by username in db", error);
    throw error;
  }
}

async function getUserById(user_id) {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      user_id,
    ]);
    return rows;
  } catch (error) {
    console.error("Error getting user by id in db", error);
    throw error;
  }
}

async function createUser(username, password, firstName, lastName, admin) {
  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (username, password, first_name, last_name, admin)
        VALUES
        ($1, $2, $3, $4, $5)`,
      [username, hash, firstName, lastName, admin]
    );
  } catch (error) {
    console.error("Error creating user in db", error);
    throw error;
  }
}

async function createMessage(message, user) {
  try {
    await pool.query(
      `INSERT INTO messages (message, user_id)
        VALUES
        ($1, $2)
        `,
      [message, user]
    );
  } catch (error) {
    console.error("Error creating message in db", error);
    throw error;
  }
}

async function deleteMsg(msg_id) {
  try {
    await pool.query(`DELETE FROM messages WHERE id = $1`, [msg_id]);
  } catch (error) {
    console.error("Error deleting message in db", error);
    throw error;
  }
}

async function becomeMember(user_id) {
  try {
    await pool.query(
      `UPDATE users
        SET member = $1
        WHERE id = $2`,
      [true, user_id]
    );
  } catch (error) {
    console.error("Error converting user to member", error);
    throw error;
  }
}

module.exports = {
  getMessages,
  getUserByUsername,
  getUserById,
  createUser,
  createMessage,
  deleteMsg,
  becomeMember,
};
