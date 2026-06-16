const logActivity = require("../utils/logActivity");
const { PrismaClient } = require("@prisma/client");
const createNotification = require("../utils/createNotification");
const prisma = new PrismaClient();

// Add Menu Item
exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl } = req.body;
   

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price,
        category,
        imageUrl,
      },
    });

    // ye code se notifification bhi jayegi jab menu item add hoga aur activity bhi log hogi
    await createNotification(`${name} added to menu`, "SUCCESS");

    await logActivity(req.user.id, "CREATE", "MENU", `Added ${name}`);
    res.status(201).json({
      success: true,
      menuItem,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get All Menu Items
exports.getAllMenuItems = async (req, res) => {
  try {
    const items = await prisma.menuItem.findMany();

    res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const existingItem = await prisma.menuItem.findUnique({
      where: {
        id: Number(id),
      },
    });
    
    const updatedItem = await prisma.menuItem.update({
      where: {
        id: Number(id),
      },
      data: req.body,
    });
// ye code se notifification bhi jayegi jab menu item update hoga aur activity bhi log hogi
    await createNotification(
  `${updatedItem.name} updated`,
  "INFO"
);

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Menu Item Not Found",
      });
    }

    await logActivity(
      req.user.id,
      "UPDATE",
      "MENU",
      `Updated ${updatedItem.name}`,
    );
    res.status(200).json({
      success: true,
      updatedItem,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    // ye code se notifiacation ke lliye jo delete ke pahale fetcxh karenga
    
    

const item = await prisma.menuItem.delete({
  where: {
    id: Number(id)
  }
});
await createNotification(
  `${item.name} deleted`,
  "DELETE"
);
    await logActivity(req.user.id, "DELETE", "MENU", `Deleted ${item.name}`);

    res.status(200).json({
      success: true,
      message: "Menu Item Deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
