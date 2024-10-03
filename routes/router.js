const express = require("express");
const indexControllers = require("../controllers/indexControllers");
const authControllers = require("../controllers/authControllers");

const router = express.Router();

router.get("/", indexControllers.getMessages);

router.get("/sign-up", authControllers.getSignupForm);
router.post("/sign-up", authControllers.postSignupForm);

module.exports = router;
