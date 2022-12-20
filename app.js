const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect(process.env.ATLAS);

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get((req, res) => {
    Article.find((err, foundArticles) => {
      if (err) {
        res.send(err);
      } else {
        res.send(foundArticles);
      }
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save((err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully added a new article.\n" + newArticle);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully deleted all articles.");
      }
    });
  });

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    const articleTitle = req.params.articleTitle;

    Article.find({ title: articleTitle }, (err, foundArticle) => {
      if (err) {
        res.send(err);
      } else {
        res.send(foundArticle);
      }
    });
  })
  .put((req, res) => {
    Article.replaceOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      (err) => {
        if (err) {
          res.send(err);
        } else {
          res.send("Successfully updated article.");
        }
      }
    );
  })
  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      (err) => {
        if (err) {
          res.send(err);
        } else {
          res.send("Successfully updated article.");
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully deleted article.");
      }
    });
  });

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
