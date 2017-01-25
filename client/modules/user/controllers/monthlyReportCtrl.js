angular.module('accountingShoulder.user')
    
    .controller('monthlyReportCtrl', function($scope, $state, currentUser, shoulderService, COLLECTIONS, dateUtils) {

        $scope.submitData = function() {
            if($scope.data.date) {
                $scope.data.date = dateUtils.convertStringToDate($scope.data.date);
                shoulderService.query(COLLECTIONS.REPORTS, { $and: [{ 'date' : { $eq : $scope.data.date}},{ 'userId' : { $eq : currentUser }}]}).then(function(result){
                    if(result.collection.length) {
                        swal({   title: "שגיאה!",
                            text: "כבר הזנת נתונים עבור חודש זה,בחר חודש אחר או עבור לדף הצגת דוחות חודשיים על מנת למחוק אותו ולהזין דוח אחר במקומו ",
                            type: "warning"
                        });
                    }
                    else {
                        $scope.data.userId = currentUser;
                        resetEmptyFields();
                        shoulderService.insert(COLLECTIONS.REPORTS, $scope.data).then(function(result) {
                            if(result) {
                                swal({   title: "כל הכבוד!",
                                    text: "הדוח הוזן למערכת בהצלחה",
                                    type: "success"
                                });
                                initForm();
                            }
                        });
                    }
                });
            }
            else {
                swal({   title: "בבקשה ",
                    text: "עלייך לבחור חודש",
                    type: "warning"
                });
            }
            
        }

        function initForm() {
            $scope.months = dateUtils.generateDatesPickList(dateUtils.generateDatesRange(24));
            $scope.data = {};
        }

        initForm();

        function resetEmptyFields() {
            $scope.data.salary = $scope.data.salary || 0;
            $scope.data.alimony = $scope.data.alimony || 0;
            $scope.data.rent = $scope.data.rent || 0;
            $scope.data.childrenAllowances = $scope.data.childrenAllowances || 0;
            $scope.data.allowances = $scope.data.allowances || 0;
            $scope.data.other = $scope.data.other || 0;
        }
        
    });
