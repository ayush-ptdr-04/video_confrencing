import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, Required: true },
  username: { type: String, Required: true, unique: true },
  password: { type: String, Required: true, unique: true },
  token: { type: String },
});

const User = mongoose.model("User", userSchema);
export { User };
