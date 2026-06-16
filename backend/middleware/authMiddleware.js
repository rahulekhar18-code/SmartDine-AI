const jwt = require("jsonwebtoken");

exports.verifyAdminOrManager = (req, res, next) => {

  const authHeader =
    req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No Token"
    });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // console.log("ROLE =", decoded.role);

    if (
      decoded.role !== "ADMIN" &&
      decoded.role !== "MANAGER"
    ) {
      return res.status(403).json({
        message: "Access Denied"
      });
    }

    req.user = decoded;

    next();

  } catch (err) {

    console.log(err);

    return res.status(401).json({
      message: "Invalid Token"
    });

  }

};