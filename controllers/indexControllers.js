const db = require("../db/queries");

const getMessages = async (req, res) => {
  const messages = await db.getMessages();
  const user = await db.getUserById(req.user.id);
  const isMember = user[0] ? user[0].member : false;
  const isAdmin = user[0] ? user[0].admin : false;
  res.render("index", {
    messages: messages,
    isAuth: req.isAuthenticated(),
    isMember: isMember,
    isAdmin: isAdmin,
  });
};

module.exports = {
  getMessages,
};
