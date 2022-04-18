//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")

var _ = require('lodash');
const { update } = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//Connect to database mongoDB
mongoose.connect(process.env.MONGODB_URI)

//Create new Schema for collection blogs
const blogSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Blog = mongoose.model("Blog", blogSchema);

app.get("/", function (req, res) {

  //Find all data from collection Blog
  Blog.find({}, function(err, blogContent){
    if(!err){
      //Send data to Home.ejs
      res.render("home", {
        homeStartContent: homeStartingContent,
        posts: blogContent
      });
    }
  })
});

//Open satu post berdasarkan Id yang tersimpan di req.params.id
//Route parameters menyimpan nilai yang di tentukan di :title dan disimpan di req.params.title dan mengirimkan data sesuai dengan url dari nilai :title
app.get("/posts/:id", function(req, res){

  const requestId = _.lowerCase(req.params.id);
  
  Blog.find({}, function(err, blogContent){
    if(!err){
      blogContent.forEach(post => {
        if(requestId === _.lowerCase(post._id)){
          res.render("post", {
            postTitle: post.title,
            postContent: post.content
          });
        }
      });
    }
  })
});

app.get("/about", function(req, res){
  res.render("about", {
    aboutTextContent: aboutContent
  });
});

app.get("/contact", function(req, res){
  res.render("contact", {
    contactTextContent: contactContent
  });
});

app.get("/compose", function(req, res){  
  res.render("compose")
})

app.get("/update", function(req, res){
  res.render("update")
})

//Create one document
app.post("/compose", function(req, res){
  
  const newContent = new Blog({
    title: req.body.textValue,
    content: req.body.postValue
  });

  newContent.save(err => {
    if(!err){
      res.redirect("/")
    }
  })

})


//Delete one post document
app.post("/posts/:titlePost", function(req, res){

  const requestTitle = req.params.titlePost;

  Blog.deleteOne({title: requestTitle}, function(err){
    if(err){
      console.log(err)
    } else {
      console.log("Succsesfully delete one document")
      res.redirect("/")
    }
  })

})


app.get("/update/:title", function(req, res){
  const requestTitle = req.params.title;

  res.render("update", {
    titlePost: requestTitle
  });
})

app.post("/update/posts/:title", function(req, res){
  const requestTitle = req.params.title;
  const valuePost = req.body.updatePostValue

  Blog.updateOne({title: requestTitle}, {content: valuePost}, function(err){
    if(err){
      console.log(err)
    } else {
      console.log("Succesfully update one document")
      res.redirect("/");
    }
  })
})


app.listen(3000, function () {
  console.log("Server started on port 3000");
});
