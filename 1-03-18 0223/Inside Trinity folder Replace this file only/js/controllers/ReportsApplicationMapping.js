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
        DTColumnBuilder.newColumn('LTAApplicationName').withTitle('LTA Application Name'),
        DTColumnBuilder.newColumn('LTAApplicationCode').withTitle('LTA AApplication Code'),
        DTColumnBuilder.newColumn('ChildIdValue').withTitle('Child ID'),
        DTColumnBuilder.newColumn('ThirdPartyAppName').withTitle('Third Party Application'),
        DTColumnBuilder.newColumn('ParentID').withTitle('Parent ID'),
        DTColumnBuilder.newColumn('ApplicationCategory').withTitle('Application Category'),
        DTColumnBuilder.newColumn('ApplicationOwnerId').withTitle('Application Owner'),
        DTColumnBuilder.newColumn('BusinessLine').withTitle('Business Line'),
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
    $scope.GetAllLTAApplicationMaster = function () {
        ApiCall.MakeApiCall("GetAllReportApplicationMapping?Id=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data

        }).error(function (error) {
            $scope.Error = error;
        });
        let GetUsers = UserFactory.GetUser('NA');
        let GetAllLTAApplicationCode = apiService.GetAllLTAApplicationCode()
        let GetAllThirdPartyAppList = apiService.GetAllThirdPartyAppList()
        let GetAllLTAStrategyCode = apiService.GetAllLTAStrategyCode()
        let GetAllParentID = apiService.GetAllParentID()
        let GetAllChildID = apiService.GetAllChildID()
        let GetAllApplicationCategory = apiService.GetAllApplicationCategory()
        let GetAllLTAApplicationName = apiService.GetAllLTAApplicationName()
        let GetAllRegion = apiService.GetAllRegion()
        let GetAllCountry = apiService.GetAllCountry();
        let GetAllBusinessLine = apiService.GetAllBusinessLine();

        $q.all([
                GetAllLTAApplicationCode,
        GetAllThirdPartyAppList,
        GetAllParentID,
        GetAllChildID,
        GetAllApplicationCategory,
        GetAllLTAApplicationName,
        GetUsers,
        GetAllBusinessLine,
        GetAllCountry,
        GetAllRegion
        ]).then(function (resp) {
            $scope.LTAApplicationCodeList = resp[0].data;
            $scope.ThirdPartyList = resp[1].data;
            $scope.ParentIDList = resp[2].data;
            $scope.ChildIDList = resp[3].data;
            $scope.ApplicationCategoryList = resp[4].data;
            $scope.LTAApplicationNameList = resp[5].data;
            $scope.LTAApplicationOwnerList = resp[6].data;
            $scope.BusinessLineList = resp[7].data;
            $scope.CountryMasterList = resp[8].data;
            $scope.RegionMasterList = resp[9].data;
        });
        $timeout(function () {
            StrategyService.HideLoader();
        }, 1000)
    };

    $scope.Export = function () {
        var currency = { Country: '', Region: '', LTAApplicationCode: '', LTAStrategyCode: '', BusinessLine: '', LTAStrategyOwner: '', ApplicationCategory: '', Venuetype: '' };
        //if ($scope.selectModel) {
        //    StrategyService.ShowLoader();
        //    if ($scope.selectModel.Country)
        //        currency.Country = $scope.selectModel.Country.Id
        //    if ($scope.selectModel.Region)
        //        currency.Region = $scope.selectModel.Region.Id;
        //    if ($scope.selectModel.LTAApplicationCode)
        //        currency.LTAApplicationCode = $scope.selectModel.LTAApplicationCode.Id;
        //    if ($scope.selectModel.LTAStrategyCode)
        //        currency.LTAStrategyCode = $scope.selectModel.LTAStrategyCode.Id;
        //    if ($scope.selectModel.BusinessLine)
        //        currency.BusinessLine = $scope.selectModel.BusinessLine.Id;
        //    if ($scope.selectModel.LTAStrategyOwner)
        //        currency.LTAStrategyOwner = $scope.selectModel.LTAStrategyOwner.userId;
        //    if ($scope.selectModel.ApplicationCategory)
        //        currency.ApplicationCategory = $scope.selectModel.ApplicationCategory.Id;
        //    if ($scope.selectModel.Venuetype)
        //        currency.VenuetypeId = $scope.selectModel.Venuetype.Id;
        //    if ($scope.selectModel.LTAApplicationName)
        //        currency.LTAApplicationNameId = $scope.selectModel.LTAApplicationName.Id;
        //    if ($scope.selectModel.ChildID)
        //        currency.ChildID = $scope.selectModel.ChildID.Id;
        //    if ($scope.selectModel.ParentID)
        //        currency.ParentID = $scope.selectModel.ParentID.Id;


        ApiCall.MakeApiCall("ExportReportFilter", 'POST', currency).success(function (data) {
            if (data.Error != undefined) {
                toaster.pop('error', "Error", data.Error, null);
            } else {
                if (data != 'No Records') {
                    var url = BaseURL + 'Main/DownLoadReportFile?FileName=' + data + '&Page=Mapping';
                    $scope.downloadurl = url;
                    setTimeout(function () {
                        $('#downloadpdf')[0].click();
                    }, 1000);
                    //StrategyService.DownLoadReportFile(data);
                }
                else {
                    toaster.pop('warning', "Warning", "No records available.", null);
                }
                //$scope.dtOptions.data = $scope.data;
                StrategyService.HideLoader();
            }
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding Capacity ! " + data.ExceptionMessage;
        });
        //}
        //else
        //    toaster.pop('warning', "Warning", 'Please apply report filter condition', null);
    };

    $scope.add = function (LTAApplicationMaster) {
        if (LTAApplicationMaster != null) {
            if (LTAApplicationMaster.LTAApplicationName.LTAApplicationName && LTAApplicationMaster.LTAApplicationCode.LTAApplicationCode && LTAApplicationMaster.ChildID.ChildID && LTAApplicationMaster.ThirdPartyApp.Value && LTAApplicationMaster.BusinessLine && LTAApplicationMaster.Country && LTAApplicationMaster.Region) {
                var input = {
                    LTAApplicationNameId: LTAApplicationMaster.LTAApplicationName.Id, LTAApplicationCodeId: LTAApplicationMaster.LTAApplicationCode.Id, ChildID: LTAApplicationMaster.ChildID.Id, ThirdPartyAppId: LTAApplicationMaster.ThirdPartyApp.Id,
                    ParentID: LTAApplicationMaster.ParentID.Id, ApplicationOwnerId: LTAApplicationMaster.LTAApplicationOwner.userId, ApplicationCategoryId: LTAApplicationMaster.ApplicationCategory.Id,
                    BusinessLineId: LTAApplicationMaster.BusinessLine.Id,
                    Country: LTAApplicationMaster.Country.Id,
                    Region: LTAApplicationMaster.Region.Id
                };

                ApiCall.MakeApiCall("AddReportMapping", 'POST', input).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        if (data == "success") {
                            $scope.LTAApplicationMaster = null;
                            $scope.GetAllLTAApplicationMaster();
                            $scope.editMode = false;

                            $scope.showAddwindow = false;
                            toaster.pop('success', "Success", 'Report Application Mapping added successfully', null);
                        }
                        else
                            toaster.pop('warning', "Warning", data, null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding LTAApplication ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter LTAApplication', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter LTAApplication', null);
        }
    };



    $scope.GetLTAApplicationMasterById = function (LTAApplicationMasterId) {
        ApiCall.MakeApiCall("GetAllLTAApplication?LTAApplicationId=" + LTAApplicationMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.LTAApplicationMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding LTAApplication! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function (id) {
        ApiCall.MakeApiCall("DeleteReportApplicationMapping?Id=" + id, 'GET', '').success(function (data) {
            if (data == "success") {
                $scope.LTAApplicationMaster = null;
                $scope.editMode = false;
                $scope.GetAllLTAApplicationMaster();
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
        $scope.LTAApplicationMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.LTAApplicationMaster = null;
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
                        if (value.RightName == 'LTAApplication Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllLTAApplicationMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);