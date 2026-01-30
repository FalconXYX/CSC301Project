require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// Load configuration
var serverConfig = require("./config/server");
var constants = require("./config/constants");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, serverConfig.viewsPath));
app.set("view engine", serverConfig.viewEngine);

app.use(logger(serverConfig.logFormat));
app.use(express.json());
app.use(express.urlencoded(serverConfig.middleware.urlEncoded));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, serverConfig.publicPath)));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
