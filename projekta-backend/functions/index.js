/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const express = require("express");
const app = express();

// Middleware to handle JSON requests
app.use(express.json());

// Hello World route
app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

// GET route to check if it's working
app.get("/check", (req, res) => {
  res.json({ status: "Working", timestamp: Date.now() });
});

// Export the Express app as a Firebase function
exports.api = functions.https.onRequest(app);
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
