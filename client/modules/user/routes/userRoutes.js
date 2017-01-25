angular.module('accountingShoulder.user')


.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/userHome');
    $stateProvider

        .state('userHome', {
            url:'/userHome',
            templateUrl: 'modules/user/templates/userHome.html',
            controller: 'userHomeCtrl',
            resolve : { currentUser : function($rootScope) {
                return $rootScope.isAuthorized(this.self.name);
            }}
        })
        .state('monthlyReport', {
            url:'/monthlyReport',
            templateUrl: 'modules/user/templates/monthlyReport.html',
            controller: 'monthlyReportCtrl',
            resolve : { currentUser : function($rootScope) {
                return $rootScope.isAuthorized(this.self.name);
            }}
        })
        .state('viewReports', {
            url:'/viewReports',
            templateUrl: 'modules/user/templates/viewReports.html',
            controller: 'viewReportsCtrl',
            resolve : { currentUser : function($rootScope) {
                return $rootScope.isAuthorized(this.self.name);
            }}
        })
        .state('addBill', {
            url:'/addBill',
            templateUrl: 'modules/user/templates/addBill.html',
            controller: 'addBillCtrl',
            resolve : { currentUser : function($rootScope) {
                return $rootScope.isAuthorized(this.self.name);
            }}
        })
        .state('viewBills', {
            url:'/viewBills',
            templateUrl: 'modules/user/templates/viewBills.html',
            controller: 'viewBillsCtrl',
            resolve : { currentUser : function($rootScope) {
                return $rootScope.isAuthorized(this.self.name);
            }}
        })
    }
]);