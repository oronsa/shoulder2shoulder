angular.module('accountingShoulder')

//
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/logIn');
    $stateProvider
        
        .state('logIn', {
            url:'/logIn',
            templateUrl: 'js/templates/logIn.html',
            controller: 'logInCtrl',
            resolve : { currentUser : function($rootScope) {
                return $rootScope.isAuthorized(this.self.name);
            }}
        })
        .state('signUp', {
            url:'/signUp',
            templateUrl : 'js/templates/signUp.html',
            controller : 'signUpCtrl',
            resolve : { currentUser : function($rootScope) {
                return $rootScope.isAuthorized(this.self.name);
            }}
        })
        .state('passwordRecovery', {
            url:'/passwordRecovery',
            templateUrl: 'js/templates/passwordRecovery.html',
            controller: 'passwordRecoveryCtrl',
            resolve : { currentUser : function($rootScope) {
                return $rootScope.isAuthorized(this.self.name);
            }}
        })
        .state('authenticateRecovery', {
            url:'/authenticateRecovery',
            templateUrl: 'js/templates/authenticateRecovery.html',
            controller: 'authenticateRecoveryCtrl',
            resolve : { currentUser : function($rootScope) {
                return $rootScope.isAuthorized(this.self.name);
            }}
        })
        .state('userProfileEdit', {
            url:'/userProfileEdit',
            templateUrl: 'js/templates/userProfileEdit.html',
            controller: 'userProfileEditCtrl',
            resolve : { currentUser : function($rootScope) {
                return $rootScope.isAuthorized(this.self.name);
            }}
        })
        .state('changePassword', {
            url:'/changePassword',
            templateUrl: 'js/templates/changePassword.html',
            controller: 'changePasswordCtrl',
            resolve : { currentUser : function($rootScope) {
                return $rootScope.isAuthorized(this.self.name);
            }}
        })
}]);
