/**
 * Created by oron sason on 19/03/2016.
 */
(function() {
    var app=angular.module('home',[]);
    app.directive('home', function(){
        return {
            restrict: 'E',
            templateUrl: "web%20data/home.html",
            controller: function () {
                this.hello = function () {
                    alert("hello")
                };
            },
            controllerAs: "homeC"
        }
    });
    var app1=angular.module('about',[]);
    app1.directive('about', function(){
        return {
            restrict: 'E',
            templateUrl: "web%20data/about.html"
        };
    });
    var app2=angular.module('action',[]);
    app2.directive('action', function(){
        return {
            restrict: 'E',
            templateUrl: "web%20data/action.html"
        };
    });
    var app3=angular.module('gallery',[]);
    app3.directive('gallery', function(){
        return {
            restrict: 'E',
            templateUrl: "web%20data/gallery.html"
        };
    });

    var app3=angular.module('logIn',[]);
    app3.directive('logIn', function(){
        return {
            restrict: 'E',
            templateUrl: "web%20data/log-in.html"
        };
    });
})();