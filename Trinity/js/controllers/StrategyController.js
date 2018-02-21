ReportApp.controller('StrategyController', ['$scope', '$rootScope', 'StrategyService', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', 'apiService', 'Upload', '$sce', '_', function ($scope, $rootScope, StrategyService, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder, $q, apiService, Upload, $sce, _) {
    $scope.data = [];
    $scope.IsModelAlgopage = true;
    $scope.errorinfo = '';
    $scope.Strategydata = [];
    $scope.editMode = false;
    $scope.showaction = false;
    $scope.IsReadOnly = true;
    $scope.currency = {};
    $scope.ApprovalCheck = { ShowSignOff: false, IsApprove: false };
    $scope.Permissions = { isWrite: false, isRead: false };
    $scope.selectModel = {
        Country: {}, Region: {}, FTAApplicationCode: {}, BusinessSuffix: {}, ChildID: {}, FTAStrategyName: {}, Strategytype: {}, GOLiveDate: '', FTAStrategyCode: {}, FTAShortCode: {}, BusinessLine: {}, FTAApplicationName: {}, FTAStrategyOwner: {}, ApplicationCategory: {}, Venuetype: {}, DecomissionedDate: {}, DiscretionaryCode: {}, ParentID: {}, FTAApplicationOwner: {}, PriorityScore: '', Priority: '', Capacity: {},
    };
    $scope.pageList = [{ Page: true, IsValid: false }, { Page: false, IsValid: false }, { Page: false, IsValid: false }];
    $scope.dtOptions = DTOptionsBuilder.fromSource()
    .withPaginationType('full_numbers').withOption('createdRow', createdRow)
    .withOption('rowCallback', rowCallback).withOption('scrollX', true);

    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID'),
        DTColumnBuilder.newColumn('FTAShortCode').withTitle('FTA Short Code'),
        DTColumnBuilder.newColumn('BusinessLine').withTitle('Business Line'),
        DTColumnBuilder.newColumn('FTAApplicationName').withTitle('FTA Application Name'),
        DTColumnBuilder.newColumn('FTAStrategyCode').withTitle('FTA Strategy Name'),
        DTColumnBuilder.newColumn('RegionName').withTitle('Region'),
        DTColumnBuilder.newColumn('FTAApplicationOwner').withTitle('FTA Owner'),
        //DTColumnBuilder.newColumn('StrategyStatus').withTitle('Strategy Status'),
        DTColumnBuilder.newColumn('ApplicationCategory').withTitle('Category'),
        DTColumnBuilder.newColumn('Priority').withTitle('Priority'),
        //DTColumnBuilder.newColumn('ParentID').withTitle('Parent CSI ID'),
         DTColumnBuilder.newColumn('SignOff').withTitle('SignOff').renderWith(actionsStatus),
            DTColumnBuilder.newColumn('DecomissionedDate').withTitle('Status').renderWith(activeStatus),

        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];

    function actionsStatus(data, type, full, meta) {
        if (data == "True")
            return '<a  class="dta-act">SignOff</a>';
        else {
            return '<a  class="test2 dta-act-not">Pending</a>';
        }
    }

    function activeStatus(data, type, full, meta) {
        var GOLiveDate = moment(full.GOLiveDate, 'MM/DD/YYYY');
        if (full.DecomissionedDate)
            var DecomissionedDate = moment(full.DecomissionedDate, 'MM/DD/YYYY');
        else
            var DecomissionedDate = full.DecomissionedDate;
        var currentdate = moment();
        if (DecomissionedDate != '') {
            if ((currentdate >= GOLiveDate && currentdate <= DecomissionedDate) || (currentdate >= DecomissionedDate && currentdate <= GOLiveDate)) // false
                return '<a  class="dta-act">Active</a>';
            else if (GOLiveDate >= currentdate)//&& DecomissionedDate <= currentdate)
                return '<a  class="dta-sign">PipeLine</a>';
            else if (DecomissionedDate < currentdate)
                return '<a  class="dta-act-not">InActive</a>';
        }
        else {
            if (GOLiveDate < currentdate)
                return '<a  class="dta-act-not">InActive</a>';
            else if (GOLiveDate > currentdate)
                return '<a  class="dta-sign">PipeLine</a>';
            else
                return '<a  class="dta-act-not">InActive</a>';
        }
    }
    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }


    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }

    function actionsHtml(data, type, full, meta) {
        if ($scope.Permissions.IsWrite || $scope.ApprovalCheck.IsApprove)
            return '<a class="test"><img src="images/edit.png"></a> &nbsp;<a class="test1"><img style="width:24px;height:24px;" src="images/eyeicon.png"></a>';
        else
            return '<a  class="test1"><img style="width:24px;height:24px;" src="images/eyeicon.png"></a>';
    }

    function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        $('.test', nRow).unbind('click');
        $('.test', nRow).bind('click', function () {
            $scope.$apply(function () {
                $scope.GetCurrencyConversionForId(aData.Id, aData.Version, aData.RefNumber, true);
            });
        });
        $('.test1', nRow).unbind('click');
        $('.test1', nRow).bind('click', function () {
            $scope.$apply(function () {
                $scope.GetChangeLog(aData.RefNumber, aData.Version);
            });
        });
        $('.test2', nRow).unbind('click');
        $('.test2', nRow).bind('click', function () {
            $scope.$apply(function () {
                $scope.GetCurrencyConversionForId(aData.Id, aData.Version, aData.RefNumber, false);
            });
        });

        return nRow;
    }

    $scope.activateTab = function (tabid) {
        for (var i = 0; i < $scope.pageList.length; i++) {
            $scope.pageList[i].Page = false;
        }
        $scope.pageList[tabid].Page = true;
        $scope.pageList[tabid].IsValid = true;
    }

    function getallgriddata() {
        StrategyService.GetAllCurrencyConversion().success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data;
        });
    }

    $scope.getallalgodata = function () {
        StrategyService.ShowLoader();
        getallgriddata();
        var URl = 'Main/';
        let GetAllCountry = apiService.GetAllCountry();
        let GetAllFTAApplicationCode = apiService.GetAllFTAApplicationCode()
        let GetAllThirdPartyAppList = apiService.GetAllThirdPartyAppList()
        let GetAllBusiness = apiService.GetAllBusiness()
        let GetAllFTAStrategyCode = apiService.GetAllFTAStrategyCode()
        let GetAllDiscretionaryCode = apiService.GetAllDiscretionaryCode()
        let GetAllBusinessSuffix = apiService.GetAllBusinessSuffix()
        let GetAllParentID = apiService.GetAllParentID()
        let GetAllChildID = apiService.GetAllChildID()
        let GetAllBusinessLine = apiService.GetAllBusinessLine()
        let GetAllApplicationCategory = apiService.GetAllApplicationCategory()
        let GetAllFTAApplicationName = apiService.GetAllFTAApplicationName()
        let GetAllFTAStrategyName = apiService.GetAllFTAStrategyName()
        let GetAllVenuetype = apiService.GetAllVenuetype()
        let GetAllStrategytype = apiService.GetAllStrategytype()
        let GetAllCapacity = apiService.GetAllCapacity()
        let GetAllRegion = apiService.GetAllRegion()
        let GetUsers = UserFactory.GetUser('NA');
        $q.all([
        GetAllCountry,
        GetAllFTAApplicationCode,
        GetAllThirdPartyAppList,
        GetAllBusiness,
        GetAllFTAStrategyCode,
        GetAllDiscretionaryCode,
        GetAllBusinessSuffix,
        GetAllParentID,
        GetAllChildID,
        GetAllBusinessLine,
        GetAllApplicationCategory,
        GetAllFTAApplicationName,
        GetAllFTAStrategyName,
         GetAllVenuetype,
        GetAllStrategytype,
        GetAllCapacity,
        GetAllRegion, GetUsers
        ]).then(function (resp) {
            $scope.CountryMasterList = resp[0].data;
            $scope.FTAApplicationCodeList = resp[1].data;
            $scope.ThirdPartyList = resp[2].data;
            $scope.BusinessList = resp[3].data;
            $scope.FTAStrategyCodeList = resp[4].data;
            $scope.DiscretionaryCodeList = resp[5].data;
            $scope.BusinessSuffixList = resp[6].data;
            $scope.ParentIDList = resp[7].data;
            $scope.ChildIDList = resp[8].data;
            $scope.BusinessLineList = resp[9].data;
            $scope.ApplicationCategoryList = resp[10].data;
            $scope.FTAApplicationNameList = resp[11].data;
            $scope.FTAStrategyNameList = resp[12].data;
            $scope.VenuetypeList = resp[13].data;
            $scope.StrategytypeList = resp[14].data;
            $scope.CapacityList = resp[15].data;
            $scope.RegionMasterList = resp[16].data;
            $scope.FTAApplicationOwnerList = resp[17].data;
            binddata($scope.CountryMasterList);
        });
        $timeout(function () {
            StrategyService.HideLoader();
        }, 1000)
    };

    $scope.showadd = function () {
        StrategyService.ShowLoader();
        $scope.showaction = true;
        $timeout(function () {
            $scope.errorinfo = '';
            $scope.StrategyActive = false;
            $scope.IsSignOff = false;
        }, 100);
        $scope.editMode = false;
        $scope.ApprovalCheck.ShowSignOff = false;
        $scope.selectModel = { Application: "", Country: "", ProductType: "", BusinessSector: "", Region: "" };
        $scope.activateTab(0);
        $('#currencyModel').modal('show');
        $timeout(function () {
            StrategyService.HideLoader();
        }, 500)
    };

    $scope.InsertStrategy = function () {
        console.log($scope.selectModel);
        StrategyService.ShowLoader();
        var idlist = '';
        var CountryNames = '';
        for (var i = 0; i < $scope.multiselect.selected.length; i++) {
            idlist += $scope.multiselect.selected[i].id + ',';
            CountryNames += $scope.multiselect.selected[i].name + ',';
        }
        var currency = {
            CountryId: idlist,
            CountryNameList: CountryNames,
            Country: JSON.stringify($scope.multiselect.selected),
            Region: $scope.selectModel.Region.Id
        , FTAApplicationCodeId: $scope.selectModel.FTAApplicationCode.Id, BusinessSuffixId: $scope.selectModel.BusinessSuffix.Id
        , ChildID: $scope.selectModel.ChildID.Id, FTAStrategyNameId: $scope.selectModel.FTAStrategyName.Id
        , StrategytypeId: $scope.selectModel.Strategytype.Id, GOLiveDate: $scope.selectModel.GOLiveDate
        , FTAStrategyCodeId: $scope.selectModel.FTAStrategyCode.Id, FTAShortCode: $scope.selectModel.FTAShortCode
        , BusinessLineId: $scope.selectModel.BusinessLine.Id, FTAApplicationNameId: $scope.selectModel.FTAApplicationName.Id
        , FTAStrategyOwnerId: $scope.selectModel.FTAStrategyOwner.userId, ApplicationCategoryId: $scope.selectModel.ApplicationCategory.Id, VenuetypeId: $scope.selectModel.Venuetype.Id
        , DecomissionedDate: $scope.selectModel.DecomissionedDate, DiscretionaryCodeId: $scope.selectModel.DiscretionaryCode.Id
        , ParentID: $scope.selectModel.ParentID.Id, FTAApplicationOwnerId: $scope.selectModel.FTAApplicationOwner.userId
        , PriorityScore: $scope.selectModel.PriorityScore
        , Priority: $scope.selectModel.Priority
        , CapacityId: $scope.selectModel.Capacity.Id
        , BusinessId: $scope.selectModel.Business.Id
        , ThirdPartyAppId: $scope.selectModel.ThirdPartyApp.Id
        , FTAApplicationMappingId: $scope.selectModel.FTAApplicationMappingId
        , FTAStrategyMappingId: $scope.selectModel.FTAStrategyMappingId
        , BusinessMappingId: $scope.selectModel.BusinessMappingId
        , Description: $scope.selectModel.Description
        , SignOff: $scope.selectModel.SignOff
        };
        if (currency != null) {
            if ($scope.selectModel.Systemflowfile) {
                currency.Systemflowfile = $scope.selectModel.Systemflowfile[0].name;
                currency.Systemflowfilelist = $scope.selectModel.Systemflowfile;
            }
            if ($scope.selectModel.Decommissionedfile) {
                currency.Decommissionedfile = $scope.selectModel.Decommissionedfile[0].name;
                currency.Decommissionedfilelist = $scope.selectModel.Decommissionedfile;
            }
            Upload.upload({
                url: 'Main/InsertStrategy',
                data: currency
            }).then(function (data) {
                StrategyService.HideLoader();
                if (data.data == 'success') {
                    toaster.pop('success', "Success", "Model/Algo added successfully", null);
                    $scope.showaction = false;
                }
                else
                    toaster.pop('warning', "Warning", data.data, null);
                getallgriddata();
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                $window.alert('Error status: ' + resp.status);
            }, function (evt) {
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.name);
                $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        }
    };

    $scope.Availableusers = [];
    $scope.setsignoff = function () {
        if ($scope.selectModel.SignOff == 'True')
            $scope.selectModel.SignOff = 'False'
        else
            $scope.selectModel.SignOff = 'True'
    }

    $scope.GetCurrencyConversionForId = function (id, Version, RefNumber, actiontype) {
        $scope.showaction = true;
        $scope.editMode = true;
        $scope.ApprovalCheck.ShowSignOff = false;
        StrategyService.ShowLoader();
        binddata($scope.CountryMasterList);
        StrategyService.GetDatabyId(id).success(function (data) {
            $scope.selectModel = data[0];
            $scope.selectModel.GOLiveDate = $scope.selectModel.GOLiveDate;
            $scope.selectModel.DecomissionedDate = $scope.selectModel.DecomissionedDate;
            //$scope.selectModel.GOLiveDate = moment($scope.selectModel.GOLiveDate.split(' ')[0], 'DD/MM/YYYY').format('MM/DD/YYYY');
            //$scope.selectModel.DecomissionedDate = moment($scope.selectModel.DecomissionedDate.split(' ')[0], 'DD/MM/YYYY').format('MM/DD/YYYY');
            $scope.Prevvalue = angular.copy($scope.selectModel)
            $scope.multiselect.selected = JSON.parse($scope.selectModel.Country);
            //$scope.selectModel.Country = getdynamicobject($scope.selectModel.Country, "CountryMasterList")
            $scope.selectModel.Region = getdynamicobject($scope.selectModel.Region, "RegionMasterList")
            $scope.selectModel.FTAApplicationCode = getdynamicobject($scope.selectModel.FTAApplicationCodeId, "FTAApplicationCodeList")
            $scope.selectModel.FTAStrategyCode = getdynamicobject($scope.selectModel.FTAStrategyCodeId, "FTAStrategyCodeList")
            $scope.selectModel.DiscretionaryCode = getdynamicobject($scope.selectModel.DiscretionaryCodeId, "DiscretionaryCodeList")
            $scope.selectModel.ParentID = getdynamicobject($scope.selectModel.ParentID, "ParentIDList")
            $scope.selectModel.BusinessSuffix = getdynamicobject($scope.selectModel.BusinessSuffixId, "BusinessSuffixList");
            $scope.selectModel.BusinessLine = getdynamicobject($scope.selectModel.BusinessLineId, "BusinessLineList");
            $scope.selectModel.FTAApplicationName = getdynamicobject($scope.selectModel.FTAApplicationNameId, "FTAApplicationNameList")
            $scope.selectModel.FTAStrategyName = getdynamicobject($scope.selectModel.FTAStrategyNameId, "FTAStrategyNameList")
            $scope.selectModel.ApplicationCategory = getdynamicobject($scope.selectModel.ApplicationCategoryId, "ApplicationCategoryList")
            $scope.selectModel.Strategytype = getdynamicobject($scope.selectModel.StrategytypeId, "StrategytypeList")
            $scope.selectModel.Venuetype = getdynamicobject($scope.selectModel.VenueTypeId, "VenuetypeList")
            $scope.selectModel.Capacity = getdynamicobject($scope.selectModel.CapacityId, "CapacityList")
            $scope.selectModel.ChildID = getdynamicobject($scope.selectModel.ChildID, "ChildIDList");
            $scope.selectModel.ThirdPartyApp = getdynamicobject($scope.selectModel.ThirdPartyAppId, "ThirdPartyList");
            $scope.selectModel.Business = getdynamicobject($scope.selectModel.BusinessId, "BusinessList");
            $scope.selectModel.Description = $scope.selectModel.Description;
            $scope.selectModel.FTAApplicationOwner = getdynamicobjectuserfilter($scope.selectModel.FTAApplicationOwner, "FTAApplicationOwnerList");
            $scope.userfilter(true);
            $scope.activateTab(0);
            for (var i = 0; i < $scope.pageList.length; i++) {
                $scope.pageList[i].IsValid = true;
            }
            //assignUsers();
            binddata($scope.CountryMasterList);
            if (actiontype) {
                $scope.showaction = true;
                $scope.AllowSignOff = false;
            }
            else {
                $scope.showaction = false;
                $scope.AllowSignOff = true;
                if ($scope.ApprovalCheck.IsApprove || $scope.userId.toLowerCase() == $scope.selectModel.FTAStrategyOwnerId.toLowerCase()) {
                    $('#confirm').modal('show');
                }
            }
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding user! " + data.ExceptionMessage;
        });

        StrategyService.GetStrategyApprovalById(RefNumber, Version).success(function (data) {
            $scope.UploadedSList = [];
            $scope.UploadedDList = [];
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].Status == "S")
                        $scope.UploadedSList.push(data[i]);
                    else
                        $scope.UploadedDList.push(data[i]);
                }
            }
        });

        $timeout(function () {
            StrategyService.HideLoader();
        }, 500)
    };

    $scope.openpopup = function (type) {
        $('#viewFiles').modal('show');
    }

    var getdynamicobject = function (userId, type) {
        for (var i = 0; i < $scope[type].length; i++) {
            if ($scope[type][i].Id == userId) {
                return $scope[type][i];
            }
        }
    };
    var getdynamicobjectuserfilter = function (userId, type) {
        for (var i = 0; i < $scope[type].length; i++) {
            if ($scope[type][i].userId == userId) {
                return $scope[type][i];
            }
        }
    };

    $scope.GetChangeLog = function (id, Version) {
        $scope.ViewData = [];
        $scope.ViewListdata = false;
        $('#viewApprovals').modal('show');
        ApiCall.MakeApiCall("GetStrategyVersionLog?Id=" + id, 'GET', '').success(function (data) {
            $scope.Listdata = data;
            $scope.ViewListdata = true;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.DownlaodFile = function (id, ref) {
        StrategyService.DownLoadFile(id, ref).success(function (data) { });
    }

    $scope.UpdateStrategy = function (model) {
        StrategyService.ShowLoader();
        var idlist = '';
        var CountryNames = '';
        for (var i = 0; i < $scope.multiselect.selected.length; i++) {
            idlist += $scope.multiselect.selected[i].id + ',';
            CountryNames += $scope.multiselect.selected[i].name + ',';
        }
        var model = {
            Page: "S",
            CountryId: idlist,
            CountryNameList: CountryNames,
            Country: JSON.stringify($scope.multiselect.selected),
            Region: $scope.selectModel.Region.Id, FTAApplicationCodeId: $scope.selectModel.FTAApplicationCode.Id,
            FTAApplicationCode: $scope.selectModel.FTAApplicationCode.FTAApplicationCode, BusinessSuffixId: $scope.selectModel.BusinessSuffix.Id,
            BusinessSuffix: $scope.selectModel.BusinessSuffix.BusinessSuffix, ChildID: $scope.selectModel.ChildID.Id,
            ChildIDValue: $scope.selectModel.ChildID.ChildID, FTAStrategyNameId: $scope.selectModel.FTAStrategyName.Id,
            FTAStrategyName: $scope.selectModel.FTAStrategyName.FTAStrategyName, StrategytypeId: $scope.selectModel.Strategytype.Id,
            Strategytype: $scope.selectModel.Strategytype.Strategytype, GOLiveDate: $scope.selectModel.GOLiveDate,
            FTAStrategyCodeId: $scope.selectModel.FTAStrategyCode.Id, FTAStrategyCode: $scope.selectModel.FTAStrategyCode.FTAStrategyCode,
            FTAShortCode: $scope.selectModel.FTAShortCode, BusinessLineId: $scope.selectModel.BusinessLine.Id,
            BusinessLine: $scope.selectModel.BusinessLine.BusinessLine, FTAApplicationNameId: $scope.selectModel.FTAApplicationName.Id,
            FTAApplicationName: $scope.selectModel.FTAApplicationName.FTAApplicationName, FTAStrategyOwnerId: $scope.selectModel.FTAStrategyOwner.userId,
            ApplicationCategoryId: $scope.selectModel.ApplicationCategory.Id, ApplicationCategory: $scope.selectModel.ApplicationCategory.ApplicationCategory,
            VenuetypeId: $scope.selectModel.Venuetype.Id, Venuetype: $scope.selectModel.Venuetype.Venuetype,
            DecomissionedDate: $scope.selectModel.DecomissionedDate, DiscretionaryCodeId: $scope.selectModel.DiscretionaryCode.Id,
            DiscretionaryCode: $scope.selectModel.DiscretionaryCode.DiscretionaryCode, ParentID: $scope.selectModel.ParentID.Id,
            ParentIDValue: $scope.selectModel.ParentID.ParentID, FTAApplicationOwnerId: $scope.selectModel.FTAApplicationOwner.userId,
            PriorityScore: $scope.selectModel.PriorityScore, Priority: $scope.selectModel.Priority,
            CapacityId: $scope.selectModel.Capacity.Id, Capacity: $scope.selectModel.Capacity.Capacity,
            BusinessId: $scope.selectModel.Business.Id, Business: $scope.selectModel.Business.Business,
            ThirdPartyAppId: $scope.selectModel.ThirdPartyApp.Id, ThirdPartyValue: $scope.selectModel.ThirdPartyApp.Value,
            FTAApplicationMappingId: $scope.selectModel.FTAApplicationMappingId, FTAStrategyMappingId: $scope.selectModel.FTAStrategyMappingId,
            BusinessMappingId: $scope.selectModel.BusinessMappingId, Description: $scope.selectModel.Description,
            SignOff: $scope.selectModel.SignOff,
            FTAStrategyOwner: $scope.selectModel.FTAStrategyOwner.userId,
            FTAApplicationOwner: $scope.selectModel.FTAApplicationOwner.userId
        };
        if ($scope.AllowSignOff)
            model.SignOff = 'True';
        var array = [];
        array.push(model);
        array.push($scope.Prevvalue);

        StrategyService.UpdateStrategy(array).success(function (data) {
            $scope.showaction = false;
            $scope.editMode = false;
            toaster.pop('success', "Success", "Model/Algo updated successfully", null);
            $('#confirm').modal('hide');
            model.RefNumber = $scope.Prevvalue.RefNumber;
            if (data == "") {
                model.Version = $scope.Prevvalue.Version;
            }
            else if (data == "success")
                model.Version = parseInt($scope.Prevvalue.Version) + 1;

            var hasfile = false;
            if ($scope.selectModel.Systemflowfile) {
                hasfile = true;
                model.Systemflowfilelist = $scope.selectModel.Systemflowfile;
            }
            if ($scope.selectModel.Decommissionedfile) {
                hasfile = true;
                model.Decommissionedfilelist = $scope.selectModel.Decommissionedfile;
            }
            if (hasfile) {
                Upload.upload({
                    url: 'Main/UpdateStrategyFile', //webAPI exposed to upload the file
                    data: model,
                }).then(function (resp) { //upload function returns a promise

                }, function (resp) { //catch error
                    console.log('Error status: ' + resp.status);
                    $window.alert('Error status: ' + resp.status);
                }, function (evt) {
                    console.log(evt);
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.name);
                    $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
                });

            }
            StrategyService.HideLoader();
            $scope.getallalgodata()
            getallgriddata();

        }).error(function (data) {
            $scope.error = "An Error has occured while Adding user! " + data.ExceptionMessage;
        });
    };

    $scope.showconfirm = function (data) {
        $scope.Id = data;
        $('#confirmModal').modal('show');
    };
    $scope.cancel = function () {
        cleardata();
        binddata($scope.CountryMasterList);
        $scope.showaction = false;
        $('#confirmModal').modal('hide');
    };
    function cleardata() {
        $scope.currency = {};
        $scope.selectModel = { Application: {}, Country: {}, ProductType: {}, BusinessSector: {}, Region: {} };
        $scope.UploadedSList = [];
        $scope.UploadedDList = [];
        $scope.multiselect.selected = [];
        $scope.multiselect.options = [];
    }
    $scope.checksignoff = function () {
        if ($scope.selectModel.FTAStrategyOwner.UserName) {
            if ($scope.userId.toLowerCase() == $scope.selectModel.FTAStrategyOwner.UserName.toLowerCase())
                $scope.ApprovalCheck.ShowSignOff = true;
        }
    }
    $scope.userfilter = function (state) {
        try {
            var Region = $scope.selectModel.Region.Id;
            var BusinessLine = $scope.selectModel.BusinessLine.Id;
            if (Region != "" && BusinessLine != "" && BusinessLine != undefined && Region != undefined) {
                ApiCall.MakeApiCall("GetUserbyFilter?RegionId=" + Region + "&BusinessLineId=" + BusinessLine, 'GET', '').success(function (data) {
                    //$scope.FTAApplicationOwnerList = data;
                    $scope.FTAStrategyOwnerList = data;
                    if (state) {
                        $scope.selectModel.FTAStrategyOwner = getdynamicobjectuserfilter($scope.selectModel.FTAStrategyOwnerId, "FTAStrategyOwnerList")
                        //$scope.selectModel.FTAApplicationOwner = getdynamicobjectuserfilter($scope.selectModel.FTAApplicationOwnerId, "FTAApplicationOwnerList")
                    }
                    //if ($scope.AppOwnername != '')
                    //    $scope.selectModel.FTAApplicationOwner = getdynamicobjectuserfilter($scope.AppOwnername, "FTAApplicationOwnerList");
                }).error(function (error) {
                    $scope.Error = error;
                })
            }
            else {
                $scope.FTAStrategyOwnerList = [];
            }
        }
        catch (e) {
        }
    }
    $scope.userfilter1 = function () {
        if ($scope.selectModel.FTAStrategyCode.FTAStrategyCode && $scope.selectModel.FTAApplicationCode.FTAApplicationCode && $scope.selectModel.DiscretionaryCode.DiscretionaryCode && $scope.selectModel.BusinessSuffix.BusinessSuffix) {
            $scope.selectModel.FTAShortCode = $scope.selectModel.FTAStrategyCode.FTAStrategyCode + $scope.selectModel.FTAApplicationCode.FTAApplicationCode + $scope.selectModel.DiscretionaryCode.DiscretionaryCode + $scope.selectModel.BusinessSuffix.BusinessSuffix;
        }
        else
            $scope.selectModel.FTAShortCode = '';
    }

    $scope.userfilter2 = function () {
        if ($scope.selectModel.Strategytype && $scope.selectModel.Venuetype && $scope.selectModel.Capacity) {
            $scope.selectModel.PriorityScore = parseInt($scope.selectModel.Strategytype.Strategytype) + parseInt($scope.selectModel.Venuetype.Venuetype) + parseInt($scope.selectModel.Capacity.Capacity);
        }
        else {
            $scope.selectModel.PriorityScore = '';
            $scope.selectModel.Priority = '';
        }
        if (!isNaN($scope.selectModel.PriorityScore)) {
            var priorityvalue = parseInt($scope.selectModel.PriorityScore)
            if (priorityvalue >= 10 && priorityvalue <= 10)
                $scope.selectModel.Priority = 1;
            if (priorityvalue >= 6 && priorityvalue <= 9)
                $scope.selectModel.Priority = 2;
            if (priorityvalue <= 5)
                $scope.selectModel.Priority = 3;
        }
    }

    $scope.userfilter3 = function () {
        try {
            var Business = $scope.selectModel.FTAApplicationName;

            if (Business != "" && Business != undefined) {
                ApiCall.MakeApiCall("GetAllFTAApplicationMappingbyId?Id=" + Business.Id, 'GET', '').success(function (data) {
                    if (data.length > 0) {
                        $scope.selectModel.FTAApplicationMappingId = data[0].Id;
                        $scope.selectModel.FTAApplicationCode = getdynamicobject(data[0].FTAApplicationCodeId, "FTAApplicationCodeList")
                        $scope.selectModel.FTAApplicationName = getdynamicobject(data[0].FTAApplicationNameId, "FTAApplicationNameList")
                        $scope.selectModel.ChildID = getdynamicobject(data[0].ChildId, "ChildIDList")
                        $scope.selectModel.ThirdPartyApp = getdynamicobject(data[0].ThirdPartyAppId, "ThirdPartyList");
                        $scope.selectModel.ApplicationCategory = getdynamicobject(data[0].ApplicationCategoryId, "ApplicationCategoryList");
                        $scope.selectModel.ParentID = getdynamicobject(data[0].ParentIDValue, "ParentIDList");
                        $scope.selectModel.FTAApplicationOwner = getdynamicobjectuserfilter(data[0].ApplicationOwnerId, "FTAApplicationOwnerList");
                        $scope.userfilter1();
                    }
                    else {
                        clearfilter3();
                    }
                }).error(function (error) {
                    $scope.Error = error;
                })
            }
            else {
                clearfilter3();
            }
        }
        catch (e) {
        }
    }

    function clearfilter3() {
        $scope.selectModel.FTAApplicationMappingId = 0;
        $scope.selectModel.FTAApplicationCode = {};
        //$scope.selectModel.FTAApplicationName = {};
        $scope.selectModel.ChildID = {};
        $scope.selectModel.ThirdPartyApp = {};
        $scope.selectModel.ApplicationCategory = {};
        $scope.selectModel.ParentID = {};
        $scope.selectModel.ApplicationOwnerId = {};
        $scope.userfilter1();
    }

    $scope.userfilter4 = function () {
        try {
            var Business = $scope.selectModel.FTAStrategyName;
            if (Business != "" && Business != undefined) {
                ApiCall.MakeApiCall("GetAllFTAStrategyMappingbyId?Id=" + Business.Id, 'GET', '').success(function (data) {
                    if (data.length > 0) {
                        $scope.selectModel.FTAStrategyMappingId = data[0].Id;
                        $scope.selectModel.FTAStrategyCode = getdynamicobject(data[0].FTAStrategyCodeId, "FTAStrategyCodeList")
                        $scope.userfilter1();
                    }
                    else {
                        clearfilter4();
                    }

                }).error(function (error) {
                    $scope.Error = error;
                });
            }
            else
                clearfilter4()

        }
        catch (e) {
        }
    }

    function clearfilter4() {
        $scope.selectModel.FTAStrategyCode = {};
        $scope.selectModel.FTAStrategyMappingId = 0;
    }
    $scope.userfilter5 = function () {
        try {
            var Business = $scope.selectModel.Business;
            if (Business != "" && Business != undefined) {
                ApiCall.MakeApiCall("GetAllBusinessMappingbyId?Id=" + Business.Id, 'GET', '').success(function (data) {
                    if (data.length > 0) {
                        $scope.selectModel.BusinessMappingId = data[0].Id;
                        $scope.selectModel.BusinessSuffix = getdynamicobject(data[0].BusinessSuffixId, "BusinessSuffixList");
                        $scope.userfilter1();
                    }
                    else
                        clearfilter5();

                }).error(function (error) {
                    $scope.Error = error;
                })
            }
            else
                clearfilter5();

        }
        catch (e) {
        }
    }

    function clearfilter5() {
        $scope.selectModel.BusinessSuffix = {};
        $scope.selectModel.BusinessMappingId = 0;
        $scope.userfilter1();
    }

    $scope.GetRightsList = function () {
        UserFactory.getloggedusername().success(function (data) {
            $scope.userId = data;
            if (data != '') {
                reportFactory.GetRightsList($scope.userId).success(function (data) {
                    var isRead = true, isWrite = false, isApprove = false;
                    $scope.IsReadOnly = true;
                    $scope.IsWrite = false;
                    $scope.ApprovalCheck.IsApprove = false;
                    angular.forEach(data, function (value, key) {
                        if (value.RightName == 'FTA Read Only') {
                            isRead = false;
                        }
                        if (value.RightName == 'FTA Write Access') {
                            isWrite = true;
                        }
                        if (value.RightName == 'FTA Strategy Owner') {
                            isApprove = true;
                        }
                    })
                    if (!isRead) {
                        $scope.Permissions.IsReadOnly = false;
                    }
                    if (isWrite) {
                        $scope.Permissions.IsWrite = true;
                    }
                    if (isApprove) {
                        $scope.ApprovalCheck.IsApprove = true;
                    }
                    $scope.getallalgodata();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }
        });
    };
    $scope.multiselect = {
        selected: [],
        options: [],
        config: {
            hideOnBlur: false,
            showSelected: false,
            itemTemplate: function (item) {
                return $sce.trustAsHtml(item.name);
            },
            labelTemplate: function (item) {
                return $sce.trustAsHtml(item.name);
            }
        }
    };
    function assignUsers() {
        var msUsers = $scope.multiselect.selected;
        binddata($scope.CountryMasterList);
    }
    function binddata(list) {
        $scope.multiselect.options = list.map(function (item) {
            return {
                name: item.CountryName,
                id: item.Id
            };
        });
    }

    $scope.changeDecommisiondate = function (value) {
        $scope.selectModel.DecomissionedDate = value;
    }
    $scope.changeGoLive = function (value) {
        $scope.selectModel.GOLiveDate = value;
    }
    $scope.openpopup = function (type) {
        $scope.Issystemflow = type;
        $('#viewFiles').modal('show');
    }
    $scope.GetRightsList();
}]);

