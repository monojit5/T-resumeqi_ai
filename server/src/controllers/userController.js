import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import crypto from "crypto";
import bcrypt from 'bcrypt';
import sendOtpEmail from '../verify/userVerify.js';
import { redisClient } from '../config/redis.js';
import User from './../models/userSchema.js';


export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || typeof email !== "string" || !email.trim() || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const savedUser = await User.create({ name, email: normalizedEmail, password: hashedPassword });
        const otp = crypto.randomInt(100000, 1000000).toString();
        try {
            await redisClient.set(`otp:${normalizedEmail}`, otp, { EX: 600 });
            await sendOtpEmail(normalizedEmail, otp);
        } catch (deliveryError) {
            try {
                await redisClient.del(`otp:${normalizedEmail}`);
            } catch (cleanupError) {
                console.error("Error cleaning up registration OTP:", cleanupError);
            }
            try {
                await User.deleteOne({ _id: savedUser._id });
            } catch (cleanupError) {
                console.error("Error cleaning up unverified user:", cleanupError);
            }
            throw deliveryError;
        }
        return res.status(201).json({ message: "Otp sent successfully", user: savedUser });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Error registering user" });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (typeof email !== "string" || !email.trim() || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const storedOtp = await redisClient.get(`otp:${normalizedEmail}`);
        if (!storedOtp) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        if (storedOtp !== String(otp)) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        await redisClient.del(`otp:${normalizedEmail}`);
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        user.isverified = true;
        await user.save();
        return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ message: "Error verifying OTP" });
    }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found. Please register first.",
      });
    }

    if (user.isverified === true) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }
    const otp = crypto.randomInt(100000, 1000000).toString();

    
    await redisClient.set(
      `otp:${normalizedEmail}`,
      otp,
      { EX: 600 }
    );

    try {
      
      await sendOtpEmail(normalizedEmail, otp);
    } catch (emailError) {
      await redisClient.del(`otp:${normalizedEmail}`);
      throw emailError;
    }

    return res.status(200).json({
      success: true,
      message: "New OTP sent successfully",
    });

  } catch (error) {
    console.error("Resend OTP error:", error);

    return res.status(500).json({
      message: "Unable to resend OTP",
    });
  }
};

export const userLogin = async(req, res) => {
try {
   const { email, password } = req.body;
   if (typeof email !== "string" || !email.trim() || !password) {
       return res.status(400).json({ message: "Email and password are required" });
   }
   const normalizedEmail = email.trim().toLowerCase();
   const user = await User.findOne({ email: normalizedEmail });
   if (!user) {
       return res.status(400).json({ message: "User not found" });
   }
   const isMatch = await bcrypt.compare(password, user.password);
   if (!isMatch) {
       return res.status(400).json({ message: "Invalid credentials" });
   }
   if (user.isverified !== true) {
    return res.status(400).json({ message: "Email not verified. Please verify your email before logging in." });
   }
   const token = jwt.sign({ id: user._id }, process.env.SECRETE_KEY, { expiresIn: '1h' });
   user.isLoggedIn = true;
   user.token = token;
   await user.save();
   return res.status(200).json({ message: "Login successful", data: { user, token } });
} catch (error) {
   console.error("Error logging in user:", error);
   return res.status(500).json({ message: "Error logging in user" });
}
}