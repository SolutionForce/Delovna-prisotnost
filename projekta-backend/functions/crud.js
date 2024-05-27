const express = require("express");
const router = express.Router();

router.get("/test1", (req, res) => {
  res.send("Hello World!");
});

router.get("/test2", (req, res) => {
  res.json({ status: "Working", timestamp: Date.now() });
});

module.exports = router;