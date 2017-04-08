'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  liked: {
    type: Boolean
  },
  likes: {
    type: Number
  },
  dislikes: {
    type: Number
  },
  commentInput: {
    type: String,
    default: '',
    trim: true
  },
  comment: {
    commentContent: {
      type: String,
      default: '',
      trim: true
    },
    user: {
      type: String,
      default: '',
      trim: true
    },
    created: {
      type: Date,
      default: Date.now
    }
  },
  comments: [{}]
});

var CommentSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  cContent: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  article: {
    type: Schema.ObjectId,
    ref: 'Article'
  }
});

mongoose.model('Article', ArticleSchema);
mongoose.model('Comment', CommentSchema);
