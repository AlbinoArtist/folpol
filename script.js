var app = angular.module('folpol', ['ngRoute', 'ui.bootstrap']);
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/",
        {
            templateUrl: "views/view-home.html",
            controller: "navController"
        })
        .when("/resume",
        {
            templateUrl: "views/view-home.html",
            controller: "navController",

        })
        .when("/portfolio",
        {
            templateUrl: "views/view-home.html",
            controller: "navController"
        })
        .when("/contact",
        {
            templateUrl: "views/view-home.html",
            controller: "navController"
        })
        .otherwise(
        {
            redirectTo: "/"
        });

    $locationProvider.html5Mode(true);
});

app.controller("navController", ["$scope", "$location", "$http",
    function ($scope, $location, $http) {
        $http.get('http://data.riksdagen.se/personlista/?iid=&fnamn=&enamn=&f_ar=&kn=&parti=&valkrets=&rdlstatus=&org=&utformat=json&termlista=')
        .then(function(response){
            $scope.allData = response.data.personlista.person;
        });

        $scope.isActive = function (route) {
            return route === $location.path();
        };
        $scope.isNavCollapsed = true;

        $scope.closeNav = function () {
            if ($scope.isNavCollapsed == false) {
                $scope.isNavCollapsed = true;
            }
        };

    }]);
