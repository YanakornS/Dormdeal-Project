const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Access Forbidden!!" });
    req.userId = decoded.id
    req.displayName = decoded.displayName; 
    req.role = decoded.role;
    
    //เพิ่มโดยOxe ถ้าไม่ต้องการให้เพิ่ม wishlist ได้ต้องเพิ่มตรงนี้
    // req.wishlist = decoded.wishlist;
    req.user = {
      id: decoded.id,
      displayName: decoded.displayName,
      role: decoded.role,
    };

    next();
  });
};

isMod = (req, res, next) => {
  if (req.role !== "mod") {
    return res.status(403).json({ message: "Require Mod Role" });
  }
  next();
};
isAdmin = (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Require Admin Role" });
  }
  next();
};

const authJwt = {
  verifyToken,
  isMod,
  isAdmin
};

module.exports = authJwt;