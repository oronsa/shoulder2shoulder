angular.module('accountingShoulder')


    .controller('changePasswordCtrl', function($scope, $rootScope, $state, shoulderService, currentUser, authenticationService, ROLES) {

        $scope.data = { oldPassword : '', newPassword : '', confirmNewPassword : '' };

        $scope.submitData = function() {
            if($scope.data.newPassword != $scope.data.confirmNewPassword) {
                
            }
            else {
                authenticationService.changePassword({
                    email : $rootScope.userSession.email,
                    tempPassword : $scope.data.oldPassword,
                    password : $scope.data.newPassword
                }).then(function(result) {
                    $rootScope.userSession.type === ROLES.ADMIN ? $state.go('adminHome') : $state.go('userHome');
                });
            }
        };

    });


