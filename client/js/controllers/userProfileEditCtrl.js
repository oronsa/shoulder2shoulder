angular.module('accountingShoulder')


    .controller('userProfileEditCtrl', function ($scope, $state, $rootScope, shoulderService, currentUser, authenticationService, COLLECTIONS, validateUtils) {


        $scope.data = {
            email: '',
            newEmail: '',
            newEmailConfirmation: '',
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        };
        $scope.sections = {personal: false, email: false, password: false, profilePicture: false};


        $scope.editDetails = function (section) {
            Object.keys($scope.sections).forEach(function (key) {
                if ($scope.sections[key]) {
                    $scope.sections[key] = !$scope.sections[key];
                }
            });
            if (section)
                $scope.sections[section] = true;
        };

        $scope.getDetails = function (section) {
            return $scope.sections[section];
        };

        $scope.cancelPersonal = function () {
            $scope.editDetails();
            init();
        };


        $scope.confirmPersonal = function () {
            if ((validateUtils.validateUserName($scope.userData.userName)) && (validateUtils.validateFirstName($scope.userData.firstName)) &&
                (validateUtils.validateLastName($scope.userData.lastName)) && (validateUtils.validatePhone1($scope.userData.phone1)) &&
                (validateUtils.validatePhone2($scope.userData.phone2)) && (validateUtils.validateAddress($scope.userData.address))) {

                shoulderService.update(COLLECTIONS.USERS, {'_id': currentUser}, {
                    $set: {
                        'firstName': $scope.userData.firstName,
                        'lastName': $scope.userData.lastName,
                        'userName': $scope.userData.userName,
                        'phone1': $scope.userData.phone1,
                        'phone2': $scope.userData.phone2,
                        'address': $scope.userData.address
                    }
                }, {}).then(function (result) {
                    if (result.success) {
                        $scope.editDetails();
                    }
                });
            }
        };

        $scope.cancelPassword = function () {
            $scope.data.oldPassword = '';
            $scope.data.newPassword = '';
            $scope.data.confirmNewPassword = '';
            $scope.editDetails();
        }

        $scope.cancelEmail = function () {
            $scope.data.newEmail = '';
            $scope.data.newEmailConfirmation = '';
            $scope.editDetails();
            init();
        };

        $scope.changeEmail = function () {
            swal({
                    title: "האם אתה בטוח ?",
                    text: "לאחר פעולה זו תנותק מהמערכת לצורך אימות מחדש!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    cancelButtonText: " ביטול ",
                    confirmButtonText: "אני מבין, שנה כתובת מייל",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function (isConfirm) {
                    if (isConfirm) {
                        if ($scope.data.newEmail !== $scope.data.newEmailConfirmation) {
                            swal({
                                title: "שגיאה!",
                                text: "דואר אלקטרוני אינו תקין.",
                                type: "error"
                            });
                        }
                        else {
                            if (validateUtils.validateEmail($scope.data.newEmail) && validateUtils.validateEmail($scope.data.newEmailConfirmation) && validateUtils.validateEmail($scope.data.email)) {
                                authenticationService.changeEmail($scope.data.email, $scope.data.newEmail, $rootScope.userSession.userId).then(function (result) {
                                    if (result.success) {
                                        $rootScope.logOut();
                                        swal({
                                            title: "כל הכבוד !",
                                            text: "דואר אלקטרוני עודכן בהצלחה.",
                                            type: "success"
                                        });
                                    }
                                    else {
                                        if (result.msg === 'requestedEmailExists') {
                                            swal({
                                                title: "שגיאה!",
                                                text: "דואר אלקטרוני כבר קיים במערכת ! ",
                                                type: "error"
                                            });

                                        }
                                        else if (result.msg === 'oldEmailWrong') {
                                            swal({
                                                title: "שגיאה!",
                                                text: "דואר אלקטרוני שהזנת תואם את המייל הקודם ! ",
                                                type: "error"
                                            });
                                        }
                                        if (result.msg === 'updateFailed') {
                                            swal({
                                                title: "שגיאה!",
                                                text: "עדכון דואר אלקטרוני נכשל, נסה שוב.. ",
                                                type: "error"
                                            });
                                        }
                                    }
                                });
                            }
                        }
                        init();
                    }
                    else {
                        swal("בוטל", "המייל נשאר ללא שינוי ",
                            "error"
                        );
                    }
                });
        };
        $scope.changePassword = function () {
            swal({
                    title: "האם אתה בטוח ?",
                    text: "לאחר פעולה זו תנותק מהמערכת לצורך אימות מחדש!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    cancelButtonText: " ביטול ",
                    confirmButtonText: "אני מבין, עדכן את הסיסמא שלי",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function (isConfirm) {
                    if (isConfirm) {
                        if ($scope.data.newPassword !== $scope.data.confirmNewPassword) {
                            swal({
                                title: "שגיאה!",
                                text: "הסיסמאות החדשות שהזנת אינם תואמות אחת לשניה...,נסה שוב!  ",
                                type: "error"
                            });
                        }
                        else {
                            if (validateUtils.validatePassword($scope.data.newPassword) && validateUtils.validateConfirmPassword($scope.data.confirmNewPassword)) {
                                var userData = {
                                    email: $scope.data.email,
                                    tempPassword: $scope.data.oldPassword,
                                    password: $scope.data.newPassword,
                                    confirmPassword: $scope.data.confirmNewPassword
                                };
                                authenticationService.editPassword(userData).then(function (result) {
                                    if (result.success) {
                                        $rootScope.logOut();
                                        swal({
                                            title: "כל הכבוד!",
                                            text: "שינוי הסיסמא עבר בהצלחה!",
                                            type: "success"
                                        });
                                    }
                                    else {
                                        swal({
                                            title: "שגיאה!",
                                            text: "הסיסמא הישנה אשר הזנת אינה תואמת את הסיסמא הישנה שלך שקיימת במערכת ",
                                            type: "error"
                                        });
                                        $scope.editDetails();
                                        $scope.cancelPassword();
                                    }
                                });
                            }
                        }
                    }
                    else {
                        swal("בוטל", "הסיסמא נשאר ללא שינוי ",
                            "error"
                        );
                    }

                });
        };

            function init() {
                shoulderService.query(COLLECTIONS.USERS, {'_id': currentUser}).then(function (result) {
                    $scope.userData = result.collection[0];
                    $scope.data.email = $scope.userData.email;
                });
            }

            init();

        }
        );

