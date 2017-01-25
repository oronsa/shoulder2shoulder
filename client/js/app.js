
angular.module('accountingShoulder', [
    'accountingShoulder.user',
    'accountingShoulder.admin',
    'ui.router',
    'ngMessages',
    'ngResource',
    'ngMaterial',
    'ngAnimate',
    'ngAria',
    'ngSanitize',
    'mgcrea.ngStrap',
    'mgcrea.ngStrap.modal',
    'mgcrea.ngStrap.aside',
    'mgcrea.ngStrap.tooltip',
    'mgcrea.ngStrap.select',
    "chart.js",
    'ngSanitize',
    'ngCsv'
])

//
.constant('COLLECTIONS', {
    USERS : 'users',
    ADMINS : 'admins',
    REPORTS : 'reports',
    BILLS : 'bills',
    TOKEN_ACCOUNTS: 'tokenAccounts'

})
.constant('ROLES', {
    GUEST: 'guest',
    USER: 'user',
    ADMIN: 'admin',
    SUPER_ADMIN: 'superAdmin'
})
.run(function($rootScope, $state, $q, sessionService, authenticationService ) {
    $rootScope.userSession = {};
    //regular expressions
    $rootScope.regexMail=/(^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$)/;
    $rootScope.regexToken=/(^().{8}$)/;
    $rootScope.regexPhone=/(^0\d([\d]{0,1})([-]{0,1})\d{6,}$)/;
    $rootScope.regexPassword=/(^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$)/;
    $rootScope.regexUserName=/([a-z]+[0-9]+)/;
    $rootScope.regexName=/(^([א-ת]([-, ]{0,1})([א-ת]{0,10})){1,15}$)/;


    $rootScope.createSession = function(userId, type, isSuper) {
        $rootScope.userSession.userId = userId;
        $rootScope.userSession.type = type;
        $rootScope.userSession.isSuper = isSuper;
    };

    $rootScope.isAuthorized = function(action) {
        var deferred = $q.defer();
        sessionService.isLoggedIn().then(function(result) {
            $rootScope.createSession(result.userId, result.type, result.isSuper);
            var userId = result.userId;
            sessionService.isAuthorized({ userId: result.userId, type: result.type, action: action, isSuper : result.isSuper }).then(function(result) {
                if(result.isAuthorized) {
                    deferred.resolve(userId);
                }
                else {
                    $state.go(result.action);
                }
            }, function (error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    };

    $rootScope.logOut = function() {
        authenticationService.logOut().then(function(result) {
            $state.go(result.action);
        });
    }

})
.config(function($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function(date) {
        if(!date) {
            return '';
        }
        return moment(date).format('DD-MM-YYYY');
    }
});

