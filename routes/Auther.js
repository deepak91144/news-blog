const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const autherController = require("../controllers/AutherController");

router.post(
  "/author",
  [
    check("name", "name is empty").notEmpty(),
    check("email", "email is empty").notEmpty(),
    check("password", "password is empty").notEmpty(),
  ],
  autherController.addAuther
);
router.get("/author", autherController.getAuthers);
router.get("/author/:authorId", autherController.getSignleAuther);
router.delete("/author/:authorId", autherController.deleteAuther);
router.put("/author/:authorId", autherController.updateAuther);

module.exports = router;
