import { User } from "../models/user.model.js";
import httpStatus from "http-status";
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please provide all credentials" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User not found" });
    }
    // bcrypt.compare():this method internally changed plain text to hashed then compare
    if (await bcrypt.compare(password, user.password)) {
      let token = crypto.randomBytes(20).toString("hex");
      user.token = token;
      await user.save();
      return res.status(httpStatus.OK).json({ token: token }); // token send to frontend
    } else {
      return res
        .status(httpStatus.OK)
        .json({ message: "Invalid username or password" });
    }
  } catch (error) {
    return res.status(500).json({ message: `Something went wrong${error}` });
  }
};

const register = async (req, res) => {
  const { name, username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      // it's called early return statement
      return res
        .status(httpStatus.FOUND)
        .json({ message: "User exists already" });
    }

    // password ko 10 baar encrypt kiya ja raha hai for strong security
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      username: username,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(httpStatus.CREATED).json({ message: "User registered" });
  } catch (error) {
    return res.json(`Something went wrong ${error}`);
  }
};

export { register, login };
