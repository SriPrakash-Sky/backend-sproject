import User from "../models/users.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hash_password = await bcrypt.hash(password, 8);
    await User.create({ name, email, password: hash_password, role });

    res.status(201).json({
      success: true,
      data: [],
      message: "User created successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    let { role } = req.body;
    const users = await User.find({ role }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id, name, email, password } = req.body;

    let oPayload = { name, email };
    if (password) {
      const hash_password = await bcrypt.hash(password, 8);
      oPayload["password"] = hash_password;
    }
    const updated = await User.findByIdAndUpdate(id, oPayload, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      data: updated,
      message: "User updated successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    const existingEmail = await User.findOne({ email })
      .select("+password")
      .lean();
    if (!existingEmail) {
      return res.status(404).json({ message: "User not found" });
    }

    let isValidPassword = await bcrypt.compare(
      password,
      existingEmail.password,
    );

    if (isValidPassword) {
      const token = await jwt.sign(
        { id: existingEmail._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "365d",
        },
      );

      let response = {
        ...existingEmail,
        token,
      };
      return res
        .status(200)
        .json({ data: response, message: "Login Successfully" });
    } else {
      return res.status(404).json({ message: "Invalid Password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
