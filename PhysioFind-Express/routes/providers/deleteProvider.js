var express = require("express");
var router = express.Router();

/**
 * DELETE /providers/:id
 * Delete a provider by ID
 */
router.delete("/:id", function (req, res, next) {
  try {
    const providerId = req.params.id;

    // TODO: Add database delete logic
    // TODO: Return success message

    res.json({ message: "Provider deleted", providerId: providerId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
