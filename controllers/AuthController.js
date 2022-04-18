const { validationResult } = require("express-validator");
const {
  db,
  admin,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} = require("../db");

exports.signUp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }
  const auth = getAuth();

  auth
    .createUser({
      email: req.body.email,
      displayName: req.body.name,
    })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      auth
        .createCustomToken("fjoerfojer")
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }
  try {
    const auth = getAuth();
    // const { user } = await firebase.auth().signInWithEmailAndPassword(email, password);
    // const customToken = await admin.auth().createCustomToken(user.uid);
    auth
      .getUserByEmail(req.body.email)
      .then((userRecord) => {
        auth.createCustomToken("fjoerfojer").then((customToken) => {
          return res.status(201).json({
            message: "user created successfully",
            user: userRecord,
            token: customToken,
          });
        });
      })
      .catch((error) => {
        console.log("Error fetching user data:", error);
      });
  } catch (error) {
    return res.status(401).json(error);
  }
};
exports.signOut = async (req, res) => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
    });
};
