angular.module('accountingShoulder')

//
    .factory('drawingUtils', function() {


        function drawPie(scope) {

            var pieData = { 
                expenses: 0, 
                food: 0, 
                clothing: 0, 
                leisure: 0, 
                health: 0, 
                car: 0, 
                bills: 0, 
                school: 0, 
                other: 0 
            };

            if (scope.currentBills.length) {
                calculateExpenses(scope.currentBills, pieData);
                scope.viewDataPie = false;
                scope.labelsPie = ['אוכל', 'חשבונות', 'בריאות', 'לימודים', 'רכב', 'ביגוד', 'פנאי', 'אחר'];
                scope.dataChartPie = [ pieData.food, pieData.bills, pieData.health, pieData.school, pieData.car, pieData.clothing, pieData.leisure, pieData.other ];

                scope.optionsPie = {
                    legend: {
                        display: true,
                        labels: {
                            fontSize: 14
                        }
                    },
                    tooltips: {
                        enabled: true,
                        mode: 'single',
                        bodyFontSize: 20,
                        backgroundColor: 'red'
                    }
                };
            }
            else {
                scope.viewDataPie = true;
            }
        }
        
        function drawDoughnut(scope) {
            var chartData = {food: 0, clothing: 0, leisure: 0, health: 0, car: 0, bills: 0, school: 0, other: 0};
            var revenues = 0;
            if (scope.currentBills) {
                calculateExpenses(scope.currentBills, chartData);
            }
            if (scope.currentReport) {
                _.forEach(scope.currentReport, function(value) {
                    if(_.isNumber(value)) {
                        revenues += parseInt(value) || 0;
                    }
                });
            }
            if (scope.currentReport || expenses) {
                scope.viewDataDoughnut = false;
                scope.labelsDoughnut = ['הוצאות', 'הכנסות'];
                scope.dataChartDoughnut = [ expenses, revenues ];
                scope.optionsDoughnut = {
                    legend: {
                        display: true,
                        labels: {
                            fontSize: 14
                        }
                    },
                    tooltips: {
                        enabled: true,
                        mode: 'single',
                        bodyFontSize: 20
                    }
                }
            }
            else {
                scope.viewDataDoughnut = true;
            }
        }
        
        return {
            drawPie : drawPie,
            drawDoughnut : drawDoughnut
        };

        function calculateExpenses(items, data) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].category === 'ביגוד')
                    data.clothing += items[i].amount;
                if (items[i].category === 'פנאי')
                    data.leisure += items[i].amount;
                if (items[i].category === 'אוכל')
                    data.food += items[i].amount;
                if (items[i].category === 'חשבונות')
                    data.bills += items[i].amount;
                if (items[i].category === 'רכב')
                    data.car += items[i].amount;
                if (items[i].category === 'לימודים')
                    data.school += items[i].amount;
                if (items[i].category === 'בריאות')
                    data.health += items[i].amount;
                if (items[i].category === 'אחר')
                    data.other += items[i].amount;
            }
            this.expenses = data.food + data.clothing + data.leisure + data.bills + data.car + data.school + data.health + data.other;
        }
    });