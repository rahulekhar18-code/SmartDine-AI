const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getStaffs = async (req, res) => {
  try {
    const staffs = await prisma.staff.findMany({
      orderBy: {
        id: "desc",
      },
    });

    res.json(staffs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.addStaff = async (req, res) => {
  try {
    const { name, position, phone, whatsapp } =
      req.body;

    const staff = await prisma.staff.create({
      data: {
        name,
        position,
        phone,
        whatsapp,
      },
    });

    res.json(staff);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, position, phone, whatsapp } =
      req.body;

    const staff = await prisma.staff.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        position,
        phone,
        whatsapp,
      },
    });

    res.json(staff);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.staff.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      message: "Staff Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};