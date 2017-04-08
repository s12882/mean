(function () {
  'use strict';

  angular
    .module('comments')
    .controller('CommentsListController', CommentsListController);

  CommentsListController.$inject = ['CommentsService'];

  function CommentsListController(CommentsService) {
    var cm = this;

    cm.comments = CommentsService.query();
  }
}());
