angular.module('accountingShoulder.admin')
    
.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/adminHome');
    $stateProvider
        
        .state('adminHome', {
            url:'/adminHome',
            templateUrl: 'modules/admin/templates/adminHome.html',
            controller: 'adminHomeCtrl',
            resolve : { currentUser : function($rootScope) {
                return $rootScope.isAuthorized(this.self.name);
            }}
        })
        .state('superAdminOption', {
            url:'/superAdminOption',
            templateUrl: 'modules/admin/templates/superAdminOption.html',
            controller: 'superAdminOptionCtrl',
            resolve : { currentUser : function($rootScope) {
                return $rootScope.isAuthorized(this.self.name);
            }}
        })
        .state('userView', {
            url:'/userView',
            templateUrl: 'modules/admin/templates/userView.html',
            controller: 'userViewCtrl',
            resolve : { currentUser : function($rootScope) {
                return $rootScope.isAuthorized(this.self.name);
            }},
        })
    
}]);

