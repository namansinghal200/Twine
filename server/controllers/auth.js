import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      avatar,
    });
    const savedUser = await user.save();
    return res.status(201).json({ user: savedUser });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("User not found");

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json("Wrong credentials");
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
    const { password: pwd, ...userRes } = user._doc;
    return res
      .status(201)
      .cookie("token", { token }, { httpOnly: true })
      .json({ user: userRes });
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    return res.status(201).json({ name: user.name, avatar: user.avatar });
  } catch (error) {
    next(error);
  }
};
