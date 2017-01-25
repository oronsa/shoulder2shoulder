
angular.module('accountingShoulder')

//
.factory('sessionService', function ($resource, $q) {

    var baseUrl = '/api/session';

    function isLoggedIn() {
        var deferred = $q.defer();
        $resource(baseUrl + '/isLoggedIn').get(function (result, error) {
            deferPromise(deferred, result, error);
        });
        return deferred.promise; 
    }

    function isAuthorized(userData) {
        var deferred = $q.defer();
        $resource(baseUrl + '/isAuthorized').save({ userData : JSON.stringify(userData) }, function (result, error) {
            deferPromise(deferred, result, error);
        });
        return deferred.promise;
    }

    return {
        isLoggedIn : isLoggedIn,
        isAuthorized : isAuthorized
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
