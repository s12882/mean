'use strict';

/**
 * Module dependencies
 */
var commentsPolicy = require('../policies/comments.server.policy'),
  comments = require('../controllers/comments.server.controller');

module.exports = function (app) {

  app.route('/api/comments').all(commentsPolicy.isAllowed)
    .get(comments.list)
    .post(comments.create);


  app.route('/api/comments/:commentId').all(commentsPolicy.isAllowed)
    .get(comments.read)
    .put(comments.update)
    .delete(comments.delete);


  app.param('commentId', comments.commentByID);
};
