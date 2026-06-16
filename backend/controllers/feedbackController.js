const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getFeedbacks = async (req, res) => {
  const feedbacks = await prisma.feedback.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  res.json(feedbacks);
};

exports.addFeedback = async (req, res) => {
  const feedback = await prisma.feedback.create({
    data: req.body,
  });

  res.json(feedback);
};