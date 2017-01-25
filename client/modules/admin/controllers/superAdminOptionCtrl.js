angular.module('accountingShoulder.admin')

    .controller('superAdminOptionCtrl', function ($rootScope, $scope, $state, adminService, ROLES, COLLECTIONS, currentUser, shoulderService, validateUtils) {


        $scope.data={password:''};
        $scope.allFamilies = [];
        $scope.userNames = [];
        $scope.allLeaders = [];
        $scope.allUsers=[];
        $scope.data = {
            email: '',
            type: ''
        };
        $scope.selectedLeader = {};
        $scope.selectedUser = {};
        $scope.selectedFamily={};

        (function init() {
            shoulderService.query(COLLECTIONS.USERS, {'type': {$eq: ROLES.USER}}).then(function (result) {
                $scope.allFamilies = result.collection;
                shoulderService.query(COLLECTIONS.USERS, {'type': {$eq: ROLES.ADMIN}}).then(function (result) {
                    $scope.allLeaders = result.collection;
                    $scope.allUsers= $scope.allFamilies.concat( $scope.allLeaders);
                });
            });
        })();
        $scope.submitData = function () {
            if (validateUtils.validateEmail($scope.data.email)) {
                if ($scope.data.type) {
                    adminService.getToken({email: $scope.data.email, type: $scope.data.type}).then(function (result) {
                        if (result.success) {
                            swal("הצלחת!", "המפתח נשלח בהצלחה", "success");
                            $state.go($state.current, {}, {reload: true});
                        }
                    });
                } else {
                    swal({
                        title: "שגיאה!",
                        text: "לא הזנת סוג משתמש, בחר :מנהל מנחה או משתמש",
                        type: "error"
                    });
                }
            }
        };
        $scope.deleteUser=function(){
            var user = _.find($scope.allUsers, function (item) {
                return item.email === $scope.selectedUser;
            });
            if(user && validateUtils.validatePassword($scope.data.password)){
                swal({
                        title: "שים לב ",
                        text: "אתה עומד למחוק משפחה זו יחד עם כל הפרטים שלה במערכת, האם אתה בטוח?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "כן, מחק משפחה זו",
                        cancelButtonText: "לא, ביטול ",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            if(!user.isSuper){
                                user.isSuper=false;
                            }
                            adminService.deleteUser({isSuper:user.isSuper,adminId:currentUser,userId: user._id, adminPassword:$scope.data.password}).then(function(result){
                                if(result.success) {
                                    swal("המחיקה הצליחה!",
                                        "המשתמש הוסר מהמערכת בהצלחה!",
                                        "success");
                                    $state.go($state.current, {}, {reload: true});
                                }
                                else if(result.msg=='invalidPassword'){
                                    swal("אופס!",
                                        "בדוק שלא טעית בסיסמא!",
                                        "warning");
                                }
                                else if(result.msg=='finalSuper'){
                                    swal("אופס!",
                                        "אתה המנהל האחרון לא ניתן להסיר חשבון זה !",
                                        "warning");
                                }
                                else{
                                    swal("אופס!",
                                        "התרחשה שגיאה, אנא נסה שנית !",
                                        "error");
                                }
                            })

                        }
                        else {
                            swal("בוטל", "המתמש נשאר במערכת",
                                "success"
                            );
                        }
                    });
            }else{
                swal({
                    title: "שים לב",
                    text: "יש למלא את 2 השדות בצורה תקינה",
                    type: "warning"
                });
            }
        };
        $scope.assign = function () {
            var leader = _.find($scope.allLeaders, function (item) {
                return item.userName === $scope.selectedLeader;
            });
            var user = _.find($scope.allFamilies, function (item) {
                return item.userName === $scope.selectedFamily;
            });
            if (user && leader) {
                if (user.leader) {
                    swal({
                            title: "שים לב ",
                            text: "למשתמש זה יש כבר מנחה האם ברצונך להחליף עבורו מנחה ?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "בסדר, צוות בכל מקרה",
                            cancelButtonText: "ביטול ",
                            closeOnConfirm: false,
                            closeOnCancel: false
                        },
                        function (isConfirm) {
                            if (isConfirm) {
                                swal("הציוות הצליח!",
                                    "הציוות עודכן במערכת מהמערכת.",
                                    "success");
                                updateLeader(user._id, leader._id, leader.firstName + ' ' + leader.lastName);
                            }

                            else {
                                swal("שים לב", "הציוות בוטל",
                                    "warning"
                                );
                            }
                        });
                }
                else {
                    updateLeader(user._id, leader._id, leader.firstName + ' ' + leader.lastName);
                    swal("הציוות הצליח!",
                        "הציוות עודכן במערכת.",
                        "success");
                }
            }
            else {
                swal({
                    title: "שים לב",
                    text: "יש למלא את 2 השדות בצורה תקינה",
                    type: "warning"
                });
            }
        };
        function updateLeader(userId, leaderId, leaderName) {
            shoulderService.update(COLLECTIONS.USERS, {"_id": userId}, {
                $set: {
                    'leader': {
                        'leaderId': leaderId,
                        'leaderName': leaderName
                    }
                }
            }, {}).then(function (result) {
                swal({
                    title: "כל הכבוד !",
                    text: "הציוות בוצע בהצלחה",
                    type: "success"
                });
                $state.go($state.current, {}, {reload: true});
            });
        }


    });