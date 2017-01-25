angular.module('accountingShoulder')


    .controller('signUpCtrl', function ($scope, $state, $stateParams, authenticationService, currentUser,validateUtils) {

        $scope.userData = {
            email: '',
            token: '',
            password: '',
            confirmPassword: '',
            userName: '',
            firstName: '',
            lastName: '',
            address: '',
            phone1: '',
            phone2: ''
        };

        var clearUserData = function () {
            $scope.userData = {};
        };

        //here after we check the validation of the  details we insert them into the DB
        $scope.submitData = function () {
            console.log($scope.userData.token);
            var isValid=validateUtils.validateForm($scope.userData);
            if (isValid) {
                if ($scope.userData.password === $scope.userData.confirmPassword) {
                    delete $scope.userData.confirmPassword;
                    authenticationService.signUp($scope.userData).then(function (result) {
                        if (result.success) {
                            swal({   title: "ברכות!",
                                text: "ההרשמה הסתיימה בהצלחה, הנך מועבר לדף הכניסה",
                                type: "success"
                            });
                            $state.go('logIn');
                        }
                        else {
                            if (result.msg === 'missingToken') {
                                swal({   title: "שגיאה!",
                                    text: "המפתח שהזנת לא תקין, נסה שוב..",
                                    type: "error"
                                });
                               
                            }
                            else if (result.msg === 'alreadySignedUp') {
                                swal({   title: "שגיאה!",
                                    text: "שם המשתמש קיים במערכת..,בבקשה בחר אחר.",
                                    type: "warning"
                                });
                            }
                            else if (result.msg === 'wrongEmail') {
                                swal({   title: "שגיאה!",
                                    text: "דואר אלקטרוני אינו תקין.",
                                    type: "error"
                                });
                            }
                        }

                    });
                }
                else{
                    swal({   title: "שגיאה!",
                        text: "סיסמא ואישור סיסמא אינם תואמות.",
                        type: "error"
                    });
                }
            }
        };
        clearUserData();

    });

