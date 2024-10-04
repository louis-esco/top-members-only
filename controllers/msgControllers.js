const db = require("../db/queries");

const getNewMessage = (req, res) => {
  res.render("./message/new-message");
};

module.exports = { getNewMessage };
