const express = require("express");
const router = express.Router();
const postController = require("../controllers/PostController");
const { check } = require("express-validator");
router.post(
  "/post",
  [
    check("title", "title is empty").isLength({ min: 2 }),
    check("description", "description is empty").isLength({ min: 2 }),
    check("category", "category is empty").notEmpty(),
    check("author", "author is empty").notEmpty(),
  ],
  postController.addPost
);
router.get("/post", postController.getPosts);
router.get("/post/:postId", postController.getSignlePost);
router.delete("/post/:postId", postController.deletePost);
router.put("/post/:postId", postController.updatePost);
router.get("/join", postController.join);
module.exports = router;
