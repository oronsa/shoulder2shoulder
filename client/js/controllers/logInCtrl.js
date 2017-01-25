angular.module('accountingShoulder')

.controller('logInCtrl', function ($scope, $rootScope, $state, $stateParams, authenticationService, currentUser, validateUtils) {

    $scope.data = {
        email: '',
        password: ''
    };

    $scope.submitData = function () {
        if (!validateUtils.validateEmail($scope.data.email) || !validateUtils.validatePassword($scope.data.password)) {
            return;
        }
        else {
            authenticationService.logIn($scope.data).then(
                function (result) {
                    if (result.success) {
                        swal("ההתחברות עברה בהצלחה!", "ברוך הבא !", "success");

                        $rootScope.createSession(result.obj._id, result.obj.type, result.obj.isSuper);
                    }
                    else {
                        if (result.msg == "IncorrectPassword") {
                            swal({   title: "שגיאה!",
                                text: "סיסמא לא נכונה",
                                type: "warning"
                            });
                        }
                        else if (result.msg === "mailNotFound") {
                            swal({   title: "שגיאה!",   text: "דואר אלקטרוני לא קיים במערכת",type:"warning" });
                        }
                    }
                    $state.go(result.action);
                }
            );
        }
    }
});