const express = require("express");
const router = express.Router();
const { PrismaClient } =
require("@prisma/client");

const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const notifications =
    await prisma.notification.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 30,
    });

  res.json(notifications);
});

router.put("/:id/read",
async (req, res) => {

  await prisma.notification.update({
    where: {
      id: Number(req.params.id),
    },
    data: {
      isRead: true,
    },
  });

  res.json({
    success: true,
  });
});

module.exports = router;