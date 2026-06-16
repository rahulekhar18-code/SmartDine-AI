const express = require("express");

const router = express.Router();

const {
  verifyAdminOrManager
} = require("../middleware/authMiddleware");

const {
  createReservation,
  getReservations,
  updateReservation,
  deleteReservation
} = require("../controllers/reservationController");

router.post(
  "/",
  verifyAdminOrManager,
  createReservation
);

router.get("/", getReservations);

router.put(
  "/:id",
  verifyAdminOrManager,
  updateReservation
);

router.delete(
  "/:id",
  verifyAdminOrManager,
  deleteReservation
);

module.exports = router;