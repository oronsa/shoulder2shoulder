angular.module('accountingShoulder.user')

    .controller('addBillCtrl', function ($scope, $state, $stateParams, currentUser, shoulderService, COLLECTIONS) {

        $scope.data = {category: '', amount: null, date: '', description: '', del: '', categoryOfPayment: ''};

        $scope.categories = [
            {_id: 1, name: 'אוכל'},
            {_id: 2, name: 'ביגוד'},
            {_id: 3, name: 'פנאי'},
            {_id: 4, name: 'חשבונות'},
            {_id: 5, name: 'רכב'},
            {_id: 6, name: 'בריאות'},
            {_id: 7, name: 'לימודים'},
            {_id: 8, name: 'אחר'}
        ];

        $scope.payments = [
            {_id: 1, name: 'אשראי'},
            {_id: 2, name: 'צ\'ק'},
            {_id: 3, name: 'מזומן'},
            {_id: 4, name: 'אחר'}
        ];

        $scope.submitData = function (redirect) {
            if ($scope.data.date && $scope.data.amount && $scope.data.category && $scope.data.categoryOfPayment) {
                shoulderService.insert(COLLECTIONS.BILLS, new Bill()).then(function (result) {
                    if (result.success) {
                        if (redirect) {
                            $state.go('viewBills');
                        }
                        else {
                            $scope.data = {};
                        }
                        swal({   title: "כל הכבוד!",
                            text: " הדוח הוזן בהצלחה ! ",
                            type: "success"
                        });
                    }
                });
            } else {
                swal({   title: "חסר מידע !",
                    text: "אחד או יותר מהפרטים שהזנת שגויים או חסרים ",
                    type: "warning"
                });
            }
        };

        function Bill() {
            return {
                userId: currentUser,
                category: $scope.data.category,
                categoryOfPayment: $scope.data.categoryOfPayment,
                amount: $scope.data.amount,
                date: $scope.data.date,
                description: $scope.data.description
            }
        }

    });
