import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
 name: {
  type: String,
  required: true,
    trim: true,
    minLength: 3,
    maxLength: 20,
 },
    email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'],
  },
password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 100,
  },
  isverified: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
    default: null,
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  profileImage: {
    type: String,
    default: null,
  },
},{timestamps:true});
const User = mongoose.model("User", userSchema);
export default User;