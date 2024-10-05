const express = require("express");
const indexControllers = require("../controllers/indexControllers");
const authControllers = require("../controllers/authControllers");
const msgControllers = require("../controllers/msgControllers");
const memberControllers = require("../controllers/memberControllers");
const passport = require("passport");

const router = express.Router();

// Public routes
router.get("/", indexControllers.getMessages);

router.get("/sign-up", authControllers.getSignupForm);
router.post("/sign-up", authControllers.postSignupForm);

router.get("/log-in", authControllers.getLogin);
router.post("/log-in", authControllers.postLogin);

router.get("/log-out", authControllers.getLogout);

// Protected routes
router.use(authControllers.isAuth);

router.get("/new-message", msgControllers.getNewMessage);
router.post("/new-message", msgControllers.postNewMessage);

router.get("/member", memberControllers.getMembership);
router.post("/member", memberControllers.postMembership);

module.exports = router;
