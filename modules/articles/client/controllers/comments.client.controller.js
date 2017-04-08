(function () {
  'use strict';

  angular
    .module('comments')
    .controller('CommentsController', CommentsController);

  CommentsController.$inject = ['$scope', '$state', '$window', 'commentResolve', 'Authentication', 'Notification'];

  function CommentsController($scope, $state, $window, comment, Authentication, Notification) {
    var cm = this;

    cm.comment = comment;
    cm.authentication = Authentication;
    cm.form = {};
    cm.save = save;

    // Save Article
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'cm.form.commentForm');
        return false;
      }

      // Create a new article, or update the current instance
      cm.comment.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('articles.list'); // should we send the User to the list or the updated Article's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Article saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Comment adding error!' });
      }
    }
  }
}());
