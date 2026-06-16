const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const logActivity = require("../utils/logActivity");
const createNotification = require("../utils/createNotification");
const prisma = new PrismaClient();

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });
await createNotification(
  `${user.name} logged in`
);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });

    // Log the registration activity
    // await logActivity(user.id, "REGISTER", "AUTH");

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );
const { password: _, ...safeUser } = user;
await logActivity(
  user.id,
  "LOGIN",
  "AUTH",
  `${user.name} logged in`
);
res.status(200).json({
  success: true,
  token,
  user: safeUser
});

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};