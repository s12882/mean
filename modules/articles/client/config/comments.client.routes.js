(function () {
  'use strict';

  angular
    .module('comments.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('comments', {
        abstract: true,
        url: '/comments',
        template: '<ui-view/>'
      })
      .state('comments.list', {
        url: '',
        templateUrl: '/modules/articles/client/views/list-comments.client.view.html',
        controller: 'CommentsListController',
        controllerAs: 'cm',
        data: {
          pageTitle: 'Comments'
        }
      })
  .state('comments.create', {
    url: '/create',
    templateUrl: '/modules/articles/client/views/comment-article.client.view.html',
    controller: 'CommentsController',
    controllerAs: 'cm',
    resolve: {
      commentResolve: newComment
    }
  })
      .state('comments.view', {
        url: '/:articleId',
        templateUrl: '/modules/articles/client/views/list-comments.client.view.html',
        controller: 'CommentsController',
        controllerAs: 'cm',
        resolve: {
          commentResolve: getComment
        }
      });
  }

  getComment.$inject = ['$stateParams', 'CommentsService'];
  function getComment($stateParams, CommentsService) {
    return CommentsService.get({
      commentId: $stateParams.commentId
    }).$promise;
  }

  newComment.$inject = ['CommentsService'];

  function newComment(CommentsService) {
    return new CommentsService();
  }
}());
