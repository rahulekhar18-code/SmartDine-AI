const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const sendOtpMail = require("../utils/sendOtp");


const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await prisma.otpVerification.create({
      data: {
        email,
        otp,
        expiresAt: new Date(
          Date.now() + 5 * 60 * 1000
        )
      }
    });

    await sendOtpMail(email, otp);

    res.json({
      success: true,
      message: "OTP Sent"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to send OTP"
    });
  }
};


const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await prisma.otpVerification.findFirst({
      where: {
        email,
        otp
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (new Date() > record.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired"
      });
    }

    res.json({
      success: true,
      message: "OTP Verified"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Verification Failed"
    });
  }
};
module.exports = {
  sendOtp,
  verifyOtp
};