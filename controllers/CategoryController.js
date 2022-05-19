const { db } = require("../db");
const { validationResult } = require("express-validator");

exports.addCategory = async (req, res) => {
  try {
    // getting validation errors
    const errors = validationResult(req);
    // send validation errors response if any
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    // add new category to db
    const category = await db.collection("categories").doc().set(req.body);
    // send json response after successfully creation of category
    return res.status(201).json({
      message: "category created successfully",
      category: category,
    });
  } catch (error) {
    // send error response if something went wrong
    return res.status(401).json(error);
  }
};
exports.getCategories = async (req, res) => {
  try {
    // extract limit and offSet from query
    const { limit, offSet } = req.query;
    // get categories from db based on limit and calculation
    const categories = await db
      .collection("categories")
      .offset(parseInt(offSet))
      .limit(parseInt(limit))
      .get();
    // convert category record in array of object format
    const categoriesData = categories.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    // get authers details for join opperartion
    const authors = await db.collection("authors").get();
    const authorsData = authors.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    // logic for join oppearion
    const data = categoriesData.map((cat) => {
      const creator = authorsData.filter((doc) => doc.id === cat.author);
      const author = creator[0];
      // author.password = undefined;
      return { ...cat, author };
    });
    // send category details as json response
    return res.status(200).json({
      message: "categories fetched successfully",
      categories: data,
    });
  } catch (error) {
    // send error response if something went wrong
    return res.status(200).json(error);
  }
};
exports.getSignleCategory = async (req, res) => {
  try {
    // get single category by categoryId
    const category = await db
      .collection("categories")
      .doc(req.params.categoryId)
      .get();
    // send category details
    return res.status(200).json({
      message: "record fetch successfully",
      category: category.data(),
    });
  } catch (error) {
    // send errors if any
    return res.status(401).json(error);
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    // delete category by categorId
    await db.collection("categories").doc(req.params.categoryId).delete();
    return res.status(204).json();
  } catch (error) {
    // send error if any
    return res.status(401).json({
      message: "something went wrong",
      error,
    });
  }
};
exports.updateCategory = async (req, res) => {
  try {
    // update record by categoryId
    await db
      .collection("categories")
      .doc(req.params.categoryId)
      .update(req.body);
    // send response if updation successfully done
    return res.status(200).json({
      message: "category updated  successfully",
    });
  } catch (error) {
    // send errors if anything went wrong
    return res.status(401).json({
      message: "something went wrong",
      error,
    });
  }
};
