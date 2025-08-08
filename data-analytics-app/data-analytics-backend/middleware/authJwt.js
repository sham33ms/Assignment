const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifyToken = (req, res, next) => {
  let token =  req.headers["authorization"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  // If token is in "Bearer <token>" format, extract the token part
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // console.error("[DEBUG] Token verification failed:", err.message);
      return res.status(401).send({ message: "Unauthorized! Invalid Token." });
    }

    // --- ADDED DEBUG LOG ---
    // console.log("[DEBUG] Token verified successfully. Decoded User ID:", decoded.id);
    req.userId = decoded.id;
    next();
  });
};

module.exports = { verifyToken };