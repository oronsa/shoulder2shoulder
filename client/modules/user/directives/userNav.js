angular.module('accountingShoulder.user').directive('userNav', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'modules/user/templates/userNav.html',
        controller: function($scope, $rootScope, $state,shoulderService,COLLECTIONS) {
            $scope.logOut = function() {
                $rootScope.logOut();
            };
            $scope.switchState = function(state) {
                $state.go(state);
            };
            shoulderService.query(COLLECTIONS.USERS,{'_id' :$rootScope.userSession.userId }).then(function(result) {
                $scope.userName= result.collection[0].userName;
                $scope.lastName= result.collection[0].lastName;
            })
        }
    };
});