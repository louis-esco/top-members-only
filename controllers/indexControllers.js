const db = require("../db/queries");

const getMessages = async (req, res) => {
  const messages = await db.getMessages();
  res.render("index", { messages: messages });
};

module.exports = {
  getMessages,
};
