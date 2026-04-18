const express = require("express");
const {
  addExpenseController,
  getAllExpenseController,
  editExpenseController,
  deleteExpenseController,
} = require("./controller");
const { userAuthenticationMiddleware } = require("../middleware");

const expenseRouter = express.Router();

// /api/v1/auth/...
expenseRouter.get(
  "/get",
  userAuthenticationMiddleware,
  getAllExpenseController
);
expenseRouter.post("/add", userAuthenticationMiddleware, addExpenseController);
expenseRouter.patch(
  "/update/:id",
  userAuthenticationMiddleware,
  editExpenseController
);
expenseRouter.delete(
  "/delete/:id",
  userAuthenticationMiddleware,
  deleteExpenseController
);

module.exports = { expenseRouter };
