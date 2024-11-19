const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

function verifyToken(req, res, next) {
  const token = req.header("Authorization").split(" ")[1];
  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Access denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid token" });
  }
}

function verifyEmployeeRole(req, res, next) {
  if (req.user.role !== "EMPLOYEE") {
    return res.status(StatusCodes.FORBIDDEN).json({ error: "Access denied" });
  }
  next();
}

module.exports = { verifyToken, verifyEmployeeRole };
