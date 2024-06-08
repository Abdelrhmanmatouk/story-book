const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const Handlebars = require('handlebars')
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")
const connectDB = require("./config/db");

// load config
dotenv.config({ path: "./config.env" });

// passport config
require("./config/passport")(passport);

connectDB();

const app = express();

// body parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//handlebars

app.engine(".hbs", exphbs.engine({ defaultLayout: "main", extname: ".hbs" , handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set("view engine", ".hbs");

// sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongoUrl: process.env.MONGO_URI}),
  })
);

// passport middleware

app.use(passport.initialize());
app.use(passport.session());

// static

app.use(express.static(path.join(__dirname, "public")));

// Routes

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const port = process.env.PORT || 5000;
app.listen(
  port,
  console.log(`app is running in ${process.env.NODE_ENV} mode on port ${port}`)
);
