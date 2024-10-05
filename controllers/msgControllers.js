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
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("./message/new-message", {
          errors: errors.array(),
          isAuth: req.isAuthenticated(),
        });
      }
      await db.createMessage(req.body.message, req.user.id);
      res.redirect("/");
    } catch (error) {
      console.error("Error in postNewMessage controller", error);
      next(error);
    }
  },
];

const postDeleteMessage = async (req, res, next) => {
  try {
    await db.deleteMsg(req.params.id);
    res.redirect("/");
  } catch (error) {
    console.error("Error in postDeleteMessage controller", error);
    next(error);
  }
};

module.exports = { getNewMessage, postNewMessage, postDeleteMessage };
