const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

const validateSignup = [
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

const validateLogin = [
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

  body("password").notEmpty().withMessage("Password can't be empty"),
];

const getSignupForm = (req, res) => {
  res.render("./auth/sign-up", {
    formData: {
      username: null,
      firstName: null,
      lastName: null,
    },
  });
};

const postSignupForm = [
  validateSignup,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("./auth/sign-up", {
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

const getLogin = (req, res) => {
  res.render("./auth/log-in", { username: null });
};

// const postLogin = (req, res, next) => {
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/",
//   })(req, res, next);
// };

const postLogin = [
  validateLogin,
  (req, res, next) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("./auth/log-in", {
        errors: errors.array(),
        username: req.body.username,
      });
    }
    next();
  },
  (req, res, next) => {
    const errors = validationResult(req);
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).render("./auth/log-in", {
          errors: [info],
          username: req.body.username,
        });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect("/");
      });
    })(req, res, next);
  },
];

const getLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

module.exports = {
  getSignupForm,
  postSignupForm,
  getLogin,
  postLogin,
  getLogout,
};
