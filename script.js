var app = angular.module('folpol', ['ngRoute', 'ui.bootstrap']);
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "views/view-home.html",
        })
        .otherwise({
            redirectTo: "/"
        });

    $locationProvider.html5Mode(true);
});

app.controller("navController", ["$scope", "$location", "$http", "PoliticianFactory",
    function ($scope, $location, $http, PoliticianFactory) {

        PoliticianFactory.getAllPoliticians().then(function (data) {
            $scope.allPoliticians = data;
        });

        $scope.updatePolitician = function (intressent_id) {
            PoliticianFactory.getPolitician(intressent_id, '5').then(function (data) {
                $scope.docData = data;
            });
            PoliticianFactory.fetchPoliticianStats(intressent_id).then(function (data) {
                console.log(intressent_id);
                $scope.selectedPoliticianStats = data;
            });

        };

    }
]);

app.factory("PoliticianFactory", function ($http, $q) {

    //Returns all active politicians and their roles.

    function getAllPoliticians() {
        var deferred = $q.defer();
        var iid = '';
        var namn = '';
        var requestString = 'http://data.riksdagen.se/personlista/?iid=' + iid + '&fnamn=' + namn + '&enamn=&f_ar=&kn=&parti=&valkrets=&rdlstatus=&org=&utformat=json&termlista=';
        $http.get(requestString)
            .then(function (response) {
                console.log("Reaches 2");
                deferred.resolve(response.data.personlista.person);
            });
        return deferred.promise;

    };

    //Returns all votes made by a specific politician.
    function getPolitician(intressent_id, size) {
        var deferred = $q.defer();
        $http.get(' http://data.riksdagen.se/voteringlista/?bet=&punkt=&valkrets=&rost=&iid=' + intressent_id + '&sz=' + size + '&utformat=json&gruppering=')
            .then(function (response) {
                var politician = response.data.voteringlista.votering;
                for (i = 0; i < size; i++) {
                    getDocument(politician[i]);
                }
                deferred.resolve(politician);
            });
        return deferred.promise;
    };

    //Helper function to get the proper names of bills that the politician voted for. Loops the votes for now as the data is not accessable in a better way.
    function getDocument(documentId) {
        $http.get('http://data.riksdagen.se/dokumentlista/?sok=&doktyp=&rm=&from=&tom=&ts=&bet=' + documentId.beteckning + '&tempbet=&nr=&org=&iid=&webbtv=&talare=&exakt=&planering=&sort=rel&sortorder=desc&rapport=&utformat=json&a=s#soktraff')
            .then(function (response) {
                documentId.titel = response.data.dokumentlista.dokument[0].titel;
            });
    };

    //Returns aggregated information about a specific politician.
    function fetchPoliticianStats(intressent_id) {
        var deferred = $q.defer();
        $http.get('http://data.riksdagen.se/voteringlista/?bet=&punkt=&valkrets=&rost=&iid=' + intressent_id + '&sz=5&utformat=json&gruppering=iid')
            .then(function (response) {
                //The fields  Frånvarande and Avstår is unusable since Riksdagen return json in with åäö characters. Needs a solid fix.
                deferred.resolve(response.data.voteringlista.votering);
            });
            return deferred.promise;

    };

    return {
        getAllPoliticians: getAllPoliticians,
        getPolitician: getPolitician,
        fetchPoliticianStats: fetchPoliticianStats
    };

});