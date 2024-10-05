const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

const validatePasscode = [
  body("passcode")
    .trim()
    .notEmpty()
    .withMessage("Passcode can't be empty")
    .custom((value) => {
      return value === process.env.SECRET_PASSCODE;
    })
    .withMessage("Wrong passcode"),
];

const getMembership = (req, res) => {
  res.render("member", {
    isAuth: req.isAuthenticated(),
  });
};

const postMembership = [
  validatePasscode,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("member", {
        errors: errors.array(),
        isAuth: req.isAuthenticated(),
      });
    }
    await db.becomeMember(req.user.id);
    res.redirect("/");
  },
];

module.exports = { getMembership, postMembership };
