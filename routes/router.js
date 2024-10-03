const express = require("express");
const indexControllers = require("../controllers/indexControllers");

const router = express.Router();

router.get("/", indexControllers.getMessages);

module.exports = router;
