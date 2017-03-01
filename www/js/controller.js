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
    $scope.shorts = ["bsd","crnrs", "elm", "frk", "gtn", "grf", "gdale", "grn", "hales", "hart", "lilly", "meq", "nbn", "tosa", "wbd", "wmke", "wfb"];
    $scope.selectedStore = null;

    $scope.pageState = 0;
    $scope.requestType = null;
    $scope.requestName = null;

    /* Methods */
    /* These are functions that are not visible to the page. Used for doing things like loading data, etc */

    /* Commands */
    /* These are functions that can be tied to the page, such as on button clicks */

    $scope.addManualTag = function() {
        if($scope.tags.indexOf($scope.manualTag) == -1 && $scope.manualTag != null){
            $scope.tags.push($scope.manualTag);
        }
        $scope.manualTag = null;
    };

    $scope.scan = function(data) {
        if($scope.tags.indexOf(data) == -1 && $scope.pageState == 0){
            $scope.tags.push(data);
            $scope.$digest();
        }
    };

    $scope.remove = function(tag) {
        $scope.tags.splice($scope.tags.indexOf(tag), 1);
    };

    $scope.toStoreSelection = function() {
        if($scope.tags.length > 0){
            $scope.pageState = 1;
            document.getElementById('requestName').value = '';
        }
    };

    $scope.submit = function() {

        $scope.pageState = 2;

        if($scope.selectedStore == null || $scope.requestType == null || $scope.requestName == null) {
            alert("Missing information: check name, store, and type and try again.");
            return;
        }

        $http({
            url: "http://dev.sendiks.co/ios/upload-tag.php",
            method: "POST",
            data: {
                "filename": $scope.requestName + "_" + $scope.shorts[$scope.stores.indexOf($scope.selectedStore)] + "_" + $scope.requestType,
                "tag-list": $scope.tags.join('\n')
            }
        }).then(function (response) {
            if(response.data == 0){
                alert("Tag request submitted!");
                location.reload();
            }else{
                $scope.pageState = 1;
                alert("An error occured. Make sure you have a network connection and try again");
            }
        });

    };

    /* Constructor */
    /* Runs when the page loads */

});