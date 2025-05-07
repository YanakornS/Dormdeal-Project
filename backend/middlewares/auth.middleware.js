const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Access Forbidden!!" });
    }
    //แก้ไขโดยkays
    req.user = {
      id: decoded.id,
      displayName: decoded.displayName,
      role: decoded.role,
    
      
    };
    req.userId = decoded.id;

    next();
  });
};

const isMod = (req, res, next) => {
  if (!req.user || req.user.role !== "mod") {
    return res.status(403).json({ message: "Require Mod Role" });
  }
  next();
};

const authJwt = {
  verifyToken,
  isMod
};

module.exports = authJwt;
