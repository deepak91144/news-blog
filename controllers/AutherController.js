const { db, admin } = require("../db");
const { validationResult } = require("express-validator");

exports.addAuther = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }
  const auther = await db.collection("authors").doc().set(req.body);
  return res.status(201).json({
    message: "auther created successfully",
    auther: auther,
  });
};
exports.getAuthers = async (req, res) => {
  let data = [];
  const authers = await db.collection("authors").get();
  authers.forEach((doc) => {
    data.push({ ...doc.data(), id: doc.id });
  });
  return res.status(200).json({
    message: "categories fetched successfully",
    authors: data,
  });
};
exports.getSignleAuther = async (req, res) => {
  const auther = await db.collection("authors").doc(req.params.authorId).get();
  return res.status(200).json({
    message: "record fetch successfully",
    author: auther.data(),
  });
};
exports.deleteAuther = async (req, res) => {
  try {
    await db.collection("authors").doc(req.params.authorId).delete();
    return res.status(204).json();
  } catch (error) {
    return res.status(400).json({
      message: "something went wrong",
      error,
    });
  }
};
exports.updateAuther = async (req, res) => {
  try {
    await db.collection("authors").doc(req.params.authorId).update(req.body);
    return res.status(200).json({
      message: "category updated  successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "something went wrong",
      error,
    });
  }
};
