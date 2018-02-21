'use strict';
ReportApp.factory('CountryService', ['$http', function ($http) {
    var CountryServiceURI = BaseURL + 'Main/';
    var CountryServiceFactory = {};

    CountryServiceFactory.GetAllCountry = function () {
        var result = $http.get(CountryServiceURI + 'GetAllCountry');
        return result;
    }

    CountryServiceFactory.GetAllCountryById = function (CountryId) {
        var result = $http.get(CountryServiceURI + 'GetAllCountry?CountryId=' + CountryId);
        return result;
    }
    CountryServiceFactory.AddCountry = function (Country) {
        return $http.post(CountryServiceURI + 'AddCountry', Country);
    }

    CountryServiceFactory.ModifyCountry = function (Country) {
        return $http.post(CountryServiceURI + 'ModifyCountry', Country);
    }

    CountryServiceFactory.DeleteCountry = function (Country) {
        return $http.post(CountryServiceURI + 'DeleteCountry', Country);
    }

    return CountryServiceFactory;
}]);

