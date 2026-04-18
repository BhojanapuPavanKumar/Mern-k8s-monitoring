const { IncomeModel } = require("../../../models/incomeSchema");
const { handleGenericAPIError } = require("../../../utils/controllerHelpers");

// GET all income entries for a user
const getAllIncomeController = async (req, res) => {
  try {
    const userId = req.user._id;

    const incomeData = await IncomeModel.find({ user: userId }).sort({
      date: -1,
    });

    if (incomeData.length === 0) {
      return res.status(200).json({
        isSuccess: true,
        message: "No data is available",
        data: [],
      });
    }

    res.status(200).json({
      isSuccess: true,
      data: incomeData,
    });
  } catch (error) {
    console.log("Get all Income failed:", error.message);
    handleGenericAPIError("getAllIncomeController", req, res, error);
  }
};

// ADD a new income entry
const addIncomeController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, amount, note, date } = req.body;

    if (!title || amount === undefined) {
      return res.status(400).json({
        isSuccess: false,
        message: "Title and amount are required.",
      });
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({
        isSuccess: false,
        message: "Amount must be a valid or positive number.",
      });
    }

    const newIncome = new IncomeModel({
      title,
      amount: Number(amount),
      user: userId,
      date,
      note,
    });

    await newIncome.save();

    res.status(201).json({
      isSuccess: true,
      message: "Income added successfully!",
      data: newIncome,
    });
  } catch (error) {
    handleGenericAPIError("addIncomeController", req, res, error);
  }
};

// EDIT an income entry by ID
const editIncomeController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { title, amount, note, date } = req.body;

    const updatedIncome = await IncomeModel.findOneAndUpdate(
      { _id: id, user: userId },
      { title, amount, note, date },
      { new: true }
    );

    if (!updatedIncome) {
      return res.status(404).json({
        isSuccess: false,
        message: "Income not found or not authorized",
      });
    }

    res.status(200).json({
      isSuccess: true,
      message: "Income updated successfully!",
      data: updatedIncome,
    });
  } catch (error) {
    handleGenericAPIError("editIncomeController", req, res, error);
  }
};

// DELETE an income entry by ID
const deleteIncomeController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const deletedIncome = await IncomeModel.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!deletedIncome) {
      return res.status(404).json({
        isSuccess: false,
        message: "Income not found or not authorized",
      });
    }

    res.status(200).json({
      isSuccess: true,
      message: "Income deleted successfully!",
    });
  } catch (error) {
    handleGenericAPIError("deleteIncomeController", req, res, error);
  }
};

module.exports = {
  getAllIncomeController,
  addIncomeController,
  editIncomeController,
  deleteIncomeController,
};
