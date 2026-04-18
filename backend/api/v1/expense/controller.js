const { ExpenseModel } = require("../../../models/expenseSchema");
const { handleGenericAPIError } = require("../../../utils/controllerHelpers");

const getAllExpenseController = async (req, res) => {
  try {
    const userId = req.user._id;

    const expenses = await ExpenseModel.find({ user: userId }).sort({
      date: -1,
    });

    if (expenses.length === 0) {
      return res.status(200).json({
        isSuccess: true,
        message: "No data is available",
        data: [],
      });
    }

    res.status(200).json({
      isSuccess: true,
      data: expenses,
    });
  } catch (error) {
    console.log("Get all expenses failed:", error.message);
    handleGenericAPIError("getAllExpenseController", req, res, error);
  }
};

const addExpenseController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, amount, category, date } = req.body;

    // Basic validation
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

    const newExpense = new ExpenseModel({
      title,
      amount: Number(amount),
      category,
      date,
      user: userId,
    });

    await newExpense.save();

    res.status(201).json({
      isSuccess: true,
      message: "Expense added successfully!",
      data: newExpense,
    });
  } catch (error) {
    handleGenericAPIError("addExpenseController", req, res, error);
  }
};

const editExpenseController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { title, amount, note, category, date } = req.body;

    const updatedExpense = await ExpenseModel.findOneAndUpdate(
      { _id: id, user: userId },
      { title, amount, note, category, date },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({
        isSuccess: false,
        message: "Expense not found or not authorized",
      });
    }

    res.status(200).json({
      isSuccess: true,
      message: "Expense updated successfully!",
      data: updatedExpense,
    });
  } catch (error) {
    handleGenericAPIError("editExpenseController", req, res, error);
  }
};

// DELETE an Expense entry by ID
const deleteExpenseController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const deletedExpense = await ExpenseModel.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!deletedExpense) {
      return res.status(404).json({
        isSuccess: false,
        message: "Expense not found or not authorized",
      });
    }

    res.status(200).json({
      isSuccess: true,
      message: "Expense deleted successfully!",
    });
  } catch (error) {
    handleGenericAPIError("ExpenseIncomeController", req, res, error);
  }
};

module.exports = {
  getAllExpenseController,
  addExpenseController,
  editExpenseController,
  deleteExpenseController,
};
