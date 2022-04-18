const { db } = require("../db");
const { validationResult } = require("express-validator");

exports.addCategory = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }
  const category = await db.collection("categories").doc().set(req.body);
  return res.status(201).json({
    message: "category created successfully",
    category: category,
  });
};
exports.getCategories = async (req, res) => {
  const { limit, offSet } = req.query;

  const categories = await db
    .collection("categories")
    .offset(parseInt(offSet))
    .limit(parseInt(limit))
    .get();
  const categoriesData = categories.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
  const authors = await db.collection("authors").get();
  const authorsData = authors.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });

  const data = categoriesData.map((cat) => {
    const creator = authorsData.filter((doc) => doc.id === cat.author);
    const author = creator[0];
    author.password = undefined;
    return { ...cat, author };
  });

  return res.status(200).json({
    message: "categories fetched successfully",
    categories: data,
  });
};
exports.getSignleCategory = async (req, res) => {
  const category = await db
    .collection("categories")
    .doc(req.params.categoryId)
    .get();
  return res.status(200).json({
    message: "record fetch successfully",
    category: category.data(),
  });
};
exports.deleteCategory = async (req, res) => {
  try {
    await db.collection("categories").doc(req.params.categoryId).delete();
    return res.status(204).json();
  } catch (error) {
    return res.status(400).json({
      message: "something went wrong",
      error,
    });
  }
};
exports.updateCategory = async (req, res) => {
  try {
    await db
      .collection("categories")
      .doc(req.params.categoryId)
      .update(req.body);
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
