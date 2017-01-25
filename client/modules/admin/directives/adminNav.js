
angular.module('accountingShoulder.admin').directive('adminNav', function () {
    return {
        restrict : 'E',
        replace : true,
        templateUrl : 'modules/admin/templates/adminNav.html',
        controller : function($scope, $rootScope, $state,shoulderService,COLLECTIONS) {
            $scope.logOut = function() {
                $rootScope.logOut();
            };
            $scope.switchState = function(state) {
                $state.go(state);
            };
            $scope.isSuper = function() {
                return $rootScope.userSession.isSuper || false;
            };
            shoulderService.query(COLLECTIONS.USERS,{'_id' :$rootScope.userSession.userId }).then(function(result) {
                $scope.userName= result.collection[0].userName;
            })
        }
    };
});