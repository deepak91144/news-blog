const { db } = require("../db");

const { validationResult } = require("express-validator");

exports.addPost = async (req, res) => {
  try {
    // getting validation errors if any
    const errors = validationResult(req);
    // send validation errors as json response if found any
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    // making post status as draft initially
    req.body.status = "draft";
    // set current date to date coulmn
    req.body.date = new Date();
    // saving new post to db
    const post = await db.collection("posts").doc().set(req.body);
    // send json response if post created
    return res.status(201).json({
      message: "record saved successfully",
      post: post,
    });
  } catch (error) {
    // send error response if something went wrong
    return res.status(401).json();
  }
};
exports.getPosts = async (req, res) => {
  try {
    // destruct limit and offset from query
    const { limit, offSet } = req.query;
    // getting posts depending upon limit ans offSet
    const post = await db
      .collection("posts")
      .offset(parseInt(offSet))
      .limit(parseInt(limit))
      .get();
    // convert to post record as array of object
    const postData = post.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    // getting category data for join opperation
    const categories = await db.collection("categories").get();
    const categoriesData = categories.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    // getting authers data for join opperation
    const authors = await db.collection("authors").get();
    const authorsData = authors.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    // login for join opperration
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
    // json response for post
    return res.status(200).json({
      message: "record fetch successfully",
      post: data,
    });
  } catch (error) {
    return res.status(401).json({
      message: "something went wrong",
      error,
    });
  }
};
exports.getSignlePost = async (req, res) => {
  try {
    // get single post by post id
    const post = await db.collection("posts").doc(req.params.postId).get();
    // get category data for join
    const categories = await db.collection("categories").get();
    const categoriesData = categories.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    // get author data for join
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
    // login for join opperartion
    const postData = { ...post.data() };
    postData.category = { ...categorydata[0] };
    postData.author = { ...authorData[0] };
    postData.category.author = undefined;
    postData.author.password = undefined;
    // json response for single post
    return res.status(200).json({
      message: "record fetch successfully",
      post: postData,
    });
  } catch (error) {
    // send error response if something went wrong
    return res.status(401).json(error);
  }
};
exports.deletePost = async (req, res) => {
  try {
    // delete post by postId
    await db.collection("posts").doc(req.params.postId).delete();
    return res.status(204).json();
  } catch (error) {
    // send error response if any
    return res.status(400).json({
      message: "something went wrong",
      error,
    });
  }
};
exports.updatePost = async (req, res) => {
  try {
    // update post details by postId
    await db.collection("posts").doc(req.params.postId).update(req.body);
    // send response about update was successful
    return res.status(200).json({
      message: "record updated  successfully",
    });
  } catch (error) {
    // send error if updation was not successful
    return res.status(401).json({
      message: "something went wrong",
      error,
    });
  }
};

exports.searchPost = async (req, res) => {
  try {
    // destruct title from params
    const { title } = req.params;
    // seearch exact post using where clause
    const post = await db.collection("posts").where("title", "==", title).get();
    const postData = post.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    // send post details in response
    return res.status(200).json(postData);
  } catch (error) {
    // send error response if any
    return res.status(401).json(error);
  }
};

exports.sortingPost = async (req, res) => {
  try {
    // destruct sort text from params
    const { sort } = req.params;
    let post;
    // check about the sorting text and query db accordingly
    if (sort === "asc") {
      post = await db.collection("posts").orderBy("title", "asc").get();
    }
    if (sort === "desc") {
      post = await db.collection("posts").orderBy("title", "desc").get();
    }
    // get post details
    const postData = post.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    // send post details
    return res.status(200).json(postData);
  } catch (error) {
    // send error response if any
    return res.status(401).json(error);
  }
};
