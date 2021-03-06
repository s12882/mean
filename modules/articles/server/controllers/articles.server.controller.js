'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),

  Article = mongoose.model('Article'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
  
	function containsLike(Array, user){
	for (var i = 0; i <= Array.length; i++) {
      if (Array[i] == user) {
        return true;
	    break;
        }
    }
	return false;    	
}

/**
 * Create an article
 */
exports.create = function (req, res) {
  var article = new Article(req.body);

  article.user = req.user;
  article.likes = 0;

  article.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * Show the current article
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var article = req.article ? req.article.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  article.isCurrentUserOwner = !!(req.user && article.user && article.user._id.toString() === req.user._id.toString());

  res.json(article);
};
/**
 * Update
 */
exports.update = function (req, res) {
  var article = req.article;
  article.title = req.body.title;
  article.content = req.body.content;
  article.comment.commentContent = req.body.comment.commentContent;
  article.comment.user = req.user.displayName;
  article.liked = req.body.liked;
  article.disliked = req.body.disliked;
  
  if (article.comment.commentContent != '') {
    article.comments.push(article.comment);
  }

  if (req.body.liked == true) {
	article.like.user = req.user.displayName;

	if(containsLike(article.userDislikes, req.user.displayName) == true) {
	   var index = article.userDislikes.indexOf(req.user.displayName);
       article.userDislikes.splice(index, 1);		  
	}

	if(containsLike(article.userLikes, req.user.displayName) == false){
      article.userLikes.push(article.like.user);
	}else{
      var index = article.userLikes.indexOf(req.user.displayName);
      article.userLikes.splice(index, 1);  
	}
  }
  
  if (req.body.disliked == true) {
	article.dislike.user = req.user.displayName;

	if(containsLike(article.userLikes, req.user.displayName) == true) {
	var index = article.userLikes.indexOf(req.user.displayName);
    article.userLikes.splice(index, 1);		  
	}

	if(containsLike(article.userDislikes, req.user.displayName) == false){
      article.userDislikes.push(article.dislike.user);
	}else{
      var index = article.userLikes.indexOf(req.user.displayName);
      article.userDislikes.splice(index, 1);  
	}
  }
  

  article.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });

};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
  var article = req.article;

  article.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
  Article.find().sort('-created').populate('user', 'displayName').exec(function (err, articles) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(articles);
    }
  });
};

/**
 * Article middleware
 */
 
exports.articleByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Article is invalid'
    });
  }

  Article.findById(id).populate('user', 'displayName').exec(function (err, article) {
    if (err) {
      return next(err);
    } else if (!article) {
      return res.status(404).send({
        message: 'No article with that identifier has been found'
      });
    }
    req.article = article;
    next();
  });
};
