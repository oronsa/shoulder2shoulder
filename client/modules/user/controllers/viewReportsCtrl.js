
angular.module('accountingShoulder.user')

    .controller('viewReportsCtrl', function($scope, $state, $stateParams, currentUser,dateUtils, shoulderService, COLLECTIONS) {
        $scope.allReports = [];
        $scope.filteredReports = [];

        $scope.months = [];
        $scope.data = { totalAmount : 0 };

        (function init() {
            $scope.months = dateUtils.generateDatesPickList(dateUtils.generateDatesRange(24));
            shoulderService.query(COLLECTIONS.REPORTS, { userId : currentUser }).then(function(result) {
                $scope.allReports = result.collection;
                dateUtils.convertDatesToMoment($scope.allReports, false);
                filtersChange();
                calculateAmount();
            });

        })();

        $scope.deleteItem = function(report){
            swal({
                    title: "האם אתה בטוח ?",
                    text: "לא תוכל לשחזר את המידע !",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "בסדר! מחק..",
                    cancelButtonText: " ביטול ",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function(isConfirm) {
                    if (isConfirm)
                    {
                        swal("נמחק!",
                            "הדוח הוסר מהמערכת.",
                            "success");
                        shoulderService.remove(COLLECTIONS.REPORTS, { "_id" : report._id }).then(function(result) {
                            $scope.allReports.splice($scope.allReports.findIndex(function(item) { return item._id === report._id; }), 1);
                            calculateAmount();
                        });

                    } else {
                        swal("בוטל", "הדוח נשמר ",
                            "error"
                        );
                    }
                });
        };

        function calculateAmount() {
            $scope.data.totalAmount = 0;
            if($scope.filteredReports.length) {
                for(var i = 0; i < $scope.filteredReports.length; i++) {
                    $scope.data.totalAmount += $scope.sumAmountReport($scope.filteredReports[i]);
                }
            }
        }

        $scope.sumAmountReport = function(item) {
            return item.alimony + item.allowances + item.childrenAllowances + item.rent + item.salary + item.other;
        }

        $scope.$watch(function() {
            return $scope.fromMonth + $scope.toMonth;
        }, filtersChange);

        function filtersChange() {
            if($scope.allReports && $scope.fromMonth && $scope.toMonth) {
                $scope.filteredReports = dateUtils.rangeFilter($scope.allReports, dateUtils.convertStringToDate($scope.toMonth), dateUtils.convertStringToDate($scope.fromMonth));
            }
            else {
                $scope.filteredReports = $scope.allReports;
            }
            calculateAmount();
        }

        $scope.clearFilters = function() {
            $scope.fromMonth = '';
            $scope.toMonth = '';
            filtersChange();
        }

    });