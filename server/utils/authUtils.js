var mongoUtils = require('./mongoUtils');
var randToken = require('rand-token');
var bcryptJS = require('bcryptjs');
var config = require('../../config.json');
var COLLECTIONS = config.COLLECTIONS;
var ROLES = config.ROLES;
var APP_ENTRIES = config.APP_ENTRIES;


module.exports = {

    deleteUser: function (data, callBack) {
        mongoUtils.query(COLLECTIONS.USERS, {'isSuper': true}, function (error, result) {
            if (error) {
                callBack(error,null);
            }
            if (result.length == 1 && data.isSuper) {
                callBack(null, {msg: 'finalSuper',success:false});
            }
            else{
                mongoUtils.query(COLLECTIONS.USERS, {'_id': data.adminId}, function (error, result) {
                    if (error) {
                        callBack(error, null);
                    }
                    if (!result.length) {
                        callBack(null, {success: false});
                    }
                    else if (result.length == 1) {
                        var adminObj = result[0];
                        if (bcryptJS.compareSync(data.adminPassword, adminObj.password)) {
                            mongoUtils.delete(COLLECTIONS.BILLS, {'userId': data.userId}, function (error, result) {
                                if (error) {
                                    callBack(error, null);
                                }
                                else if (result) {
                                    mongoUtils.delete(COLLECTIONS.REPORTS, {'userId': data.userId}, function (error, result) {
                                        if (error) {
                                            callBack(error, null);
                                        }
                                        else if (result) {
                                            mongoUtils.delete(COLLECTIONS.USERS, {'_id': data.userId}, function (error, result) {
                                                if (error) {
                                                    callBack(error, null);
                                                }
                                                else if (result) {
                                                    callBack(null, {success: true});
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            callBack(null, {msg: 'invalidPassword'});
                        }
                    }
                })
            }
        });
    },
    editPassword: function (userData, callBack) {
        mongoUtils.query(COLLECTIONS.USERS, {'email': userData.email}, function (error, result) {
            if (error) {
                callBack(error, null);
            }
            if (!result.length) {
                callBack(null, {success: false});
            }
            else if (result.length == 1) {
                var userObj = result[0];
                if (bcryptJS.compareSync(userData.tempPassword, userObj.password)) {
                    var salt = bcryptJS.genSaltSync(8);
                    userData.password = bcryptJS.hashSync(userData.password, salt);
                    mongoUtils.update(COLLECTIONS.USERS, {email: userData.email}, {$set: {password: userData.password}}, {},
                        function (error, result) {
                            if (error) {
                                callBack(error, null);
                            }
                            else {
                                callBack(null, {obj: result, success: true, action: APP_ENTRIES.guest});
                            }
                        }
                    );

                }
                else {
                    callBack(null, {msg: 'invalidPassword', success: false});
                }
            }
        })
    },
    changePassword: function (userData, callBack) {
        mongoUtils.query(COLLECTIONS.RECOVERY_TOKENS, {$and: [{'email': userData.email}, {'token': userData.tempPassword}]},
            function (error, result) {
                if (error) {
                    callBack(error, null);
                }
                if (!result.length) {
                    callBack(null, {msg: 'error', success: false});
                }
                else if (result.length == 1) {

                    var userObj = result[0];
                    var salt = bcryptJS.genSaltSync(8);
                    userData.password = bcryptJS.hashSync(userData.password, salt);
                    if (userData.tempPassword == userObj.token) {
                        mongoUtils.update(COLLECTIONS.USERS, {email: userData.email}, {$set: {password: userData.password}}, {},
                            function (error, result) {
                                if (error) {
                                    callBack(error, null);
                                }
                                else {
                                    callBack(null, {obj: result, success: true, action: APP_ENTRIES.guest});
                                }
                            }
                        );
                    }
                    else {
                        callBack(null, {msg: 'invalidPassword', success: false});
                    }
                }
            }
        );
    },

    recovery: function (userData, callBack) {
        mongoUtils.query(COLLECTIONS.USERS, {'email': {$eq: userData.email}},
            function (error, result) {
                if (result.length) {
                    var genToken = randToken.generate(8);
                    userData.token = genToken;
                    mongoUtils.query(COLLECTIONS.RECOVERY_TOKENS, {'email': userData.email}, function (erroe, result) {
                        if (result.length != 0) {
                            mongoUtils.update(COLLECTIONS.RECOVERY_TOKENS, {'email': userData.email}, {
                                    'email': userData.email,
                                    'token': userData.token
                                }, {},
                                function (error, result) {
                                    if (error) {
                                        callBack(error, null);
                                    }
                                    else {
                                        callBack(null, {success: true});
                                    }
                                });
                        }
                        else {
                            mongoUtils.insert(COLLECTIONS.RECOVERY_TOKENS, {'email': userData.email, 'token': genToken},
                                function (error, result) {
                                    if (error) {
                                        callBack(error, null);
                                    }
                                    else {
                                        callBack(null, {obj: result.ops[0], success: true});
                                    }
                                });
                        }
                    });

                }
                else if (!result.length) {
                    callBack(null, {msg: 'No such mail in our data base', success: false});

                }
                else {
                    callBack(error, null);
                }
            });

    },

    getToken: function (userData, callback) {
        var genToken = randToken.generate(8);
        mongoUtils.query(COLLECTIONS.TOKEN_ACCOUNTS, {'email': {$eq: userData.email}},
            function (error, result) {
                if (error) {
                    callback(error, null);
                }
                else {
                    userData.token = genToken;
                    if (result.length > 0) {
                        mongoUtils.update(COLLECTIONS.TOKEN_ACCOUNTS, {email: userData.email}, {$set: {token: genToken}}, {},
                            function (error, result) {
                                if (error) {
                                    callback(error, null);
                                }
                                else {
                                    callback(null, {obj: result, success: true});
                                }
                            }
                        );
                    }
                    else {
                        mongoUtils.insert(COLLECTIONS.TOKEN_ACCOUNTS, userData,
                            function (error, result) {
                                if (error) {
                                    callback(error, null);
                                }
                                else {
                                    callback(null, {obj: result.ops[0], success: true});
                                }
                            }
                        );
                    }
                }
            }
        );
    },

    signUp: function (userData, callback) {
        mongoUtils.query(COLLECTIONS.TOKEN_ACCOUNTS, {'email': {$eq: userData.email}, 'token': {$eq: userData.token}},
            function (error, result) {
                if (error) {
                    callback(error, null);
                }
                else if (!result.length) {
                    callback(null, {msg: 'missingToken', success: false});
                }
                else {
                    var type = result[0].type;
                    mongoUtils.query(COLLECTIONS.USERS, {'email': {$eq: userData.email}},
                        function (error, result) {
                            if (error) {
                                callback(error, null);
                            }
                            else if (result.length) {
                                callback(null, {msg: 'alreadySignedUp', success: false});
                            }
                            else {
                                var salt = bcryptJS.genSaltSync(8);
                                userData.password = bcryptJS.hashSync(userData.password, salt);
                                userData.type = type;
                                mongoUtils.delete(COLLECTIONS.TOKEN_ACCOUNTS, {token: userData.token},
                                    function (error, result) {
                                        if (error) {
                                            callback(error, null);
                                        }
                                        else {
                                            delete userData.token;
                                            delete userData.confirmPassword;
                                            if (userData.type === ROLES.SUPER_ADMIN) {
                                                userData.type = ROLES.ADMIN;
                                                userData.isSuper = true;
                                            }
                                            mongoUtils.insert(COLLECTIONS.USERS, userData,
                                                function (error, result) {
                                                    if (error) {
                                                        callback(error, null);
                                                    }
                                                    else {
                                                        callback(null, {obj: result, success: true});
                                                    }
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            }
        );
    },

    signIn: function (userData, callback) {
        mongoUtils.query(COLLECTIONS.USERS, {'email': {$eq: userData.email}},
            function (error, result) {
                if (error) {
                    callback(error, null);
                }
                else if (!result.length) {
                    callback(null, {msg: 'mailNotFound', success: false, action: APP_ENTRIES.guest});
                }
                else {
                    var userObj = result[0];
                    if (bcryptJS.compareSync(userData.password, userObj.password)) {
                        delete userObj.password;
                        callback(null, {obj: userObj, success: true, action: APP_ENTRIES[userObj.type]});
                    }
                    else {
                        callback(null, {msg: 'IncorrectPassword', success: false, action: APP_ENTRIES.guest});
                    }
                }
            }
        );
    },

    changeEmail: function (currentEmail, requestedEmail, userId, callback) {
        var genToken = randToken.generate(8);

        mongoUtils.query(COLLECTIONS.USERS, {'email': requestedEmail}, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else if (result.length) {
                callback(null, {msg: 'requestedEmailExists', success: false});
            }
            else {
                mongoUtils.query(COLLECTIONS.USERS, {'email': currentEmail}, function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else if (!result.length || result[0]._id != userId) {
                        callback(null, {msg: 'oldEmailWrong', success: false});
                    }
                    else {
                        mongoUtils.update(COLLECTIONS.USERS, {email: result[0].email}, {$set: {email: requestedEmail}}, {},
                            function (error, result) {
                                if (error) {
                                    callback(error, null)
                                }
                                else if (!result.result.nModified) {
                                    callback(null, {msg: 'updateFailed', success: false});
                                }
                                else {
                                    callback(null, {obj: result, success: true, action: APP_ENTRIES.guest});
                                }
                            }
                        );
                    }
                });
            }
        });
    }

};
