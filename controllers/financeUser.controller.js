import FinanceUser from "../models/financeUser.model.js";

export const createFinanceUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const existing = await FinanceUser.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await FinanceUser.create({ name, email });

    res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFinanceUsers = async (req, res) => {
  try {
    const users = await FinanceUser.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateFinanceUser = async (req, res) => {
  try {
    const { id, name, email } = req.body;

    const updated = await FinanceUser.findByIdAndUpdate(
      id,
      { name, email },
      {
        new: true,
        runValidators: true,
      },
    );

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

export const deleteFinanceUser = async (req, res) => {
  try {
    const { id } = req.body;

    const deleted = await FinanceUser.findByIdAndDelete(id);

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
