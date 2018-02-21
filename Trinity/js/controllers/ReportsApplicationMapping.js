ReportApp.controller('ReportsApplicationMappingController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', 'StrategyService', 'apiService', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder, $q, StrategyService, apiService) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow).
    withOption('scrollX', true);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('FTAApplicationName').withTitle('FTA Application Name'),
        DTColumnBuilder.newColumn('FTAApplicationCode').withTitle('FT AApplication Code'),
        DTColumnBuilder.newColumn('ChildIdValue').withTitle('Child ID'),
        DTColumnBuilder.newColumn('ThirdPartyAppName').withTitle('ThirdParty'),
        DTColumnBuilder.newColumn('ParentID').withTitle('ParentID'),
        DTColumnBuilder.newColumn('ApplicationCategory').withTitle('Application Category'),
        DTColumnBuilder.newColumn('ApplicationOwnerId').withTitle('Application Owner'),
        DTColumnBuilder.newColumn('BusinessLine').withTitle('BusinessLine'),
        DTColumnBuilder.newColumn('RegionName').withTitle('Region'),
        DTColumnBuilder.newColumn('CountryName').withTitle('Country'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    function actionsHtml(data, type, full, meta) {
        return '<a  ng-click="delete(' + data + ')"><img src="images/delete.png"></a> ';
    }
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }
    $scope.GetAllFTAApplicationMaster = function () {
        ApiCall.MakeApiCall("GetAllReportApplicationMapping?Id=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data

        }).error(function (error) {
            $scope.Error = error;
        });
        let GetUsers = UserFactory.GetUser('NA');
        let GetAllFTAApplicationCode = apiService.GetAllFTAApplicationCode()
        let GetAllThirdPartyAppList = apiService.GetAllThirdPartyAppList()
        let GetAllFTAStrategyCode = apiService.GetAllFTAStrategyCode()
        let GetAllParentID = apiService.GetAllParentID()
        let GetAllChildID = apiService.GetAllChildID()
        let GetAllApplicationCategory = apiService.GetAllApplicationCategory()
        let GetAllFTAApplicationName = apiService.GetAllFTAApplicationName()
        let GetAllRegion = apiService.GetAllRegion()
        let GetAllCountry = apiService.GetAllCountry();
        let GetAllBusinessLine = apiService.GetAllBusinessLine();

        $q.all([
                GetAllFTAApplicationCode,
        GetAllThirdPartyAppList,
        GetAllParentID,
        GetAllChildID,
        GetAllApplicationCategory,
        GetAllFTAApplicationName,
        GetUsers,
        GetAllBusinessLine,
        GetAllCountry,
        GetAllRegion
        ]).then(function (resp) {
            $scope.FTAApplicationCodeList = resp[0].data;
            $scope.ThirdPartyList = resp[1].data;
            $scope.ParentIDList = resp[2].data;
            $scope.ChildIDList = resp[3].data;
            $scope.ApplicationCategoryList = resp[4].data;
            $scope.FTAApplicationNameList = resp[5].data;
            $scope.FTAApplicationOwnerList = resp[6].data;
            $scope.BusinessLineList = resp[7].data;
            $scope.CountryMasterList = resp[8].data;
            $scope.RegionMasterList = resp[9].data;
        });
        $timeout(function () {
            StrategyService.HideLoader();
        }, 1000)
    };

    $scope.add = function (FTAApplicationMaster) {
        if (FTAApplicationMaster != null) {
            if (FTAApplicationMaster.FTAApplicationName.FTAApplicationName && FTAApplicationMaster.FTAApplicationCode.FTAApplicationCode && FTAApplicationMaster.ChildID.ChildID && FTAApplicationMaster.ThirdPartyApp.Value && FTAApplicationMaster.BusinessLine && FTAApplicationMaster.Country && FTAApplicationMaster.Region) {
                var input = {
                    FTAApplicationNameId: FTAApplicationMaster.FTAApplicationName.Id, FTAApplicationCodeId: FTAApplicationMaster.FTAApplicationCode.Id, ChildID: FTAApplicationMaster.ChildID.Id, ThirdPartyAppId: FTAApplicationMaster.ThirdPartyApp.Id,
                    ParentID: FTAApplicationMaster.ParentID.Id, ApplicationOwnerId: FTAApplicationMaster.FTAApplicationOwner.userId, ApplicationCategoryId: FTAApplicationMaster.ApplicationCategory.Id,
                    BusinessLineId: FTAApplicationMaster.BusinessLine.Id,
                    Country: FTAApplicationMaster.Country.Id,
                    Region: FTAApplicationMaster.Region.Id
                };

                ApiCall.MakeApiCall("AddReportMapping", 'POST', input).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        if (data == "success") {
                            $scope.FTAApplicationMaster = null;
                            $scope.GetAllFTAApplicationMaster();
                            $scope.editMode = false;

                            $scope.showAddwindow = false;
                            toaster.pop('success', "Success", 'Report Application Mapping added successfully', null);
                        }
                        else
                            toaster.pop('warning', "Warning", data, null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding FTAApplication ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter FTAApplication', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter FTAApplication', null);
        }
    };



    $scope.GetFTAApplicationMasterById = function (FTAApplicationMasterId) {
        ApiCall.MakeApiCall("GetAllFTAApplication?FTAApplicationId=" + FTAApplicationMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.FTAApplicationMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding FTAApplication! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function (id) {
        ApiCall.MakeApiCall("DeleteReportApplicationMapping?Id=" + id, 'GET', '').success(function (data) {
            if (data == "success") {
                $scope.FTAApplicationMaster = null;
                $scope.editMode = false;
                $scope.GetAllFTAApplicationMaster();
                $('#confirmModal').modal('hide');
                $scope.showAddwindow = false;
                toaster.pop('success', "Success", 'Report Application Mapping deleted successfully', null);
            }
            else
                toaster.pop('warning', "Warning", data, null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.showconfirm = function (data) {
        $scope.FTAApplicationMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.FTAApplicationMaster = null;
        $scope.editMode = false;
        $scope.showAddwindow = false;
        $('#confirmModal').modal('hide');
    };

    $scope.GetRightsList = function () {
        UserFactory.getloggedusername().success(function (data) {
            var userId = data;
            if (data != '') {
                reportFactory.GetRightsList(userId).success(function (data) {
                    var isRead = true;
                    $scope.IsReadOnly = true;
                    angular.forEach(data, function (value, key) {
                        if (value.RightName == 'FTAApplication Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllFTAApplicationMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);