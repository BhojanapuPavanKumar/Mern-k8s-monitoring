const { UserModel } = require("../../../models/userSchema");
const { handleGenericAPIError } = require("../../../utils/controllerHelpers");

const sendUserBasicInfoController = (req, res) => {
  const userInfo = req.user;

  res.status(200).json({
    isSuccess: true,
    message: "User is valid!",
    data: {
      user: userInfo,
    },
  });
};

const updateUserDetailsController = async (req, res) => {
  try {
    const { name, gender, role } = req.body;
    const userId = req.user._id;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { name, gender, role },
      { new: true }
    );

    res.status(200).json({
      isSuccess: true,
      message: "User updated!",
      data: updatedUser,
    });
  } catch (err) {
    handleGenericAPIError("updateUserDetailsController", req, res, err);
  }
};

const getUserDetailsController = async (req, res) => {
  try {
    const { _id } = req.user;

    const userDetails = await UserModel.findById(_id).select("-password");

    res.status(200).json({
      isSuccess: true,
      message: "User details found",
      data: {
        user: userDetails,
      },
    });
  } catch (err) {
    handleGenericAPIError("getUserDetailsController", req, res, err);
  }
};

module.exports = {
  sendUserBasicInfoController,
  updateUserDetailsController,
  getUserDetailsController,
};
