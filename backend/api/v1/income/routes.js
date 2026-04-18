const express = require("express");
const {
  addIncomeController,
  getAllIncomeController,
  deleteIncomeController,
  editIncomeController,
} = require("./controller");
const { userAuthenticationMiddleware } = require("../middleware");

const incomeRouter = express.Router();

// /api/v1/auth/...
incomeRouter.get("/get", userAuthenticationMiddleware, getAllIncomeController);
incomeRouter.post("/add", userAuthenticationMiddleware, addIncomeController);
incomeRouter.delete(
  "/delete/:id",
  userAuthenticationMiddleware,
  deleteIncomeController
);
incomeRouter.patch(
  "/update/:id",
  userAuthenticationMiddleware,
  editIncomeController
);

module.exports = { incomeRouter };
