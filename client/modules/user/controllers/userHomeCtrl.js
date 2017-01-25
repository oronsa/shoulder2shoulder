angular.module('accountingShoulder.user')

    //
    .controller('userHomeCtrl', function ($scope, $rootScope, $state, $location, currentUser, dateUtils, $timeout, shoulderService, COLLECTIONS, drawingUtils) {

        $scope.allBills = [];
        $scope.currentBills = [];
        $scope.allReports = [];
        $scope.currentReport = {};
        $scope.selectedMonth = '';
        $scope.viewDataPie = false;
        $scope.viewDataDoughnut = false;


        (function init() {
            $scope.months = dateUtils.generateDatesPickList(dateUtils.generateDatesRange(24));
            shoulderService.query(COLLECTIONS.BILLS, {userId: currentUser}).then(function (result) {
                $scope.allBills = result.collection;
                dateUtils.convertDatesToMoment($scope.allBills, false);
                shoulderService.query(COLLECTIONS.REPORTS, {userId: currentUser}).then(function (result) {
                    $scope.allReports = result.collection;
                    dateUtils.convertDatesToMoment($scope.allReports, false);
                    $scope.selectedMonth = dateUtils.convertDateToString($scope.months[$scope.months.length / 2]);
                    updateData();
                });
            });
        })();

        $scope.$watch(function () {
            return $scope.selectedMonth;
        }, updateData);

        function updateData() {
            if ($scope.selectedMonth) {
                $scope.currentBills = getItemsByMonth($scope.allBills, dateUtils.convertStringToDate($scope.selectedMonth));
                $scope.currentReport = getItemsByMonth($scope.allReports, dateUtils.convertStringToDate($scope.selectedMonth))[0];
                drawingUtils.drawPie($scope);
                drawingUtils.drawDoughnut($scope);
            }
        }

        function getItemsByMonth(items, month) {
            var arr = [];
            for (var i = 0; i < items.length; i++) {
                if (items[i].date.month() == month.month()) {
                    arr.push(items[i]);
                }
            }
            return arr;
        }

        $scope.showOnDoughnut = function () {
            return $scope.viewDataDoughnut;
        };

        $scope.showOnPie = function () {
            return $scope.viewDataPie;
        };

    });

