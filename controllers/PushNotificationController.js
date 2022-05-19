const { admin } = require("../db");
const { validationResult } = require("express-validator");

exports.pushNotification = async (req, res) => {
  // getting validation error if any
  const errors = validationResult(req);
  // sending validation error response
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }
  // notification options
  const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24,
  };
  // getting registration token of the device from requst body
  const registrationToken = req.body.registrationToken;
  // get message text from requst body
  const message = req.body.message;
  const options = notification_options;
  // send notification back to the device
  admin
    .messaging()
    .sendToDevice(registrationToken, message, options)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      // send errror response if any found
      res.status(401).json(error);
    });
};
