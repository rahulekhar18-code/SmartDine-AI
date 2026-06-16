const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getDashboardStats = async (req, res) => {
  try {

    const totalUsers = await prisma.user.count();

    const totalMenuItems = await prisma.menuItem.count();

    const totalReservations = await prisma.reservation.count();
const bookedCount =
  await prisma.reservation.count({
    where: {
      status: "BOOKED"
    }
  });

const confirmedCount =
  await prisma.reservation.count({
    where: {
      status: "CONFIRMED"
    }
  });

const pendingCount =
  await prisma.reservation.count({
    where: {
      status: "PENDING"
    }
  });
    const totalInventoryItems = await prisma.inventory.count();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalMenuItems,
        totalReservations,
        totalInventoryItems,

          bookedCount,
    confirmedCount,
    pendingCount
      }
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};