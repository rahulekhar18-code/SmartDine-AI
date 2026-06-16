const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  verifyAdminOrManager
} = require("../middleware/authMiddleware");

router.get(
  "/",
  verifyAdminOrManager,
  async (req, res) => {

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Only Admin can view logs"
      });
    }

    const logs = await prisma.activityLog.findMany({
      include: {
        user: {
          select: {
            name: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 50
    });

    res.json(logs);
  }
);

module.exports = router;