angular.module('accountingShoulder.admin')

//
.controller('userViewCtrl', function ($rootScope, $scope, $state, $stateParams, adminService, shoulderService, COLLECTIONS, filterUtils, dateUtils, currentUser, drawingUtils) {

    $scope.selectedUser = {};
    $scope.allUsers = [];
    $scope.userBills = [];
    $scope.userReports = [];
    $scope.filteredBills = [];
    $scope.selectedMonthStatus = '';
    $scope.selectedMonthBills = '';

    $scope.data = { category: '', amount: '', description: '', del: '', categoryOfPayment: '', sumAmount: 0,
        filterSelection: 'byMonth', toDate : '', fromDate : '', selectedUserName : ''
    };

    $scope.displayValues = ['מצב חשבון', 'פירוט חשבוניות'];

    $scope.categories = [ {_id: 1, name: 'אוכל'}, {_id: 2, name: 'ביגוד'}, {_id: 3, name: 'פנאי'}, {_id: 4, name: 'חשבונות'},
        {_id: 5, name: 'רכב'}, {_id: 6, name: 'בריאות'}, {_id: 7, name: 'לימודים'}, {_id: 8, name: 'אחר'}
    ];

    $scope.paymentMethods = [
        {_id: 1, name: 'אשראי'},
        {_id: 2, name: 'מזומן'},
        {_id: 3, name: 'צ\'ק'},
        {_id: 4, name: 'אחר'}

    ];

    $scope.clearFilters = function () {
        $scope.data.toDate = '';
        $scope.data.fromDate = '';
        $scope.data.categoryOfPayment = '';
        $scope.data.category = '';
        $scope.selectedMonthBills = '';
        $scope.currentBills = $scope.userBills;
        sumAmount();
    };

    $scope.changeDisplay = function (newDisplay) {
        $scope.display = newDisplay;
        if(newDisplay === 'פירוט חשבוניות') {
            $scope.clearFilters();
            $scope.selectedMonthBills = $scope.selectedMonthStatus;
            filtersChange();
        }
        else {
            if($scope.selectedMonthBills) {
                $scope.selectedMonthStatus = $scope.selectedMonthBills;
            }
            else if($scope.selectedMonthStatus) {
                $scope.selectedMonthStatus = dateUtils.convertDateToString($scope.months[$scope.months.length / 2]);
            }
        }
    };

    function sumAmount() {
        $scope.data.sumAmount = 0;
        for (var i = 0; i <$scope.currentBills.length; i++) {
            $scope.data.sumAmount += $scope.currentBills[i].amount;
        }
    }

    (function init() {
        $scope.changeDisplay('מצב חשבון');
        $scope.months = dateUtils.generateDatesPickList(dateUtils.generateDatesRange(24));
        $scope.selectedMonthStatus = dateUtils.convertDateToString($scope.months[$scope.months.length / 2]);
        var query;
        if($rootScope.userSession.isSuper) {
            query = { type : 'user'};
        }
        else {
            query = { 'leader.leaderId' : currentUser};
        }
        
        shoulderService.query(COLLECTIONS.USERS, query).then(function(result) {
            if(result.collection && result.collection.length) {
                $scope.allUsers = result.collection;
                $scope.selectedUser = $scope.allUsers[0];
                $scope.data.selectedUserName = $scope.selectedUser.firstName + ' ' + $scope.selectedUser.lastName + ' - '+ $scope.selectedUser.userName;
                onFamilyChange();
            }
        });

    })();

    function getUserByName(name) {
        var userName = $scope.data.selectedUserName.substr($scope.data.selectedUserName.indexOf('-') + 2, $scope.data.selectedUserName.length);
        return _.find($scope.allUsers, function(item) {
            return item.userName === userName;
        });
    }

    function getDataByUserId(userId) {
        shoulderService.query(COLLECTIONS.BILLS, { userId : userId }).then(function (result) {
            $scope.userBills = result.collection;
            dateUtils.convertDatesToMoment($scope.userBills, false);

            shoulderService.query(COLLECTIONS.REPORTS, { userId : userId }).then(function (result) {
                $scope.userReports = result.collection;
                dateUtils.convertDatesToMoment($scope.userReports, false);
                filtersChange();
            });
        });
    }

    function onFamilyChange() {
        if($scope.data.selectedUserName) {
            $scope.selectedUser = getUserByName($scope.data.selectedUserName);
            getDataByUserId($scope.selectedUser._id);
            filtersChange();
        }
    }

    function filtersChange() {
        if($scope.userBills.length) {
            $scope.currentBills = dateUtils.monthFilter($scope.userBills, dateUtils.convertStringToDate($scope.selectedMonthStatus));
            $scope.currentBills = dateUtils.rangeFilter($scope.currentBills, moment($scope.data.toDate), moment($scope.data.fromDate));
            $scope.currentBills = filterUtils.fields($scope.currentBills, [$scope.data.category], ['category']);
            $scope.currentBills = filterUtils.fields($scope.currentBills, [$scope.data.categoryOfPayment], ['categoryOfPayment']);
            drawingUtils.drawPie($scope);
        }
        else {
            $scope.currentBills = [];
        }
        if($scope.userReports.length) {
            $scope.currentReport = dateUtils.monthFilter($scope.userReports, dateUtils.convertStringToDate($scope.selectedMonthStatus))[0];
            drawingUtils.drawDoughnut($scope);
        }
        else {
            $scope.currentReport = null;
        }
        sumAmount();
        window.dispatchEvent(new Event('resize'));
        
    }
 
    $scope.changeSelection = function (method) {
        $scope.data.filterSelection = method;
        $scope.selectedMonthBills = '';
        $scope.selectedMonthStatus = '';
        $scope.data.toDate = '';
        $scope.data.fromDate = '';
        filtersChange();
    };

    $scope.billsMonthChange = function(newMonth) {
        $scope.selectedMonthStatus =  dateUtils.convertDateToString(newMonth);
        filtersChange();
    }

    $scope.$watch(function() {
        return $scope.data.selectedUserName;
    }, onFamilyChange);

    $scope.$watch(function() {
        return $scope.selectedMonthStatus + $scope.data.toDate + $scope.data.fromDate + $scope.data.category + $scope.data.categoryOfPayment;
    }, filtersChange);

});
