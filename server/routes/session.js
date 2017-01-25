var router = require('express').Router();
var client = require('../utils/clientUtil');
var config = require('../../config.json');
var ROLES = config.ROLES;
var PATHS = config.PATHS;

router.get('/isLoggedIn', function(request, response) {
    if(request.session && request.session.userId) {
        client.sendObjectResponse(response, { userId : request.session.userId, type : request.session.type, isSuper : request.session.isSuper });
    }
    else {
        client.sendObjectResponse(response, { userId : null, type : ROLES.GUEST });
    }
});

router.post('/isAuthorized', function(request, response) {
    var userData = JSON.parse(request.body.userData);
    var type = userData.type;
    var userId = userData.userId;
    var action = userData.action;

    if(PATHS[type].hasOwnProperty(action)) {
        if(type === ROLES.ADMIN && userData.isSuper && action === PATHS.admin.adminOption) {
            client.sendObjectResponse(response, { isAuthorized : false, userId : userId , action : PATHS.admin.superAdminOption });
        }else if(type === ROLES.ADMIN && !userData.isSuper && action === PATHS.admin.superAdminOption) {
            client.sendObjectResponse(response, { isAuthorized : false, userId : userId , action : PATHS.admin.adminOption });
        }
        else {
            client.sendObjectResponse(response, { isAuthorized : true, userId : userId , action : action, type : type });
        }
    }
    else if(type === ROLES.USER && PATHS[ROLES.GUEST].hasOwnProperty(action)) {
        client.sendObjectResponse(response, { isAuthorized : false, userId : userId , action : 'userHome' });
    }
    else if(type === ROLES.ADMIN && PATHS[ROLES.GUEST].hasOwnProperty(action)) {
        client.sendObjectResponse(response, { isAuthorized : false, userId : userId , action : 'adminHome' });
    }
    else {
        client.sendObjectResponse(response, { isAuthorized : false, userId : '', action: PATHS.guest.logIn });
    }
});

module.exports = router;