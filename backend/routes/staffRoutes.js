const express = require("express");
const router = express.Router();

const {
  getStaffs,
  addStaff,
  updateStaff,
  deleteStaff,
} = require("../controllers/staffController");

router.get("/", getStaffs);

router.post("/", addStaff);

router.put("/:id", updateStaff);

router.delete("/:id", deleteStaff);

module.exports = router;