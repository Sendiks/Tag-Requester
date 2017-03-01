var mainApp = angular.module('mainApp', ['ngFileUpload']);

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

mainApp.controller('MainCtrl', function ($rootScope, $scope, $http) {

    /* Members */
    /* This is anything that is not visible to the page, and is used for doing business logic / computation */

    /* Properties */
    /* This is anything that is visible to the page. Prefix is always $scope */

    $scope.departments = [];
    $scope.categories = [];
    $scope.uoms = [];
    $scope.items = [];
    $scope.file = null;

    $scope.selectedItem = null;
    $scope.user = $rootScope.user;

    $scope.filter = {name:''};

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

    function getCategories() {
        $http({
            url: "/api/category_with_depth",
            method: "GET"
        }).then(function (response) {
            $scope.categories = response.data['results'];
            $scope.categories = $scope.categories.map(function(x){
                x.id = parseInt(x.id);
                return x;
            });
        });
    }

    function getUOMs() {
        $http({
            url: "/api/unit_of_measure",
            method: "GET"
        }).then(function (response) {
            $scope.uoms = response.data['results'];
        });
    }

    function getItems() {
        $scope.items = [];
        $http({
            url: "/api/item",
            method: "GET",
            params: {
                department_id: $scope.filter.department_id,
                name: '%'+$scope.filter.name+'%'
            }
        }).then(function (response) {
            $scope.items = response.data['results'];
        });
    }

    window.onbeforeunload = function (e) {
        if($scope.selectedItem != null){
            //return "Are you sure you want to navigate away from this page";  
        }    
    };

    /* Commands */
    /* These are functions that can be tied to the page, such as on button clicks */

    $scope.toggleView = function(view) {
        $scope.views[view] = !$scope.views[view];
    };

    $scope.buildDashes = function(dashCount) {
        var d = '';
        for(i=0;i<dashCount;i++){
            d+='-';
        }
        return d;
    };

    $scope.searchItems = function() {
        getItems();
    };

    $scope.selectItem = function(item) {
        $scope.selectedItem = item;
    };

    $scope.createItem = function() {
        $scope.selectedItem = new Item();
    };

    $scope.cancel = function() {
        swal({
            title: 'Are you sure?',
            text: "Any changes you've made will be lost.",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2199e8',
            cancelButtonColor: '#da3116',
            confirmButtonText: 'Yes'
        }).then(function() {
            $scope.selectedItem = null;
            $scope.file = null;
            getItems();
            $scope.$apply();
        });
    };

    $scope.save = function() {

    };

    $scope.uploadImage = function() {

    };

    $scope.getDepartmentName = function(id) {
        if($scope.departments == null) { return '' ; }
        var d  =  $scope.departments.find((e)=>{return e.id == id;});

        if(d!=null){
            return d.name;      
        }

        return '';      
    };

    $scope.getCategoryName = function(id) {
        if($scope.categories == null) { return ''; }
        return $scope.categories.find((e)=>{return e.id == id;}).name;
    };

    /* Session */
    /* Code to make admin sessions work -- Must be duplicated */

    function init() {
        $scope.user = $rootScope.user;
    }
    var unbindHandler = $rootScope.$on('init', function () {
        init();
        unbindHandler();
    });


    /* Constructor */
    /* Runs when the page loads */

    getDepartments();
    getCategories();
    getUOMs();
    getItems();

});