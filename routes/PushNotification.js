const express = require("express");
const router = express.Router();

const { check } = require("express-validator");
const isAuthenticated = require("../middlewaire/Auth");
const pushNotificationController = require("../controllers/PushNotificationController");
router.post(
  "/notification",
  [check("registrationToken", "registrationToken is empty").notEmpty()],
  pushNotificationController.pushNotification
);
module.exports = router;
