angular.module('accountingShoulder')

    //
    .factory('authenticationService', function ($resource, $q) {

        var baseUrl = 'api/authentication';
        function changePassword(userDetails){
            var deferred = $q.defer();
            $resource(baseUrl + '/changePassword').save({ userData:JSON.stringify(userDetails)}, function (result, error) {
                deferPromise(deferred, result, error);
            });
            return deferred.promise;
        }
        function editPassword(userDetails){
            var deferred = $q.defer();
            $resource(baseUrl + '/editPassword').save({ userData:JSON.stringify(userDetails)}, function (result, error) {
                deferPromise(deferred, result, error);
            });
            return deferred.promise;
        }
        function recovery(userDetails){
            var deferred = $q.defer();
            $resource(baseUrl + '/recovery').save({ userData: JSON.stringify(userDetails) }, function (result, error) {
                deferPromise(deferred, result, error);
            });
            return deferred.promise;
        }
        function signUp(userDetails) {
            var deferred = $q.defer();
             $resource(baseUrl + '/signUp').save({ userData: JSON.stringify(userDetails) }, function (result, error) {
                 deferPromise(deferred, result, error);
             });
            return deferred.promise;
        }

        function logIn(userData) {
            var deferred = $q.defer();
            $resource(baseUrl + '/logIn').save({ userData : JSON.stringify(userData) }, function (result, error) {
                deferPromise(deferred, result, error);
            });
            return deferred.promise;
        }

        function logOut() {
            var deferred = $q.defer();
            $resource(baseUrl + '/logOut').get(function (result, error) {
                deferPromise(deferred, result, error);
            });
            return deferred.promise;
        }

        function changeEmail(currentEmail, newEmail, userId) {
            var deferred = $q.defer();
            $resource(baseUrl + '/changeEmail').save({ currentEmail : currentEmail, newEmail : newEmail, userId : userId}, function (result, error) {
                deferPromise(deferred, result, error);
            });
            return deferred.promise;
        }

        function applyNewEmail(newEmail, token) {
            var deferred = $q.defer();
            $resource(baseUrl + '/applyNewEmail').save({ newEmail : newEmail, token : token }, function (result, error) {
                deferPromise(deferred, result, error);
            });
            return deferred.promise;
        }

        return {
            applyNewEmail : applyNewEmail,
            changeEmail : changeEmail,
            signUp: signUp,
            logIn : logIn,
            logOut : logOut,
            recovery: recovery,
            changePassword : changePassword,
            editPassword:editPassword
        };

        function deferPromise(deferred, result, error) {
            if (result) {
                deferred.resolve(result);
            }
            else {
                deferred.reject(error);
            }
        }
    });