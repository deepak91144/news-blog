const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/AuthController");

router.post(
  "/signup",
  [
    check("name", "name is empty").notEmpty(),
    check("email", "email is empty").notEmpty(),
    check("phoneNumber", "phoneNumber is empty").notEmpty(),
  ],
  authController.signUp
);
router.post(
  "/signin",
  [check("email", "email is empty").notEmpty()],
  authController.signIn
);

module.exports = router;
