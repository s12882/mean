(function () {
  'use strict';

  angular
    .module('comments.admin')
    .controller('CommentsAdminController', CommentsAdminController);

  CommentsAdminController.$inject = ['$scope', '$state', '$window', 'articleResolve', 'Authentication', 'Notification'];

  function CommentsAdminController($scope, $state, $window, comment, Authentication, Notification) {
    var vm = this;

    vm.comment = comment;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Article
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.comment.$remove(function() {
          $state.go('admin.articles.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Article deleted successfully!' });
        });
      }
    }

    // Save Article
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.articleForm');
        return false;
      }

      // Create a new article, or update the current instance
      vm.comment.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.comment.list'); // should we send the User to the list or the updated Article's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Article saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Article save error!' });
      }
    }
  }
}());
