const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/CategoryController");
const { check } = require("express-validator");
const isAuthenticated = require("../middlewaire/Auth");

router.post(
  "/category",
  [
    check("title", "title is empty").notEmpty(),
    check("author", "auther is empty").notEmpty(),
  ],
  categoryController.addCategory
);
router.get("/category", categoryController.getCategories);
router.get(
  "/category/:categoryId",

  categoryController.getSignleCategory
);
router.delete(
  "/category/:categoryId",

  categoryController.deleteCategory
);
router.put(
  "/category/:categoryId",

  categoryController.updateCategory
);
module.exports = router;
