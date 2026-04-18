const express = require("express");
const {
  sendUserBasicInfoController,
  updateUserDetailsController,
  getUserDetailsController,
} = require("./controllers");
const { userAuthenticationMiddleware } = require("../middleware");

const usersRouter = express.Router();

usersRouter.get("/", sendUserBasicInfoController);
usersRouter.get("/details", getUserDetailsController);

usersRouter.post("/details", updateUserDetailsController);

module.exports = { usersRouter };
