var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var _db;

module.exports = {
    
    connect : function (url) {
        mongoClient.connect(url, function (error, db) {
            if (!error) {
                console.log(url + ", Connected to database");
                _db = db;
            }
        });
    },

    insert : function(collectionName, data, callback) {
        _db.collection(collectionName).insert(data, function(error, result) {
            if(error) {
                callback(error, null);
            }
            else {
                callback(null, result);
            }
        });
    },

    update : function(collectionName ,query, updatedData, options, callback) {
        if(query._id )
            query._id = ObjectId(query._id);
        _db.collection(collectionName).update(query, updatedData, options, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, result);
            }

        });
    },
    delete : function(collectionName,query,callback) {
        if(query._id )
            query._id = ObjectId(query._id);
        _db.collection(collectionName).remove(query, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, result);
            }
        });
    },

    query : function(collectionName, query, callback) {
        if(query._id )
            query._id = ObjectId(query._id);
        _db.collection(collectionName).find(query).toArray(function (error, result) {
            if(error) {
                callback(error, null);
            }
            else {
                callback(null, result);
            }
        });
    }
    
};