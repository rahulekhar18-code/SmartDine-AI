const {
  verifyAdminOrManager
} = require("../middleware/authMiddleware");

const express = require("express");

const router = express.Router();

const {
  createMenuItem,
  getAllMenuItems,
  deleteMenuItem,
  updateMenuItem,
} = require("../controllers/menuController");

// Create Menu Item
router.post(
  "/",
  verifyAdminOrManager,
  createMenuItem
);

// Get All Menu Items
router.get(
  "/",
  getAllMenuItems
);

// Update Menu Item
router.put(
  "/:id",
  verifyAdminOrManager,
  updateMenuItem
);

// Delete Menu Item
router.delete(
  "/:id",
  verifyAdminOrManager,
  deleteMenuItem
);

module.exports = router;