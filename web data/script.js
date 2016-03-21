(function() {

    var app=angular.module('navigation', ['home','about','action','gallery','logIn']);

    app.directive('navBar', function() {
        return {
            restrict: 'E',
            templateUrl: "web%20data/nav-bar.html",
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
//<div class="carousel-inner" role="listbox">
//    <div class="item active">
//    <img src="web%20data/gallery/12107112_914924588555776_5709594198022937866_n.jpg" alt="1" width="460" height="345">
//    </div>
//
//    <div class="item">
//    <img src="web%20data/gallery/12644651_965319070182994_6414946692586162616_n.jpg" alt="2" width="460" height="345">
//    </div>
//
//    <div class="item">
//    <img src="web%20data/gallery/365232456.bmp" alt="3" width="460" height="345">
//    </div>
//    <div class="item">
//    <img src="web%20data/gallery/logo.png" alt="4" width="460" height="345">
//    </div>
//
//    <div class="item">
//    <img src="web%20data/gallery/hands.jpg" alt="5" width="460" height="345">
//    </div>
//    </div>