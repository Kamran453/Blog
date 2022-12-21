//jshint esversion:6
require('dotenv').config();
const express = require("express");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "We love JavaScript. It's a totally friendly language. All templating languages grow to be Turing-complete. Just cut out the middle-man, and use JS!";
const aboutContent = "A great About Us page not just portrays your story, qualities and provides an insight on how your business started, but it also helps you sell. When visitors become familiar with your story and connect with it, they're probably going to purchase from you. A well-planned About Us page can do this!";
const contactContent = "ar too many website designers put contact pages near the bottom of their priority list in terms of copywriting and design. It’s no wonder that many contact pages look like they were built in the 1990s, while the rest of the website is beautiful and updated.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(`mongodb+srv://admin-${process.env.MONGODB_NAME}:${process.env.MONGODB_PASSWD}@cluster0.zknybbs.mongodb.net/BlogDB`,{useNewUrlParser:true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);


app.get("/", function(req, res){
  Post.find({},function(err,posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  })


});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err){
    if(!err){
    res.redirect("/");
    }
  });

});

app.get("/posts/:postId", function(req, res){
  const requestedTitle = req.params.postId;

    Post.findOne({_id: requestedTitle},function(err,found){
      res.render("post", {
        newTitle: found.title,
        newContent: found.content
    });
  });

});

const port = process.env.PORT || 3000;

app.listen(port);
