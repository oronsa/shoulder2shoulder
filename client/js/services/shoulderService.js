
angular.module('accountingShoulder')

//
.factory('shoulderService', function ($resource, $q) {

    var baseUrl = '/api/database';
    
    function insert(collection, data) {
        var deferred = $q.defer();
        $resource(baseUrl + '/insert').save({ collection: collection, data: JSON.stringify(data) }, function (result, error) {
            deferPromise(deferred, result, error);
        });
        return deferred.promise;
    }
    
    function update(collection, query, data, options) {
        var deferred = $q.defer();
        $resource(baseUrl + '/update').save({
            collection: collection,
            query: JSON.stringify(query),
            data: JSON.stringify(data),
            options: JSON.stringify(options)
        }, function (result, error) {
            deferPromise(deferred, result, error);
        });
        return deferred.promise;
    }
    
    function query(collection, query) {
        var deferred = $q.defer();
        $resource(baseUrl + '/query').get({ collection : collection, query : JSON.stringify(query)}, function (result, error) {
            deferPromise(deferred, result, error);
        });
        return deferred.promise;
    }
    
    function remove(collection, query) {
        var deferred = $q.defer();
        $resource(baseUrl + '/delete').remove({ collection : collection, query: JSON.stringify(query)}, function (result, error) {
            deferPromise(deferred, result, error);
        });
        return deferred.promise;
    }

    return {
        insert: insert,
        update: update,
        query: query,
        remove: remove

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
