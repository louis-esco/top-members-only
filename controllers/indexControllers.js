const db = require("../db/queries");

const getMessages = async (req, res, next) => {
  try {
    const messages = await db.getMessages();
    const user = req.user ? await db.getUserById(req.user.id) : [null];
    const isMember = user[0] ? user[0].member : false;
    const isAdmin = user[0] ? user[0].admin : false;
    res.render("index", {
      messages: messages,
      isAuth: req.isAuthenticated(),
      isMember: isMember,
      isAdmin: isAdmin,
    });
  } catch (error) {
    console.error("Error in getMessages controller", error);
    next(error);
  }
};

module.exports = {
  getMessages,
};
