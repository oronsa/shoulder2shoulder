angular.module('accountingShoulder.user')

.controller('viewBillsCtrl', function($scope, $state, $stateParams, currentUser, shoulderService, COLLECTIONS, filterUtils, dateUtils) {

    $scope.data = {
        category: '',
        amount: '',
        date: '',
        description: '',
        del: '',
        categoryOfPayment: '',
        sumAmount: 0,
        filterSelection: 'byMonth'
    };

    $scope.userBills = [];
    $scope.filteredBills = [];
    $scope.selectedMonth = '';
    $scope.toDate = '';
    $scope.fromDate = '';

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

    $scope.changeSelection = function (method) {
        $scope.data.filterSelection = method;
        $scope.selectedMonth = '';
        $scope.toDate = '';
        $scope.fromDate = '';
    };

    $scope.paymentMethods = [
        { _id : 1, name : 'אשראי' },
        { _id :2, name :'צ\'ק' },
        { _id : 3, name : 'מזומן' },
        { _id : 4, name : 'אחר' }
    ];

    (function init() {
        shoulderService.query(COLLECTIONS.BILLS, {'userId': {$eq: currentUser}}).then(function (result) {
            $scope.userBills = result.collection;
            dateUtils.convertDatesToMoment($scope.userBills, false);
            $scope.filteredBills = result.collection;
            $scope.months = dateUtils.generateDatesPickList($scope.userBills);
            sumAmount();
        });
    })();

    $scope.clearFilters = function () {
        $scope.selectedMonth = '';
        $scope.toDate = '';
        $scope.fromDate = '';
        $scope.data.categoryOfPayment = '';
        $scope.data.category = '';
        $scope.filteredBills = $scope.userBills;
    };

    $scope.deleteItem = function (itemId) {
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
                        "ההוצאה בוטלה.",
                        "success");
                    shoulderService.remove(COLLECTIONS.BILLS, {"_id": itemId}).then(function (result) {
                        var index = $scope.userBills.findIndex(function (item) {
                            return item._id === itemId;
                        });
                        $scope.userBills.splice(index, 1);
                        sumAmount();
                    });
                } else {
                    swal("בוטל", "ההוצאה נשמרה ",
                        "error"
                    );
                }
            });

    };

    function sumAmount() {
        $scope.data.sumAmount = 0;
        for (var i = 0; i < $scope.filteredBills.length; i++) {
            $scope.data.sumAmount += $scope.filteredBills[i].amount;
        }
    }

    function filtersChange() {
        if ($scope.userBills.length) {
            $scope.filteredBills = filterUtils.fields($scope.userBills, [$scope.data.category], ['category']);
            $scope.filteredBills = filterUtils.fields($scope.filteredBills, [$scope.data.categoryOfPayment], ['categoryOfPayment']);
            $scope.filteredBills = dateUtils.rangeFilter($scope.filteredBills, moment($scope.toDate), moment($scope.fromDate));
            if($scope.selectedMonth) {
                $scope.filteredBills = dateUtils.monthFilter($scope.filteredBills, moment(dateUtils.convertStringToDate($scope.selectedMonth)));
            }
        }
        sumAmount();
    }

    $scope.$watch(function () {
        return $scope.selectedMonth +
            $scope.data.category +
            $scope.data.categoryOfPayment +
            $scope.toDate +
            $scope.fromDate;
    }, filtersChange);

});