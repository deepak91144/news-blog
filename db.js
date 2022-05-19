// getting firebase admin from firebase package
const admin = require("firebase-admin");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} = require("firebase-admin/auth");
// require service account
const serviceAccount = require("./newsblog-17968-firebase-adminsdk-wmuqv-9749ff3718.json");
// initilize the firebase service
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
// get firestore database
const db = admin.firestore();

module.exports = {
  db,
  admin,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
};
