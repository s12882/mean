'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Comment = mongoose.model('Comment'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an article
 */
exports.create = function (req, res) {
  var comment = new Comment(req.body);
  comment.user = req.user;
  comment.article = req.article;
  comment.content = req.content;

  comment.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(comment);
    }
  });
};

/**
 * Show the current article
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var comment = req.comment ? req.comment.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  comment.isCurrentUserOwner = !!(req.user && comment.user && comment.user._id.toString() === req.user._id.toString());

  res.json(comment);
};

/**
 * Update an article
 */
exports.update = function (req, res) {
  var comment = req.comment;

  comment.content = req.body.cContent;

  comment.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(comment);
    }
  });
};

/**
 * Delete an articles
 */
exports.delete = function (req, res) {
  var comment = req.comment;

  comment.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(comment);
    }
  });
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
  Comment.find().sort('-created').populate('user', 'displayName').exec(function (err, comments) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(comments);
    }
  });
};

/**
 * Article middleware
 */
exports.commentByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Comment is invalid'
    });
  }

  Comment.findById(id).populate('user', 'displayName').exec(function (err, comment) {
    if (err) {
      return next(err);
    } else if (!comment) {
      return res.status(404).send({
        message: 'No article with that identifier has been found'
      });
    }
    req.comment = comment;
    next();
  });
};

exports.commentByArticle = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Comment is invalid'
    });
  }

  Comment.findById(id).populate('article', 'displayName').exec(function (err, comment) {
    if (err) {
      return next(err);
    } else if (!comment) {
      return res.status(404).send({
        message: 'No comment with that identifier has been found'
      });
    }
    req.comment = comment;
    next();
  });
};
