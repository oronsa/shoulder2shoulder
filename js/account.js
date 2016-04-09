/**
 * Created by oron sason on 19/03/2016.
 */
(function() {
    var app=angular.module('home',[]);
    app.directive('home', function(){
        return {
            restrict: 'E',
            templateUrl: "templates/home.html"
            }
    });
    var app1=angular.module('about',[]);
    app1.directive('about', function(){
        return {
            restrict: 'E',
            templateUrl: "templates/about.html"
        };
    });

    var app2=angular.module('gallery',[]);
    app2.directive('gallery', function(){
        return {
            restrict: 'E',
            templateUrl: "templates/gallery.html"
        };
    });

    var app3=angular.module('logIn',[]);
    app3.directive('logIn', function(){
        return {
            restrict: 'E',
            templateUrl: "templates/log-in.html"
        };
    });
})();
