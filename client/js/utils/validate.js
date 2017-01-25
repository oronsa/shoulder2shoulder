angular.module('accountingShoulder')

    //
    .factory('validateUtils', function () {

        var validateEmail = function validateEmail(email) {
            if (!email) {
                swal({   title: "שגיאה!",
                    text: " שים לב: מייל אינו תקין",
                    type: "warning"
                });
                return false;
            }
            return true;
        };
        var validateToken = function validateToken(token) {
            if (!token) {
                swal({   title: "שגיאה!",
                    text: "מפתח אינו תקין בדוק את המפתח אשר נשלח אליך למייל",
                    type: "warning"
                });
                return false;
            }
            return true;
        };

        var validatePassword = function validatePassword(password) {
            if (!password) {
                swal({   title: "שגיאה!",
                    text: "סיסמא צריכה להכיל אות קטנה אות גדולה ומספרים באורך של 6 תווים לפחות",
                    type: "error"
                });
                return false;
            }
            return true;
        };

        var validateConfirmPassword = function validateConfirmPassword(confirmPassword) {
            if (!confirmPassword) {
                swal({   title: "שגיאה!",
                    text: "אישור סיסמא  סיסמא צריך להכיל אות קטנה אות גדולה ומספרים באורך של 6 תווים לפחות",
                    type: "warning"
                });
                return false;
            }
            return true;
        };

        var validateUserName = function validateUserName(userName) {
            if (!userName) {
                swal({   title: "שגיאה!",
                    text: "שם משתמש זה אינו תקין הזן שם משתמש באנגלית לדוגמא : yosi570",
                    type: "warning"
                });
                return false;
            }
            return true;
        };
        var validateFirstName = function validateFirstName(firstName) {
            if (!firstName) {
                swal({   title: "שגיאה!",
                    text: " שים לב: שם פרטי זה אינו תקין הזן שם בעברית בלבד",
                    type: "warning"
                });
                return false;
            }
            return true;
        };
        var validateLastName = function validateLastName(lastName) {
            if (!lastName) {
                swal({   title: "שגיאה!",
                    text: " שים לב: שם משפחה זה אינו תקין הזן שם בעברית בלבד",
                    type: "warning"
                });
                return false;
            }
            return true;

        };
        var validateAddress = function validateAddress(address) {
            if (!address) {
                swal({   title: "שגיאה!",
                    text: " שים לב: כתובת אינה תקינה",
                    type: "warning"
                });
                return false;
            }
            return true;
        };
        var validatePhone1 = function validatePhone1(phone1) {
            if (!phone1) {
                swal({   title: "שגיאה!",
                    text: " שים לב: מספר טלפון מס 1 אינו תקין",
                    type: "warning"
                });
                return false;
            }
            return true;
        };
        var validatePhone2 = function validatePhone2(phone2) {
            if(!phone2){
                return true;
            }else {
                re = /(^0\d([\d]{0,1})([-]{0,1})\d{6,}$)/;
                if (!(re.test(phone2))) {
                    swal({
                        title: "שגיאה!",
                        text: " שים לב: מספר טלפון מס 2 אינו תקין",
                        type: "warning"
                    });
                    return false;
                }
                return true;
            }

        };

        function validateForm(userData) {
            var returnValue;
            returnValue = validateEmail(userData.email);
            if (!returnValue) {
                return false;
            }
            returnValue = validateToken(userData.token);
            if (!returnValue) {
                return false;
            }
            returnValue = validatePassword(userData.password);
            if (!returnValue) {
                return false;
            }
            returnValue = validateConfirmPassword(userData.confirmPassword);
            if (!returnValue) {
                return false;
            }
            returnValue = validateUserName(userData.userName);
            if (!returnValue) {
                return false;
            }
            returnValue = validateFirstName(userData.firstName);
            if (!returnValue) {
                return false;
            }
            returnValue = validateLastName(userData.lastName);
            if (!returnValue) {
                return false;
            }
            returnValue = validateAddress(userData.address);
            if (!returnValue) {
                return false;
            }
            returnValue = validatePhone1(userData.phone1);
            if (!returnValue) {
                return false;
            }
            returnValue = validatePhone2(userData.phone2);
            if (!returnValue) {
                return false;
            }
            if(userData.password!=userData.confirmPassword){
                swal({   title: "שגיאה!",
                    text: " שים לב: סיסמא ואישור סיסמא צריכים להיות זהות",
                    type: "warning"
                });
                return false;
            }
            return true;
        }

        return {
            validateForm: validateForm,
            validateEmail:validateEmail,
            validateToken:validateToken,
            validatePassword:validatePassword,
            validateConfirmPassword:validateConfirmPassword,
            validateUserName:validateUserName,
            validateFirstName:validateFirstName,
            validateLastName:validateLastName,
            validateAddress:validateAddress,
            validatePhone1:validatePhone1,
            validatePhone2:validatePhone2

        };
    });