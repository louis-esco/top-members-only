const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const validateUser = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username can't be empty")
    .isAlphanumeric()
    .withMessage("Username must only contain letters and numbers")
    .custom(async (value) => {
      const user = await db.getUser(value);
      if (user[0]) {
        throw new Error("This username is not available");
      }
    }),
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name can't be empty")
    .isAlpha()
    .withMessage("First name must contain only letters"),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name can't be empty")
    .isAlpha()
    .withMessage("Last name must contain only letters"),
  body("password").notEmpty().withMessage("Password can't be empty"),
  body("passwordConfirmation")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords don't match"),
];

const getSignupForm = async (req, res) => {
  res.render("sign-up");
};

const postSignupForm = [
  (req, res, next) => {
    console.log(req.body.password);
    console.log(req.body.passwordConfirmation);
    next();
  },
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up", {
        errors: errors.array(),
        formData: {
          username: req.body.username,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        },
      });
    }
    await db.createUser(
      req.body.username,
      req.body.password,
      req.body.firstName,
      req.body.lastName
    );
    res.redirect("/");
  },
];

module.exports = {
  getSignupForm,
  postSignupForm,
};
