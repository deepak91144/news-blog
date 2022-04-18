const { db } = require("../db");

const { validationResult } = require("express-validator");

exports.addPost = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }
  req.body.status = "draft";
  req.body.date = new Date();

  const post = await db.collection("posts").doc().set(req.body);
  return res.status(201).json({
    message: "record saved successfully",
    post: post,
  });
};
exports.getPosts = async (req, res) => {
  try {
    const { limit, offSet } = req.query;

    const post = await db
      .collection("posts")
      .offset(parseInt(offSet))
      .limit(parseInt(limit))
      .get();

    const postData = post.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    const categories = await db.collection("categories").get();
    const categoriesData = categories.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    const authors = await db.collection("authors").get();
    const authorsData = authors.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    const data = postData.map((p) => {
      const cat = categoriesData.filter((doc) => doc.id === p.category);
      const category = { ...cat[0] };
      category.author = undefined;
      const creator = authorsData.filter((doc) => doc.id === p.author);
      const author = { ...creator[0] };
      author.password = undefined;
      p.category = undefined;
      p.author = undefined;
      return { ...p, category, author };
    });

    return res.status(200).json({
      message: "record fetch successfully",
      post: data,
    });
  } catch (error) {
    return res.status(400).json({
      message: "something went wrong",
      error,
    });
  }
};
exports.getSignlePost = async (req, res) => {
  const post = await db.collection("posts").doc(req.params.postId).get();
  const categories = await db.collection("categories").get();
  const categoriesData = categories.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
  const authors = await db.collection("authors").get();
  const authorsData = authors.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });

  const categorydata = categoriesData.filter((cat) => {
    return cat.id === post.data().category;
  });
  const authorData = authorsData.filter((auth) => {
    return auth.id === post.data().author;
  });

  const postData = { ...post.data() };
  postData.category = { ...categorydata[0] };
  postData.author = { ...authorData[0] };
  postData.category.author = undefined;
  postData.author.password = undefined;
  return res.status(200).json({
    message: "record fetch successfully",
    post: postData,
  });
};
exports.deletePost = async (req, res) => {
  try {
    await db.collection("posts").doc(req.params.postId).delete();
    return res.status(201).json();
  } catch (error) {
    return res.status(400).json({
      message: "something went wrong",
      error,
    });
  }
};
exports.updatePost = async (req, res) => {
  try {
    await db.collection("posts").doc(req.params.postId).update(req.body);
    return res.status(200).json({
      message: "record updated  successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "something went wrong",
      error,
    });
  }
};
exports.join = async (req, res) => {
  const post = await db.collection("posts").get();
  const postData = post.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });

  const categories = await db.collection("categories").get();
  const categoriesData = categories.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
  const authors = await db.collection("authors").get();
  const authorsData = authors.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
  const data = postData.map((p) => {
    const cat = categoriesData.filter((doc) => doc.id === p.category);
    const category = cat[0];
    const creator = authorsData.filter((doc) => doc.id === p.author);
    const author = creator[0];
    p.category = undefined;
    p.author = undefined;
    return { ...p, category, author };
  });
  res.json(data);
};
