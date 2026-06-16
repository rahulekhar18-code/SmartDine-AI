const logActivity = require("../utils/logActivity");
const { PrismaClient } = require("@prisma/client");
const createNotification = require("../utils/createNotification");

const prisma = new PrismaClient();

exports.createTable = async (req, res) => {
  try {
    const { tableNo, capacity, status } = req.body;

    const table = await prisma.table.create({
      data: {
        tableNo,
        capacity,
        status,
      },
    });
    // ye code se notifification bhi jayegi jab table create hoga aur activity bhi log hogi
    await createNotification(
  `Table ${table.tableNo} created`,
  "SUCCESS"
);

    await logActivity(
      req.user.id,
      "CREATE",
      "TABLE",
      `Created table ${table.tableNo}`,
    );

    res.status(201).json({
      success: true,
      table,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



exports.getTables = async (req, res) => {
  try {
    const tables = await prisma.table.findMany();

    res.status(200).json({
      success: true,
      tables,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.updateTable = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await prisma.table.update({
      where: {
        id: Number(id),
      },
      data: req.body,
    });
// ye code se notifification bhi jayegi jab table update hoga aur activity bhi log hogi
    await createNotification(
  `Table ${table.tableNo} updated`,
  "INFO"
);

    await logActivity(
      req.user.id,
      "UPDATE",
      "TABLE",
      `Updated table ${table.tableNo}`,
    );

    res.status(200).json({
      success: true,
      table,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
};

exports.deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await prisma.table.delete({
      where: {
        id: Number(id),
      },
    });
    // ye code se notifification bhi jayegi jab table delete hoga aur activity bhi log hogi
    await createNotification(
  `Table ${table.tableNo} deleted`,
  "DELETE"
);

    await logActivity(
      req.user.id,
      "DELETE",
      "TABLE",
      `Deleted table ${table.tableNo}`,
    );

    res.status(200).json({
      success: true,
      message: "Table Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
};
