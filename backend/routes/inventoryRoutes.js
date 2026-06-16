const express = require("express");

const router = express.Router();

const {
  verifyAdminOrManager
} = require("../middleware/authMiddleware");

const {
  createInventory,
  getInventory,
  updateInventory,
  deleteInventory
} = require("../controllers/inventoryController");

router.post(
  "/",
  verifyAdminOrManager,
  createInventory
);

router.get("/", getInventory);

router.put(
  "/:id",
  verifyAdminOrManager,
  updateInventory
);

router.delete(
  "/:id",
  verifyAdminOrManager,
  deleteInventory
);

module.exports = router;