var router = require('express').Router();
var httpStatus = require('http-status-codes');
var mongoUtils = require('../utils/mongoUtils');
var client = require('../utils/clientUtil');





router.post("/insert", function(request, response) {
    mongoUtils.insert(request.body.collection, JSON.parse(request.body.data), function (error, result) {
        if(result) {
            client.sendObjectResponse(response, { object : result, success : true });
        }
        else {
            client.sendErrorResponse(response, error, httpStatus.INTERNAL_SERVER_ERROR);
        }
    });
});

router.post("/update", function(request, response) {
    mongoUtils.update(request.body.collection, JSON.parse(request.body.query), JSON.parse(request.body.data), JSON.parse(request.body.options), function (error, result) {
        if(error)
            client.sendErrorResponse(response, error, httpStatus.INTERNAL_SERVER_ERROR);
        else
            client.sendObjectResponse(response, { object : result, success: true });
    });
});

router.get('/query', function(request, response) {
    mongoUtils.query(request.query.collection, JSON.parse(request.query.query), function (error, result) {
        if(result) {
            ensureData(result);
            client.sendObjectResponse(response, { collection : result, success : true });
        }
        else {
            client.sendErrorResponse(response, error, httpStatus.INTERNAL_SERVER_ERROR);
        }
    });
});

router.delete("/delete", function(request, response) {
    mongoUtils.delete(request.query.collection, JSON.parse(request.query.query), function (error, result) {
        if (error){
            client.sendErrorResponse(error, httpStatus.INTERNAL_SERVER_ERROR);
        }
        else {
            client.sendObjectResponse(response, result);
        }
    });
});

function ensureData(items) {
    if(items && items.length && items[0].hasOwnProperty('type')) {
        for(var i = 0; i < items.length; i++) {
            delete items[i]['password'];
        }
    }
}

module.exports = router;
