var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const Todo = require("../models/Todo");

const privateKey = process.env.JWT_PRIVATE_KEY.replace(/\\n/gm, "\n");

function authorization(req, res, next) {
  console.log("req.header: ", req.header("Authorization"));
  if (req.header("Authorization")) {
    try {
      req.payload = jwt.verify(req.header("Authorization"), privateKey, {
        algorithms: ["RS256"],
      });
      console.log(req.payload);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

router.get("/", async function (req, res, next) {
  // const todos = await Todo.find().where("author").equals(req.payload.id).exec();
  const todos = await Todo.find().exec();
  return res.status(200).json({ todos: todos });
});

router.delete("/:_id", authorization, async function (req, res, next) {
  console.log("delete req.params._id: ", req.params._id);
  await Todo.findByIdAndDelete(req.params._id).exec();
  return res.status(200).json();
});

router.put("/:_id", authorization, async function (req, res, next) {
  console.log("put req.params: ", req.params);
  console.log("put req.body: ", req.body);
  await Todo.findByIdAndUpdate(
    { _id: req.params._id },
    {
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      complete: req.body.complete,
      completedOn: req.body.completedOn,
    }
  ).exec();
  return res.status(200).json();
});

router.post("/", authorization, async function (req, res) {
  const todo = new Todo({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    complete: req.body.complete,
    completedOn: req.body.completedOn,
    createdOn: req.body.createdOn,
  });

  await todo
    .save()
    .then((savedPost) => {
      return res.status(201).json({
        id: savedPost._id,
        title: savedPost.title,
        content: savedPost.content,
        author: savedPost.author,
        complete: savedPost.complete,
        completedOn: req.body.completedOn,
        createdOn: savedPost.createdOn,
      });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
});

module.exports = router;
