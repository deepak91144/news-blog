const admin = require("firebase-admin");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} = require("firebase-admin/auth");

const serviceAccount = require("./newsblog-17968-firebase-adminsdk-wmuqv-9749ff3718.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

module.exports = {
  db,
  admin,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
};
