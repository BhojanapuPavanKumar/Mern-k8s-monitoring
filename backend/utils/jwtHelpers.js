const jwt = require("jsonwebtoken");

const attachJWTToken = (res, data) => {
  const token = jwt.sign(data, process.env.JWT_SECRET);

  res.cookie("authorization", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    secure: false, // ✅ must be false for HTTP (Minikube/local)
    sameSite: "lax", // ✅ required for localhost
    httpOnly: true,
  });
};

const removeJWTToken = (res) => {
  res.cookie("authorization", "", {
    maxAge: 0,
    secure: false, // ✅ same fix here
    sameSite: "lax",
    httpOnly: true,
  });
};

module.exports = { attachJWTToken, removeJWTToken };
