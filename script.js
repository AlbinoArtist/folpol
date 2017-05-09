var app = angular.module('folpol', ['ngRoute', 'ui.bootstrap']);
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "views/view-home.html",
            controller: "navController"
        })
        .when("/resume", {
            templateUrl: "views/view-home.html",
            controller: "navController",

        })
        .when("/portfolio", {
            templateUrl: "views/view-home.html",
            controller: "navController"
        })
        .when("/contact", {
            templateUrl: "views/view-home.html",
            controller: "navController"
        })
        .otherwise({
            redirectTo: "/"
        });

    $locationProvider.html5Mode(true);
});

app.controller("navController", ["$scope", "$location", "$http",
    function ($scope, $location, $http) {
        var iid = '';
        var namn = '';
        var requestString = 'http://data.riksdagen.se/personlista/?iid=' + iid + '&fnamn=' + namn + '&enamn=&f_ar=&kn=&parti=&valkrets=&rdlstatus=&org=&utformat=json&termlista=';
        console.log("calling the first log");
        $http.get(requestString)
            .then(function (response) {
                $scope.allPoliticians = response.data.personlista.person;
            });


        $scope.fetchStats = function () {
            console.log("triggered")
            $http.get('http://data.riksdagen.se/voteringlista/?bet=&punkt=&valkrets=&rost=&iid=' + $scope.selectedPolitician.intressent_id + '&sz=5&utformat=json&gruppering=iid')
                .then(function (response) {
                     //Haft of the output is unusable since Riksdagen return json in with åäö characters. Needs a solid fix.
                    $scope.selectedPoliticianStats = response.data.voteringlista.votering;
                   
                    
                    
                });

        };
        $scope.fetchPolitician = function () {
            console.log("calling http with politicianid:" + $scope.selectedPolitician.intressent_id);
            var size = 10;
            $http.get(' http://data.riksdagen.se/voteringlista/?bet=&punkt=&valkrets=&rost=&iid=' + $scope.selectedPolitician.intressent_id + '&sz=' + size + '&utformat=json&gruppering=')
                .then(function (response) {
                    var tempdata = response.data.voteringlista.votering;
                    for (i = 0; i < size; i++) {
                        getDocument(tempdata[i]);
                    }
                    $scope.docData = tempdata;

                });

            var getDocument = function (documentId) {
                $http.get('http://data.riksdagen.se/dokumentlista/?sok=&doktyp=&rm=&from=&tom=&ts=&bet=' + documentId.beteckning + '&tempbet=&nr=&org=&iid=&webbtv=&talare=&exakt=&planering=&sort=rel&sortorder=desc&rapport=&utformat=json&a=s#soktraff')
                    .then(function (response) {
                        documentId.titel = response.data.dokumentlista.dokument[0].titel;
                    });
            }
            $scope.fetchStats();
             

        }
    }
]);