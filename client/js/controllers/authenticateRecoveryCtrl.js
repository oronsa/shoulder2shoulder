angular.module('accountingShoulder')
    .controller('authenticateRecoveryCtrl', function ($rootScope, $scope, $state, authenticationService, shoulderService, currentUser, validateUtils) {

        $scope.data = {email: '', tempPassword: '', password: '', confirmPassword: ''};

        $scope.submitData = function () {
            if (validateUtils.validateEmail($scope.data.email) && validateUtils.validateToken($scope.data.tempPassword) &&
                validateUtils.validatePassword($scope.data.password) && validateUtils.validateConfirmPassword($scope.data.confirmPassword)) {
                if ($scope.data.password !== $scope.data.confirmPassword) {
                    swal({   title: "שגיאה!",
                        text: "סיסמא ואישור סיסמא אינם תואמות",
                        type: "warning"
                    });
                }
                else {
                    authenticationService.changePassword($scope.data).then(
                        function (result) {
                            if (result.success) {
                                $state.go(result.action);
                                swal("הצלחת!", "שינוי הסיסמא עבר בהצלחה, התחבר עם הסיסמא החדשה שהזנת", "success");

                            }
                            else {
                                if(result.msg =='mailAndToken'){
                                    swal({   title: "שגיאה!",
                                        text: "'מייל ומפתח אינם תואמים בדוק שוב את המפתח אשר נשלח אליל למייל",
                                        type: "warning"
                                    });
                                }
                                if (result.msg == "invalidPassword") {
                                    swal({   title: "שגיאה!",
                                        text: "הסיסמא הזמנית אשר הזנת אינה תואמת את הסיסמא הזמנית שקיבלת במייל, אנא בדוק את המייל שקיבלת שוב",
                                        type: "warning"
                                    });
                                }
                            }
                        }
                    );
                }
            }

            angular.module('accountingShoulder')
        }

    });