import "reflect-metadata";
import express from "express";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import lusca from "lusca";
import path from "path";
import mongoose from "mongoose";
import { MONGODB_URI } from "./util/secrets";
import * as apiController from "./controllers/cache-api";

const morgan = require('morgan');


// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = global.Promise;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true ,useFindAndModify:true} ).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    // process.exit();
});
mongoose.set('debug', true);

// Express configuration
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "hbs");
app.use(compression());
var allowCrossDomain = function (req:any, res:any, next:any) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,x-access-token');
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  }
  else {
    next();
  }
}

app.use(allowCrossDomain);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms')
);

app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use(
    express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

/**
 * API routes.
 */
app.use(apiController.router);



export default app;
