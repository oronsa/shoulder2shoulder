angular.module('accountingShoulder')

    //
    .controller('passwordRecoveryCtrl', function ($rootScope, $scope, $state, $stateParams, authenticationService, currentUser, COLLECTIONS,validateUtils) {

        $scope.data = { email: '' };

        $scope.submitData = function () {
            if (!(validateUtils.validateEmail($scope.data.email))) {
                return;
            }
            authenticationService.recovery($scope.data).then
            (function (result) {
                if (result.msg == "No such mail in our data base") {
                    swal({   title: "שגיאה!",
                        text: "אין התאמה עבור כתובת מייל זו במערכת, נסה שנית",
                        type: "warning"
                    });
                }
                else {
                    swal({   title: "כל הכבוד!",
                        text: "שלב 1 בתהליך השחזור הסתיים  בדוק את המייל ופעל לפי ההנחיות",
                        type: "success"
                    });
             
                    $state.go("authenticateRecovery");
                }

            });
        };

    });