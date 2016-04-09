(function() {

    var app=angular.module('navigation', ['home','about','gallery','logIn']);

    app.directive('navBar', function() {
        return {
            restrict: 'E',
            templateUrl: "templates/nav-bar.html",
            controller: function () {
                    this.tab=1;
                this.isSet = function (checkTab) {
                    return this.tab === checkTab;
                };
                this.setTab = function (activeTab) {
                    this.tab = activeTab;
                };
            },
            controllerAs: "tab"

        };
    });

     })();
