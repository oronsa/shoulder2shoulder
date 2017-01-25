var router = require('express').Router();
var authenticator = require('../utils/authUtils');
var httpStatus = require('http-status-codes');
var client = require('../utils/clientUtil');
var config = require('../../config.json');
var email = require('../utils/email');
var ROLES = config.ROLES;
var PATHS = config.PATHS;

router.post('/signUp', function (request, response) {
    var userData = JSON.parse(request.body.userData);   //get the details about current user
    authenticator.signUp(userData, function (error, result) {
            if (error) {
                client.sendErrorResponse(response, error, httpStatus.INTERNAL_SERVER_ERROR);
            }
            else if (result.success) {
                email.welcomeEmail(userData.email, userData.firstName);
                client.sendObjectResponse(response, result);
            }
           else{
                client.sendObjectResponse(response, result);
            }
        }
    );
});

router.post('/logIn', function (request, response) {
    var userData = JSON.parse(request.body.userData);
    authenticator.signIn(userData,
        function (error, result) {
            if (error) {
                client.sendErrorResponse(response, error, httpStatus.INTERNAL_SERVER_ERROR);
            }
            else if(result.success){
                request.session.userId = result.obj._id;
                request.session.type = result.obj.type;
                request.session.isSuper = result.obj.isSuper;
                client.sendObjectResponse(response, result);
            }
            else{
                client.sendObjectResponse(response, result);
            }
        }
    );
});

router.post('/recovery', function (request, response) {
    var userData = JSON.parse(request.body.userData);   //get the details about current user
    authenticator.recovery(userData,
        function (error, result) {
            if (error) {
                client.sendErrorResponse(response, 'Recovery is failed, try again', httpStatus.INTERNAL_SERVER_ERROR);
            }
            else if (result) {
                if (result.success) {
                    email.recoveryMail(userData.email, userData.email, userData.token);
                    client.sendObjectResponse(response, result);
                }
                else {
                    client.sendObjectResponse(response, result);
                }
            }
        }
    );
});
router.post('/editPassword', function (request, response) {
    var userData = JSON.parse(request.body.userData);   //get the details about current user
    authenticator.editPassword(userData,
        function (error, result) {
            if (error) {
                client.sendErrorResponse(response, error, httpStatus.INTERNAL_SERVER_ERROR);
            }
            else if (result) {
                client.sendObjectResponse(response, result);
            }
        }
    );
});
router.post('/changePassword', function (request, response) {
    var userData = JSON.parse(request.body.userData);   //get the details about current user
    console.log(userData);
    authenticator.changePassword(userData,
        function (error, result) {
            if (error) {
                client.sendErrorResponse(response, error, httpStatus.INTERNAL_SERVER_ERROR);
            }
            else if (result) {
                client.sendObjectResponse(response, result);
            }
        }
    );
});

router.post('/getToken', function (request, response) {
    var userData = JSON.parse(request.body.userData);   //get the details about current user
    authenticator.getToken(userData,
        function (error, result) {
            if (error) {
                client.sendErrorResponse(response, 'Generating Token failed, try again', httpStatus.INTERNAL_SERVER_ERROR);
            }
            else if (result) {
                email.tokenEmail(userData.email, userData.email, userData.token);
                client.sendObjectResponse(response, result);
            }
        }
    );
});

router.get('/logOut', function (request, response) {
    request.session.reset();
    client.sendObjectResponse(response, { success: true, userId: null, type: ROLES.GUEST, action: PATHS.guest.logIn });
});

router.post('/changeEmail', function(request, response) {
    authenticator.changeEmail(request.body.currentEmail, request.body.newEmail, request.body.userId,
        function(error, result) {
            if(error) {
                client.sendErrorResponse(response, error, httpStatus.INTERNAL_SERVER_ERROR);
            }
            else {
                client.sendObjectResponse(response, result);
            }
        }
    );
});

router.delete('/deleteUser',function(request,response){
    var data = JSON.parse(request.query.data);
    authenticator.deleteUser(data,function(error, result) {
        if(error) {
            client.sendErrorResponse(response, error, httpStatus.INTERNAL_SERVER_ERROR);
        }
        else {
            client.sendObjectResponse(response, result);
        }
    })
});

module.exports = router;