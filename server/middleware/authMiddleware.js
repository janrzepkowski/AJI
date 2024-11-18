const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

function verifyToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded._id;
    next();
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid token" });
  }
}

module.exports = verifyToken;
