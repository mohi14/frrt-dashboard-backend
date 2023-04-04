const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const env = require("dotenv").config();
let cookieParser = require("cookie-parser");
// let redis = require('redis');
let flash = require("connect-flash");
let session = require("express-session");
// let redisStore = require('connect-redis')(session);
// let client = redis.createClient();
const bodyParser = require("body-parser");
const path = require("path");
const methodOverride = require("method-override");
const app = express();
app.use(cors());
let api_route = require("./routes/api_route");
let admin_route = require("./routes/admin_route");

const systemConfig = require("./routes/system_configuration");

// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');

// app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
// app.use(session({
//     secret:"1234567890",
//     cookie: {maxAge: 2592000000},
//     // create new redis store 30 days = 2592000 seconds.
//     store: new redisStore({host: 'localhost', port: 6379, client: client, ttl: 2592000}),
//     resave: true,
//     saveUninitialized: true
// }));
app.use(flash());

app.use(
  bodyParser.urlencoded({
    limit: "500mb",
    extended: true,
    parameterLimit: 1000000,
  })
);
app.use(bodyParser.json({ limit: "500mb", extended: true }));
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,Content-type,Accept"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

const URI = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@fra-art.itwwvlx.mongodb.net/FraArt?retryWrites=true&w=majority`;
mongoose.connect(
  URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  async function (err, db) {
    let d = new Date();
    if (err) {
      console.log(
        "[" +
          d.toLocaleString() +
          "] " +
          "Sorry, there is no mongo db server running."
      );
    } else {
      let attachDB = function (req, res, next) {
        req.db = db;
        next();
      };
      app.use("/api", attachDB, api_route);
      app.use("/api/system-config", systemConfig);
      app.use("/admin-api", attachDB, admin_route);
      app.get("/*", (req, res) => {
        // res.sendFile(path.join(__dirname, 'build', 'index.html'));
        res.json("Files are working");
      });
      app.listen(process.env.PORT, async function () {
        console.log(
          "[" +
            d.toLocaleString() +
            "] " +
            "Server listening " +
            process.env.BASE_URL
        );
      });
    }
  }
);
