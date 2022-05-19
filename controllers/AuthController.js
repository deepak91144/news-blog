const { validationResult } = require("express-validator");
const { getAuth, admin, signOut } = require("../db");

exports.signUp = async (req, res) => {
  // getting validation errors
  const errors = validationResult(req);
  // send validation errors response if any
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }
  // get firebase auth
  const auth = getAuth();
  // create new user
  auth
    .createUser({
      email: req.body.email,
      emailVerified: false,
      displayName: req.body.name,
      phoneNumber: req.body.phone,
      disabled: false,
    })
    .then((userRecord) => {
      // create and send auth token to frontend
      auth
        .createCustomToken(req.body.email)
        .then((customToken) => {
          return res.status(201).json({
            message: "user created successfully",
            user: userRecord,
            token: customToken,
          });
        })
        .catch((error) => {
          console.log("Error creating custom token:", error);
        });
    })
    .catch((error) => {
      return res.status(401).json(error);
    });
};
exports.signIn = async (req, res) => {
  // getting validation errors
  const errors = validationResult(req);
  // send validation errors response if any
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }
  try {
    const auth = getAuth();
    // checking if the user exist by email id
    auth
      .getUserByEmail(req.body.email)
      .then((userRecord) => {
        // send auth token to front if the user exist
        auth.createCustomToken(req.body.email).then((customToken) => {
          return res.status(201).json({
            message: "user signed in successfully",
            user: userRecord,
            token: customToken,
          });
        });
      })
      .catch((error) => {
        return res.status(401).json(error);
      });
  } catch (error) {
    return res.status(401).json(error);
  }
};
