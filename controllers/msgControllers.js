const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const validateMsg = [
  body("message").trim().notEmpty().withMessage("Your message can't be empty"),
];

const getNewMessage = (req, res) => {
  res.render("./message/new-message", {
    isAuth: req.isAuthenticated(),
  });
};

const postNewMessage = [
  validateMsg,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("./message/new-message", {
        errors: errors.array(),
        isAuth: req.isAuthenticated(),
      });
    }
    await db.createMessage(req.body.message, req.user.id);
    res.redirect("/");
  },
];

module.exports = { getNewMessage, postNewMessage };
