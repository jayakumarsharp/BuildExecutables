'use strict';
ReportApp.factory('StrategyService', ['$http','$window', function ($http,$window) {
    var StrategyServiceURI = BaseURL + 'Main/';
    var StrategyServiceFactory = {};

    var url;
    StrategyServiceFactory.GetStrategyApprovalByuser = function () {
        var result = $http.get(StrategyServiceURI + 'GetStrategyApprovalByuser');
        return result;
    }


    StrategyServiceFactory.GetDelegatedApprovalByuser = function () {
        var result = $http.get(StrategyServiceURI + 'GetDelegatedApprovalByuser');
        return result;
    }

    StrategyServiceFactory.GetAllCurrencyConversion = function () {
        var result = $http.get(StrategyServiceURI + 'GetData');
        return result;
    }
    StrategyServiceFactory.GetDatabyId = function (Strategyid) {
        var result = $http.get(StrategyServiceURI + 'GetDatabyId?Strategynumber=' + Strategyid);
        return result;
    }
    StrategyServiceFactory.GetStrategyDatabyStrategyId = function (Strategyid) {
        var result = $http.get(StrategyServiceURI + 'GetStrategyDatabyStrategyId?Strategynumber=' + Strategyid);
        return result;
    }
    StrategyServiceFactory.GetStrategyApprovalById = function (Strategyid, Version) {
        var result = $http.get(StrategyServiceURI + 'GetStrategyApprovalById?Strategynumber=' + Strategyid + '&Version=' + Version);
        return result;
    }

    StrategyServiceFactory.InsertStrategyApprover = function (currencysheet) {
        return $http.post(StrategyServiceURI + 'InsertStrategyApprover', currencysheet);
    }
    StrategyServiceFactory.InsertStrategy = function (currencysheet) {
        return $http.post(StrategyServiceURI + 'InsertStrategy', currencysheet);
    }

    StrategyServiceFactory.SaveNewversionStrategy = function (currencysheet) {
        return $http.post(StrategyServiceURI + 'SaveNewversionStrategy', currencysheet);
    }

    StrategyServiceFactory.UpdateStrategy = function (currencysheet) {
        return $http.post(StrategyServiceURI + 'UpdateStrategy', currencysheet);
    }

    StrategyServiceFactory.DeleteStrategyApprover = function (currencysheet) {
        return $http.post(StrategyServiceURI + 'DeleteStrategyApprover', currencysheet);
    }

    StrategyServiceFactory.UpdatecurrencyConversion = function (currencysheet) {
        return $http.post(StrategyServiceURI + 'currency/ModifyCurrencyConversion', currencysheet);
    }


    //TransferSettings

    StrategyServiceFactory.GetTransfersetting = function () {
        var result = $http.get(StrategyServiceURI + 'GetTransferSettingByuser');
        return result;
    }

    StrategyServiceFactory.InsertTransferSetting = function (currencysheet) {
        return $http.post(StrategyServiceURI + 'InsertTransferSetting', currencysheet);
    }
    StrategyServiceFactory.DeleteTransferSetting = function () {
        return $http.get(StrategyServiceURI + 'DeleteTransferSetting');
    }
    StrategyServiceFactory.Get_ApprovaltransferByuser = function () {
        return $http.get(StrategyServiceURI + 'Get_ApprovaltransferByuser');
    }
    StrategyServiceFactory.DownLoadFile = function (ReferenceCode, refnumber) {
        url = StrategyServiceURI + 'DownLoadFile?FileName=' + ReferenceCode + '&RefNumber=' + refnumber;
        //var s= $http.get(url);
        $window.open(url);
    }
    StrategyServiceFactory.DownLoadReportFile = function (file) {
        url = StrategyServiceURI + 'DownLoadReportFile?FileName=' + file ;
        $window.open(url);
    }
    
    StrategyServiceFactory.ShowLoader = function () {
        angular.element(document.querySelector('#loader')).removeClass('hide');
    };
    StrategyServiceFactory.HideLoader = function () {
        angular.element(document.querySelector('#loader')).addClass('hide');
    };
    return StrategyServiceFactory;
}]);



ReportApp.service('apiService', function ($http) {
    var URl = 'Main/';
    this.GetAllApplication =
         function () {
             var response = $http.get(URl + 'GetAllApplication?ApplicationId=');
             return response;
         };
    this.GetAllBusinessSector = function () {
        var response = $http.get(URl + 'GetAllBusinessSector?BusinessSectorId=');
        return response;
    };
    this.GetAllCountry = function () {
        var response = $http.get(URl + 'GetAllCountry?CountryId=');
        return response;
    };
    this.GetAllProductType = function () {
        var response = $http.get(URl + 'GetAllProductType?ProductTypeId=');
        return response;
    };
    this.GetAllLTAApplicationCode = function () {
        var response = $http.get(URl + 'GetAllLTAApplicationCode?LTAApplicationCodeId=');
        return response;
    };
    this.GetAllThirdPartyAppList = function () {
        var response = $http.get(URl + 'GetAllThirdPartyAppList?Id=');
        return response;
    };
    this.GetAllBusiness = function () {
        var response = $http.get(URl + 'GetAllBusiness?BusinessId=');
        return response;
    };
    this.GetAllLTAStrategyCode = function () {
        var response = $http.get(URl + 'GetAllLTAStrategyCode?LTAStrategyCodeId=');
        return response;
    };
    this.GetAllDiscretionaryCode = function () {
        var response = $http.get(URl + 'GetAllDiscretionaryCode?DiscretionaryCodeId=');
        return response;
    };
    this.GetAllBusinessSuffix = function () {
        var response = $http.get(URl + 'GetAllBusinessSuffix?BusinessSuffixId=');
        return response;
    };
    this.GetAllParentID = function () {
        var response = $http.get(URl + 'GetAllParentID?ParentIDId=');
        return response;
    };
    this.GetAllChildID = function () {
        var response = $http.get(URl + 'GetAllChildID?ChildIDId=');
        return response;
    };

    this.GetAllBusinessLine = function () {
        var response = $http.get(URl + 'GetAllBusinessLine?BusinessLineId=');
        return response;
    };
    this.GetAllApplicationCategory = function () {
        var response = $http.get(URl + 'GetAllApplicationCategory?ApplicationCategoryId=');
        return response;
    };
    this.GetAllLTAApplicationName = function () {
        var response = $http.get(URl + 'GetAllLTAApplicationName?LTAApplicationNameId=');
        return response;
    };
    this.GetAllLTAStrategyName = function () {
        var response = $http.get(URl + 'GetAllLTAStrategyName?LTAStrategyNameId=');
        return response;
    };
    this.GetAllVenuetype = function () {
        var response = $http.get(URl + 'GetAllVenuetype?VenuetypeId=');
        return response;
    };
    this.GetAllStrategytype = function () {
        var response = $http.get(URl + 'GetAllStrategytype?StrategytypeId=');
        return response;
    };
    this.GetAllCapacity = function () {
        var response = $http.get(URl + 'GetAllCapacity?CapacityId=');
        return response;
    };
    this.GetAllRegion = function () {
        var response = $http.get(URl + 'GetAllRegion?RegionId=');
        return response;
    };
});
