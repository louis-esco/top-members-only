const express = require("express");
const indexControllers = require("../controllers/indexControllers");
const authControllers = require("../controllers/authControllers");
const msgControllers = require("../controllers/msgControllers");
const passport = require("passport");

const router = express.Router();

router.get("/", indexControllers.getMessages);

router.get("/sign-up", authControllers.getSignupForm);
router.post("/sign-up", authControllers.postSignupForm);

router.get("/log-in", authControllers.getLogin);
router.post("/log-in", authControllers.postLogin);

router.get("/log-out", authControllers.getLogout);

router.get("/new-message", msgControllers.getNewMessage);
router.post("/new-message", msgControllers.postNewMessage);

module.exports = router;
