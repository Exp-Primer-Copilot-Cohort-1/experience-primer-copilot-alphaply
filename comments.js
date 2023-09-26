// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

// Create express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Create a comments object
const commentsByPostId = {};

// Create a get route to get the comments for a specific post
app.get('/posts/:id/comments', (req, res) => {
  // Return the comments object for the given post id
  res.send(commentsByPostId[req.params.id] || []);
});

// Create a post route to post a comment to a specific post
app.post('/posts/:id/comments', (req, res) => {
  // Create a random id for the comment
  const commentId = randomBytes(4).toString('hex');
  // Get the comment content from the request body
  const { content } = req.body;
  // Get the comments for the given post id
  const comments = commentsByPostId[req.params.id] || [];
  // Push the new comment into the comments array
  comments.push({ id: commentId, content, status: 'pending' });
  // Set the comments for the given post id
  commentsByPostId[req.params.id] = comments;
  // Emit an event to the event bus containing the id, content, and status of the comment
  axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: 'pending',
    },
  });
  // Return the comments array
  res.status(201).send(comments);
});

// Create a post route to handle an event
app.post('/events', async (req, res) => {
  // Get the event type and data from the request body
  const { type, data } = req.body;
  // If the event type is CommentModerated
  if (type === 'CommentModerated') {
    // Get the comments for the given post id
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];
    // Find the comment with the given id
    const comment = comments.find((comment) => {
      return comment.id === id;
    }
    );
    // Set the status of the comment to the status from the event data  
    comment.status = status;
    // Emit an event to the event bus containing the id, content, status, and postId of the comment
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: {
        id,
        content,
        postId,
        status,
      },
    });
  }
  // Send a response
  res.send({});

});



