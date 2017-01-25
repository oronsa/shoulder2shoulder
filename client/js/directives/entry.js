
angular.module('accountingShoulder').directive('entry', function() {
    return {
        restrict : 'E',
        replace : true,
        templateUrl : 'js/templates/entry.html',
        controller : function ($scope, $rootScope, $state) {
            $scope.switchState = function(state) {
                $state.go(state);
            }
        }
    };
});