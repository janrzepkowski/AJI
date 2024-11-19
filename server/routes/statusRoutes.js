const express = require("express");
const router = express.Router();
const Status = require("../models/status");

router.get("/", (req, res) => {
  Status.find({}).then((statuses) => {
    res.json(statuses);
  });
});

module.exports = router;
