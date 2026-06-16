const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createNotification(message, type) {

  const notification =
    await prisma.notification.create({
      data: {
        message,
        type
      }
    });

  if (global.io) {
    global.io.emit(
      "new-notification",
      notification
    );
  }

  return notification;
}

module.exports = createNotification;