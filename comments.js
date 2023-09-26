//create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Comment = require('./models/comment');
var Post = require('./models/post');
var db = mongoose.connection;
var ObjectId = require('mongodb').ObjectID;
var cors = require('cors');
var path = require('path');
var port = process.env.PORT || 3000;
var router = express.Router();
var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
};
//connect to database
mongoose.connect('mongodb://localhost:27017/comments');
//check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});
//check for db errors
db.on('error', function(err){
  console.log(err);
});
//set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//set public folder
app.use(express.static(path.join(__dirname, 'public')));
//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//enable cors
app.use(cors(corsOptions));
//get comments
app.get('/comments', function(req, res, next){
  Comment.find({}, function(err, comments){
    if(err){
      console.log(err);
    } else {
      res.json(comments);
    }
  });
});
//get single comment
app.get('/comments/:id', function(req, res, next){
  Comment.findById(req.params.id, function(err, comment){
    if(err){
      console.log(err);
    } else {
      res.json(comment);
    }
  });
});
//add comment
app.post('/comments/add', function(req, res, next){
  console.log(req.body);
  let comment = new Comment();
  comment.username = req.body.username;
  comment.title = req.body.title;
  comment.body = req.body.body;
  comment.save(function(err){
    if(err){
      console.log(err);
    } else {
      res.json({message: 'Comment Added'});
    }
  });
});
//update comment
app.put('/comments/:id', function(req, res, next){
  let query = {_id: req.params.id}
  let comment = new Comment();
  comment.username = req.body.username;
  comment.title = req.body.title;
  comment.body = req.body.body;
  Comment.update(query, comment, function(err){
    if(err){
      console.log(err);
    } else {
      res.json({message: 'Comment Updated'});
    }
  });
});
//delete comment
app.delete('/comments/:id', function(req, res, next){
  let query = {_id: req.params.id}
  Comment.remove(query, function(err){
    if(err){
      console.log(err);
    }
    res.json({message: 'Comment Removed'});
  });
});
//get posts
app.get('/posts', function(req, res, next){
  Post.find({}, function(err, posts){
    if(err){
      console.log(err);
    } else {
      resdb.once('open', function(){
  console.log('Connected to MongoDB');
});