var mainApp = angular.module('mainApp', []);

mainApp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

mainApp.controller('MainCtrl', function ($scope, $http) {

    /* Members */
    /* This is anything that is not visible to the page, and is used for doing business logic / computation */

    /* Properties */
    /* This is anything that is visible to the page. Prefix is always $scope */

    $scope.tags = [];
    $scope.manualTag = null;

    $scope.stores = ["Bayside", "Corners", "Elm Grove", "Franklin", "Germantown", "Grafton", "Greendale", "Greenfield", "Hales Corner",
    "Hartland", "Lilly Road", "Mequon", "New Berlin", "Wauwatosa", "West Bend", "West Milwaukee", "Whitefish Bay"];
    $scope.selectedStore = null;

    $scope.pageState = 0;
    $scope.requestType = null;

    /* Methods */
    /* These are functions that are not visible to the page. Used for doing things like loading data, etc */

    function getDepartments() {
        $http({
            url: "/api/department",
            method: "GET"
        }).then(function (response) {
            $scope.departments = response.data['results'];
        });
    }

    /* Commands */
    /* These are functions that can be tied to the page, such as on button clicks */

    $scope.addManualTag = function() {
        if($scope.tags.indexOf($scope.manualTag) == -1){
            $scope.tags.push($scope.manualTag);
        }
        $scope.manualTag = null;
    };

    $scope.scan = function(data) {
        if($scope.tags.indexOf(data) == -1){
            $scope.tags.push(data);
        }
    };

    $scope.remove = function(tag) {
        $scope.tags.splice($scope.tags.indexOf(tag), 1);
    };

    $scope.toStoreSelection = function() {
        if($scope.tags.length > 0){
            $scope.pageState = 1;
        }
    };

    $scope.submit = function() {
        console.log($scope.tags);
        console.log($scope.selectedStore);
        console.log($scope.requestType);
    };

    /* Constructor */
    /* Runs when the page loads */

});