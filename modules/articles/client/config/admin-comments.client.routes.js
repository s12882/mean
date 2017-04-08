(function () {
  'use strict';

  angular
    .module('admin.comments.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('comments', {
        abstract: true,
        url: '/comments',
        template: '<ui-view/>'
      })
      .state('admin.comments.list', {
        url: '',
        templateUrl: '/modules/comments/client/views/list-articles.client.view.html',
        controller: 'CommentListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Comments'
        }
      })
  .state('admin.comment.create', {
    url: '/create',
    templateUrl: '/modules/comments/client/views/form-article.client.view.html',
    controller: 'CommentController',
    controllerAs: 'vm',
    resolve: {
      commentResolve: newComment
    }
  })
    .state('admin.comment.edit', {
      url: '/:articleId/edit',
      templateUrl: '/modules/articles/client/views/admin/form-article.client.view.html',
      controller: 'CommentsAdminController',
      controllerAs: 'vm',
      data: {
        roles: ['admin']
      },
      resolve: {
        articleResolve: getComment
      }
    })
      .state('admin.comments.view', {
        url: '/:articleId',
        templateUrl: '/modules/comments/client/views/comment-article.client.view.html',
        controller: 'CommentsAdminController',
        controllerAs: 'vm',
        resolve: {
          commentResolve: getComment
        }
      });
  }

  getComment.$inject = ['$stateParams', 'CommentService'];

  function getComment($stateParams, CommentService) {
    return CommentService.get({
      commentId: $stateParams.commentId
    }).$promise;
  }

  newComment.$inject = ['CommentService'];

  function newComment(CommentService) {
    return new CommentService();
  }
}());
