
import User from './../models/userSchema.js';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
export const userAuth = async(req, res, next) => {
try {
  const authHeader = req.headers.authorization;
  if (!authHeader ||!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({message:"authorization error"})
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({message:"authorization error"});
  }
  const decoded = jwt.verify(token, process.env.SECRETE_KEY);
  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(401).json({message:"authorization error"})
  }
  req.user = user;
  req.userId = user._id;
  next();
} catch (error) {
 if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
  return res.status(401).json({ message: "authorization error" });
 }
 console.error("Authentication check failed:", error.message);
 return res.status(500).json({ message: "Unable to verify authorization" });
}
};