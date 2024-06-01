const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const connectDB = require("./config/db");


// load config
dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//handlebars

app.engine('.hbs', exphbs.engine({defaultLayout:'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

const port = process.env.PORT || 5000;
app.listen(
  port,
  console.log(`app is running in ${process.env.NODE_ENV} mode on port ${port}`)
);
