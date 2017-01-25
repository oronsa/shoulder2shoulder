angular.module('accountingShoulder.admin')
    .controller('adminHomeCtrl', function ($rootScope,$scope, $state, currentUser, COLLECTIONS, shoulderService) {

        $scope.familyList = [];

        (function init() {
            //case is super admin
            if ($rootScope.userSession.isSuper) {
                shoulderService.query(COLLECTIONS.USERS, {type: {$eq: 'user'}}).then(function (result) {
                    $scope.familyList = result.collection;
                }, function (error) {
                });
            }
            else {
                shoulderService.query(COLLECTIONS.USERS, {'leader.leaderId': {$eq: currentUser}}).then(function (result) {
                    $scope.familyList = result.collection;
                });
            }

        })();
        $scope.ifSuper=function(){
            return $rootScope.userSession.isSuper;
        }

    });

