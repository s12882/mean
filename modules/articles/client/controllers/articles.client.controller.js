(function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesController', ArticlesController);

  ArticlesController.$inject = ['$scope', '$state', '$window', 'articleResolve', 'Authentication', 'Notification'];

  function ArticlesController($scope, $state, $window, article, Authentication, Notification) {
    var vm = this;

    vm.article = article;
    vm.authentication = Authentication;
    vm.form = {};
    vm.save = save;

    // Save Article
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.articleForm');
        return false;
      }

      // Create a new article, or update the current instance
      vm.article.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('articles.list'); // should we send the User to the list or the updated Article's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Article saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Article save error!' });
      }
    }
  }
}());
