const { PrismaClient } = require("@prisma/client");
const logActivity = require("../utils/logActivity");
const prisma = new PrismaClient();
const createNotification =
require("../utils/createNotification");

exports.createInventory = async (req, res) => {
  try {
const itemName = req.body.itemName;
const quantity = Number(req.body.quantity);
const threshold = Number(req.body.threshold);
    const item = await prisma.inventory.create({
      data: {
        itemName,
        quantity,
        threshold
      }
    });

    res.status(201).json({
      success: true,
      item
    });
    await createNotification(
  `${itemName} added to inventory`,
  "SUCCESS"
);
if (quantity <= threshold) {
  await createNotification(
    `⚠ Low stock: ${itemName} (${quantity} left)`,
    "WARNING"
  );
}
await logActivity(
  req.user.id,
  "CREATE",
  "INVENTORY",
  `Added ${itemName}`
);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

exports.getInventory = async (req, res) => {
  try {
    const inventory = await prisma.inventory.findMany();

    res.status(200).json({
      success: true,
      inventory
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
exports.updateInventory = async (req, res) => {
  try {

    const { id } = req.params;
    const itemName = req.body.itemName;
    const quantity = Number(req.body.quantity);
    const threshold = Number(req.body.threshold);

    const inventory = await prisma.inventory.update({
      where: {
        id: Number(id)
      },
      data: {
        itemName,
        quantity,
        threshold
      }
    });
    await createNotification(
  `${itemName} updated`,
  "INFO"
);
if (quantity <= threshold) {
  await createNotification(
    `⚠ Low stock: ${itemName} (${quantity} left)`,
    "WARNING"
  );
}

if (quantity === 0) {
  await createNotification(
    `🚨 Out of stock: ${itemName}`,
    "DANGER"
  );
}
    await logActivity(
  req.user.id,
  "UPDATE",
  "INVENTORY",
  `Updated ${itemName}`
);

    res.status(200).json({
      success: true,
      inventory
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

exports.deleteInventory = async (req, res) => {
  try {

    const { id } = req.params;
    const item = await prisma.inventory.findUnique({
  where: {
    id: Number(id)
  }
});


    await prisma.inventory.delete({
      where: {
        id: Number(id)
      }
    });
    await createNotification(
  ` ${item.itemName} deleted from inventory`,
  "DELETE"
);

    await logActivity(
  req.user.id,
  "DELETE",
  "INVENTORY",
  `Deleted ${item.itemName}`
);

    res.status(200).json({
      success: true,
      message: "Inventory Deleted"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};