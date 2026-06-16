const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const logActivity = require("../utils/logActivity");
const createNotification = require("../utils/createNotification");

exports.createReservation = async (req, res) => {
  try {
    const { customerName, phone, reservationTime, status } = req.body;

    const reservation = await prisma.reservation.create({
      data: {
        customerName,
        phone,
        reservationTime: new Date(reservationTime),
        status,
      },
    });
    // ye code se notifification bhi jayegi jab reservation create hoga aur activity bhi log hogi
    await createNotification(`New reservation by ${customerName}`, "SUCCESS");

    await logActivity(
      req.user.id,
      "CREATE",
      "RESERVATION",
      `Created reservation for ${customerName} at ${reservationTime}`,
    );
    res.status(201).json({
      success: true,
      reservation,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getReservations = async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany();

    res.status(200).json({
      success: true,
      reservations,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerName, phone, reservationTime, status } = req.body;

    const reservation = await prisma.reservation.update({
      where: {
        id: Number(id),
      },
      data: {
        customerName,
        phone,
        reservationTime: new Date(reservationTime),
        status,
      },
    });

    // ye code se notifification bhi jayegi jab reservation update hoga aur activity bhi log hogi
    await createNotification(`Reservation updated for ${customerName}`, "INFO");

    await logActivity(
      req.user.id,
      "UPDATE",
      "RESERVATION",
      `Updated reservation of ${customerName}`,
    );

    res.status(200).json({
      success: true,
      reservation,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation =
await prisma.reservation.findUnique({
  where: {
    id: Number(id)
  }
});
    await prisma.reservation.delete({
      where: {
        id: Number(id),
      },
    });

// ye code se jo delete ke pahale fetch karenga aur uske baad notification bhejega
await createNotification(
  `Reservation of ${reservation.customerName} cancelled`,
  "DELETE"
);
    await logActivity(
      req.user.id,
      "DELETE",
      "RESERVATION",
      `Deleted reservation`,
    );
    res.status(200).json({
      success: true,
      message: "Reservation Deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
