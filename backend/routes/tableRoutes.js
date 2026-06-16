const express = require("express");

const router = express.Router();
const {
  verifyAdminOrManager
} = require("../middleware/authMiddleware");

const {
  createTable,
  getTables,
  updateTable,
  deleteTable
} = require("../controllers/tableController");

router.post("/", verifyAdminOrManager, createTable);

router.get("/", getTables);

router.put(
  "/:id",
  verifyAdminOrManager,
  updateTable
);

router.delete(
  "/:id",
  verifyAdminOrManager,
  deleteTable
);

module.exports = router;