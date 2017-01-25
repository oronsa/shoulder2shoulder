
angular.module('accountingShoulder.admin')

    .factory('adminService', function ($resource, $q) {
        var baseUrl = 'api/authentication';

        function getToken(userData) {
            var deferred = $q.defer();
            $resource(baseUrl + '/getToken').save({
                userData: JSON.stringify(userData)
            }, function (result, error) {
                deferPromise(deferred, result, error)
            });
            return deferred.promise;
        }
        function deleteUser(data) {
            var deferred = $q.defer();
            $resource(baseUrl + '/deleteUser').remove({
                data: JSON.stringify(data)
            }, function (result, error) {
                deferPromise(deferred, result, error)
            });
            return deferred.promise;
        }

        function deferPromise(deferred, result, error) {
            if (result) {
                deferred.resolve(result);
            }
            else {
                deferred.reject(error);
            }
        }

        return {
            getToken: getToken,
            deleteUser:deleteUser
        }

    });