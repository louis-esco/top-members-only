const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const pool = require("./db/pool");
const router = require("./routes/router");
const pgSession = require("connect-pg-simple")(session);
require("dotenv").config();
require("./config/passport");

const PORT = process.env.PORT || 3000;
const app = express();
const sessionStore = new pgSession({
  pool: pool,
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 25,
    },
  })
);
app.use(passport.session());

app.use("/", router);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(PORT, () => console.log(`listening on port ${PORT}!`));
