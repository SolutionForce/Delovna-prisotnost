const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const express = require("express");
const app = express();
app.use(express.json());

const crud = require("./crud");
app.use("/", crud);

exports.api = functions.https.onRequest(app);
