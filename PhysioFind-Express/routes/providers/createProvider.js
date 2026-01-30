var express = require("express");
var router = express.Router();

/**
 * POST /providers
 * Create a new provider
 */
router.post("/", function (req, res, next) {
  try {
    // TODO: Add validation
    // TODO: Add database logic
    // TODO: Return created provider

    res.status(201).json({ message: "Provider created" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
