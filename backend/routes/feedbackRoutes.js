const express = require("express");
const router = express.Router();

const {
  getFeedbacks,
  addFeedback,
} = require("../controllers/feedbackController");

router.get("/", getFeedbacks);
router.post("/", addFeedback);

module.exports = router;