const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const logActivity = async (
  userId,
  action,
  module,
  details = ""
) => {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        module,
        details
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = logActivity;