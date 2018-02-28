var HomeApp = angular.module('homeApp', ['ngRoute']);

HomeApp.controller('HomeController', ['$scope', '$rootScope', '$routeParams', '$location', '$window', 'OppFactory', 'reportFactory', 'UserFactory', 'toaster', '$timeout', 'EstimationApplicationMasterService', 'Opportunityservice', function ($scope, $rootScope, $routeParams, $location, $window, OppFactory, reportFactory, UserFactory, toaster, $timeout, EstimationApplicationMasterService, Opportunityservice) {
    $scope.Ishome = false;
    $scope.view360imgPath = View360ImagesPath;
    $scope.MyType = 0;
    $scope.currentSBU = '';
    $scope.isHeaderFilter = false;
    $scope.HeaderData1 = [];
    $scope.HeaderData = [];
    $scope.Error = {};
    $scope.opp = null;
    $scope.Opp = {};
    $scope.Opps = [];
    $scope.PriceVersions = [];
    $scope.OppVersions = [];
    $scope.ApplicatonVersions = [];
    $scope.AllOpps = [];
    $scope.SBULIST = [];
    $scope.CreateSBULIST = [];
    $scope.editMode = false;
    $scope.ShowDateMessage = false;
    $scope.RightToViewOpp = true;
    $scope.DateMessage = ''
    $scope.HeaderColor = ['olive', 'purple', 'maroon', 'orange', 'aqua', 'blue', 'yellow'];
    $scope.frmDate;
    $scope.toDate;

    //-- Bools to control Opp page widgets --//
    $scope.showUnassigned = false;
    $scope.showMyOpps = false;
    $scope.showDeliverables = false;
    $scope.showOppsCreatedToday = false;
    $scope.showOppsAssignedToday = false;
    $scope.showOppsThisQuarter = false;
    $scope.showOppsThisMonth = false;
    $scope.isNewlyAssigned = false;
    $scope.isPriceSheetExist = false;
    $scope.Country = [];
    $scope.MyOpps = [];
    $scope.Unassigned = [];
    $scope.OppsCreatedToday = [];
    $scope.DeliverablesToday = [];
    $scope.DeliverablesTomorrow = [];
    $scope.OppsThisQuarter = [];
    $scope.OppsThisMonth = [];
    $scope.OppsFoundByDate = [];
    $scope.OpportunityServionLegalEntityList = [];
    $scope.OpportunityCustomerTypeList = [];
    $scope.ParentOpportunityList = [];
    $scope.CreateCountry = [];
    //--End--//
    $scope.ShowPrice = false;
    $scope.ShowPayment = false;
    $scope.IsSCUser = false;

    $scope.ShowPricing = function () {
        var showprice = false;
        var showResource = false;
        var showStayTravel = false;
        var showTandE = false;
        $scope.ShowPrice = false;
        $scope.ShowResource = false;
        $scope.ShowStayTravel = false;
        $scope.ShowTandE = false;

        reportFactory.GetRightsList($rootScope.UserInfo.user.userId).then(function (rights) {
            angular.forEach(rights.data, function (value, key) {
                if (value.RightName == 'Pricing Read' || value.RightName == 'Pricing Write') {
                    showprice = true;
                }
                else if (value.RightName == 'Resourcing Read' || value.RightName == 'Resourcing Write') {
                    showResource = true;
                }
                else if (value.RightName == 'StayTravel Read' || value.RightName == 'StayTravel Write') {
                    showStayTravel = true;
                }
                else if (value.RightName == 'TandE Read' || value.RightName == 'TandE Write') {
                    showTandE = true;
                }
            });
            if (showprice) {
                $scope.ShowPrice = true;
            }
            if (showResource) {
                $scope.ShowResource = true;
            }
            if (showStayTravel) {
                $scope.ShowStayTravel = true;
            }
            if (showTandE) {
                $scope.ShowTandE = true;
            }
        });
    }
    $scope.IsUserSCHead = function () {
        UserFactory.GetUser($rootScope.UserInfo.user.userId).success(function (data) {
            if (data.TypeId == '8') {
                $scope.IsSCUser = true;
            }
        }).error(function (err) {
            $scope.IsSCUser = false;
        });
    };
    $scope.ManualOpportunityDetail = {
        "SBUID": '',
        "CountryId": '',
        "ServionLegalEntity": [],
        "OpportunityName": "",
        "CustomerType": 1,
        "OppId": "",
        "AccManagerName": "",
        "AccountSalesManager": "",
        "OppStatus": "",
        "Vertical": "",
        "Source": "",
        "ParentOppID": "",
        "IsManual": 1
    }

    //Modal popup events
    $scope.ManualOpportunityModel = function () {
        $scope.ManualOpportunityDetail = {};
        $('#ManualOpportunityModel').modal('show');
    };

    $scope.cancel = function () {
        $('#ManualOpportunityModel').modal('hide');
    };

    $scope.CreateManualOpportunity = function (ManualOpportunityData) {
        var isSuccess = false;
        var message = '';
        var isOppExists = false;

        angular.forEach($scope.AllOpps, function (value, key) {
            if (value.OppId == ManualOpportunityData.OppId) {
                message = "Opportunity ID already exists";
                toaster.pop('warning', "Warning", message, null);
                isOppExists = true;
            }
        })
        if (!isOppExists) {
            OppFactory.SaveManualOpportunity(ManualOpportunityData).success(function () {
                isSuccess = true;
                message = "Opportunity created successfully";
                toaster.pop('success', "Success", message, null);
            }).error(function (err) {
                isSuccess = false;
                message = "Unable to create Opportunity";
                toaster.pop('error', "Error", message, null);
            })
            $('#ManualOpportunityModel').modal('hide');
            $timeout(function () {
                var url = urltype + "//" + $window.location.host + HostPath + "/index.html";
                $window.location.href = url;
            }, 1000);
        }
    };

    $scope.GetMyOpportunity = function () {
        console.log('getting my assigned opps..');
        OppFactory.GetMyOpportunity($rootScope.UserInfo.user.userId).success(function (data) {
            console.log('success');
            $scope.MyOpps = data;
        }).error(function (error) {
            console.log('Error: ' + error);
            $scope.Error = error;
        });
    };
    $scope.GetUnassignedOpportunity = function () {
        console.log('getting my un-assigned opps..');
        OppFactory.GetUnassignedOpportunity().success(function (data) {
            console.log('success');
            $scope.Unassigned = data;
        }).error(function (error) {
            console.log('Error: ' + error);
            $scope.Error = error;
        });
    };

    $scope.Logout = function () {
        reportFactory.Logout($scope.userId).success(function (data) {
            $window.sessionStorage['userAuth'] = null;
            $rootScope.UserInfo = null;
            $rootScope.isAuth = false;
            $location.path('/');
        }).error(function (error) {
            $window.sessionStorage['userAuth'] = null;
            $rootScope.UserInfo = null;
            $rootScope.isAuth = false;
            $location.path('/');
        });
    };

    $scope.GetOpportunitySBUCount = function (UID) {
        OppFactory.GetOpportunitySBUCount(UID).success(function (data) {
            $scope.HeaderData1 = data;
            angular.forEach($scope.HeaderData1, function (value, key) {
                value.Color = $scope.HeaderColor[key];
                value.SBUID = $scope.getSBUID(value.SBU);
                value.userID = $rootScope.UserInfo.user.userId;
                $scope.HeaderData.push(value);
            });
            $scope.headerSpace = 2// Math.round(12 / $scope.HeaderData.length);
        }).error(function (error) {
            $scope.Error = error;
        });
    }

    $scope.getSBUID = function (sbuName) {
        var result = 0;
        angular.forEach($scope.SBULIST, function (value, key) {
            if (value.SBU == sbuName) {
                result = value.id;
            }
        });
        return result;
    }

    $scope.getSBUName = function (sbuID) {
        var result = '';
        angular.forEach($scope.SBULIST, function (value, key) {
            if (value.id == sbuID) {
                result = value.SBU;
            }
        });
        return result;
    }

    $scope.IsNewlyAssigned = function (oppId) {
        $scope.isNewlyAssigned = false;
        angular.forEach($scope.MyOpps, function (value, key) {
            console.log('my opp: ' + value.OppAssignedOn);
            if ((value.id == oppId) && (IsDateToday(value.OppAssignedOn) == true)) {
                $scope.isNewlyAssigned = true;
            }
        })
        return $scope.isNewlyAssigned;
    }

    $scope.GetAllOpportunity = function () {
        console.log('getting all opp');
        ClearLists();
        OppFactory.GetAllOpportunity().success(function (data) {
            $scope.AllOpps = data;

            angular.forEach(data, function (value, key) {
                console.log('---------------Check is opp: ' + value.AccountName + ' created today-----------------');
                if (value.CreatedOn != null && IsDateToday(value.CreatedOn) == true) {
                    $scope.OppsCreatedToday.push(value);
                }
                console.log('---------------Check is opp: ' + value.AccountName + ' deliverable for today-----------------');
                console.log('Expected closure date: ' + value.ExpectedClosureDate);
                if (value.ExpectedClosureDate != null && IsDateToday(value.ExpectedClosureDate) == true) {
                    $scope.DeliverablesToday.push(value);
                }
                console.log('---------------Check is opp: ' + value.AccountName + ' deliverable for tomorrow-----------------');
                if (value.ExpectedClosureDate != null && IsDateTomorrow(value.ExpectedClosureDate) == true) {
                    $scope.DeliverablesTomorrow.push(value);
                }
                if (value.CreatedOn != null && IsDateThisMonth(value.CreatedOn) == true) {
                    $scope.OppsThisMonth.push(value);
                }
                if (value.CreatedOn != null && IsDateThisQuarter(value.CreatedOn) == true) {
                    $scope.OppsThisQuarter.push(value);
                }
            });
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    ClearLists = function () {
        $scope.MyOpps = [];
        $scope.Unassigned = [];
        $scope.OppsCreatedToday = [];
        $scope.DeliverablesToday = [];
        $scope.DeliverablesTomorrow = [];
        $scope.OppsThisQuarter = [];
        $scope.OppsThisMonth = [];
        $scope.OppsFoundByDate = [];
    };

    IsDateThisQuarter = function (inDate) {
        console.log('Checking is date this quarter...');
        inDate = inDate.substring(0, 10);
        console.log('inDate - ' + inDate);
        var today = new Date();
        var month = today.getMonth() + 1;

        var currQuarter;
        if (month < 4)
            currQuarter = 1;
        else if (month < 7)
            currQuarter = 2;
        else if (month < 10)
            currQuarter = 3;
        else if (month < 13)
            currQuarter = 4;

        var indate = new Date(inDate);
        var inMonth = indate.getMonth() + 1;
        var inQuarter;
        if (inMonth < 4)
            inQuarter = 1;
        else if (inMonth < 7)
            inQuarter = 2;
        else if (inMonth < 10)
            inQuarter = 3;
        else if (inMonth < 13)
            inQuarter = 4;

        if (currQuarter == inQuarter && indate.getFullYear() == today.getFullYear()) {
            return true;
        }
        else {
            return false;
        }
    };
    IsDateThisMonth = function (inDate) {
        console.log('Checking is date this month...');
        inDate = inDate.substring(0, 10);
        console.log('inDate - ' + inDate);
        var currDate = new Date();
        var indate = new Date(inDate);

        if ((indate.getMonth() == currDate.getMonth()) && (indate.getFullYear() == currDate.getFullYear())) {
            return true;
        }
        else {
            return false;
        }
    };
    IsDateTomorrow = function (inDate) {
        console.log('Checking is date tomorrow....');
        inDate = inDate.substring(0, 10);
        console.log('inDate - ' + inDate);
        var indate = new Date(inDate);
        indate = new Date(indate.setDate(indate.getDate()));
        var twoDigitMonthIn = ((indate.getMonth().length + 1) === 1) ? (indate.getMonth() + 1) : '0' + (indate.getMonth() + 1);
        inDate = indate.getFullYear() + "-" + twoDigitMonthIn + "-" + indate.getDate();

        var fullDate = new Date();
        fullDate = new Date(fullDate.setDate(fullDate.getDate() + 1)); //Tomorrow's Date
        var twoDigitMonth = ((fullDate.getMonth().length + 1) === 1) ? (fullDate.getMonth() + 1) : '0' + (fullDate.getMonth() + 1);
        var date = fullDate.getFullYear() + "-" + twoDigitMonth + "-" + fullDate.getDate();

        var tomDate = new Date(date);
        var chkDate = new Date(inDate);

        console.log('Tomorrow\'s Date: ' + tomDate.toDateString());
        console.log('Input Date: ' + chkDate.toDateString());

        if (tomDate.toDateString() == chkDate.toDateString()) {
            console.log('The dates match');
            return true;
        }
        else {
            console.log('The dates do not match');
            return false;
        }
    };
    IsDateToday = function (inDate) {
        console.log('Checking is date today....');
        if (inDate == null || inDate == undefined) {
            console.log('The date to compare is undefined');
            return false;
        }
        inDate = inDate.substring(0, 10);
        console.log('inDate - ' + inDate);
        var indate = new Date(inDate);
        var fullDate = new Date();
        var twoDigitMonth = ((fullDate.getMonth().length + 1) === 1) ? (fullDate.getMonth() + 1) : '0' + (fullDate.getMonth() + 1);
        var twoDigitMonthIn = ((indate.getMonth().length + 1) === 1) ? (indate.getMonth() + 1) : '0' + (indate.getMonth() + 1);
        var date = fullDate.getFullYear() + "-" + twoDigitMonth + "-" + fullDate.getDate();
        inDate = indate.getFullYear() + "-" + twoDigitMonthIn + "-" + indate.getDate();

        var curDate = new Date(date);
        var chkDate = new Date(inDate);

        console.log('Current Date: ' + curDate.toDateString());
        console.log('Input Date: ' + chkDate.toDateString());

        if (curDate.toDateString() == chkDate.toDateString()) {
            console.log('The dates match');
            return true;
        }
        else {
            console.log('The dates do not match');
            return false;
        }
    };
    IsDateBetween = function (fromDate, toDate, findDate) {
        $scope.frmDate = $("#frmDate").val();
        $scope.toDate = $("#toDate").val();
        findDate = findDate.substring(0, 10);
        console.log('findDate - ' + findDate);

        if ($scope.frmDate == '' && $scope.toDate == '') {
            $scope.DateMessage = 'Please provide Start date & End date';
            return false;
        }
        else if ($scope.frmDate == '') {
            $scope.DateMessage = 'Please provide Start date';
            return false;
        }
        else if ($scope.toDate == '') {
            $scope.DateMessage = 'Please provide End date';
            return false;
        }

        var currDate = new Date();
        findDate = new Date(findDate);
        fromDate = new Date($scope.frmDate);
        toDate = new Date($scope.toDate);
        var twoDigitMonthFind = ((findDate.getMonth().length + 1) === 1) ? (findDate.getMonth() + 1) : '0' + (findDate.getMonth() + 1);
        var twoDigitMonthFrom = ((fromDate.getMonth().length + 1) === 1) ? (fromDate.getMonth() + 1) : '0' + (fromDate.getMonth() + 1);
        var twoDigitMonthTo = ((toDate.getMonth().length + 1) === 1) ? (toDate.getMonth() + 1) : '0' + (toDate.getMonth() + 1);
        var twoDigitMonthCur = ((currDate.getMonth().length + 1) === 1) ? (currDate.getMonth() + 1) : '0' + (currDate.getMonth() + 1);


        var FindDate = findDate.getFullYear() + "-" + twoDigitMonthFind + "-" + findDate.getDate();
        var FromDate = fromDate.getFullYear() + "-" + twoDigitMonthFrom + "-" + fromDate.getDate();
        var ToDate = toDate.getFullYear() + "-" + twoDigitMonthTo + "-" + toDate.getDate();
        var currentDate = currDate.getFullYear() + "-" + twoDigitMonthCur + "-" + currDate.getDate();

        var find = new Date(FindDate);
        var from = new Date(FromDate);
        var to = new Date(ToDate);
        var current = new Date(currentDate);

        if (from > current) {
            $scope.DateMessage = 'From date cannot be greater than system date';
            return false;
        }
        if (to > current) {
            $scope.DateMessage = 'To date cannot be greater than system date';
            return false;
        }
        if (from > to) {
            $scope.DateMessage = 'From date cannot be greater than To date';
            return false;
        }

        console.log('Checking if date ' + find + ' is between ' + from + ' and ' + to);

        if (find >= from && find <= to) {
            console.log('The date is valid');
            //alert('From Date: ' + FromDate + '\nToDate: ' + ToDate + '\nFindDate: ' + FindDate + '\nValid');
            return true;
        }
        else {
            console.log('The date is not valid');
            //alert('From Date: ' + FromDate + '\nToDate: ' + ToDate + '\nFindDate: ' + FindDate + '\nInvalid');
            return false;
        }
    };

    $scope.GetOpportunityBySBU = function (oppID) {
        OppFactory.GetOpportunityBySBU(oppID).success(function (data) {
            angular.forEach(data, function (value, key) {
                if (value.ParentOppId == null || value.ParentOppId == '') {
                    value.IsChild = 'No';
                }
                else {
                    value.IsChild = 'Yes (' + value.ParentOppId + ')';
                }
                if (value.CSCStatus == null) {
                    value.CSCStatus = 'Not Assigned';
                }
            });
            $scope.Opps = data;
            $scope.gridOptions.api.setRowData(data);
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.AllCountryList = function () {
        OppFactory.GetAllCountry().success(function (data) {
            $scope.Country = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.GetOpportunityForUser = function (userID) {
        if (userID == '' || userID == null) {
            userID = $rootScope.UserInfo.user.userId;
        }
        OppFactory.GetOpportunityForUser({ 'userID': userID }).success(function (data) {
            angular.forEach(data, function (value, key) {
                if (value.ParentOppId == null || value.ParentOppId == '') {
                    value.IsChild = 'No';
                }
                else {
                    value.IsChild = 'Yes (' + value.ParentOppId + ')';
                }
                if (value.CSCStatus == null) {
                    value.CSCStatus = 'Not Assigned';
                }
            });
            $scope.Opps = data;
            $scope.gridOptions.api.setRowData(data);
            $scope.CheckOppIDFor360();
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.HeaderClick = function (headerData) {
        $scope.isHeaderFilter = true;
        $scope.currentSBU = headerData.SBU;
        $scope.GetOpportunityBySBU(headerData);
    };

    $scope.GetOpportunity = function (oppId) {
        OppFactory.GetOpportunity(oppId).success(function (data) {
            $scope.Opp = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.GetAllSBU = function () {
        OppFactory.GetAllSBU().success(function (data) {
            $scope.SBULIST = data;
            angular.forEach(data, function (value, key) {
                if (value.id != '6') {
                    $scope.CreateSBULIST.push(value);
                }
            });
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.refreshParentID = function () {
        if ($scope.ManualOpportunityDetail.SBUID != '') {
            $scope.GetParentID($scope.ManualOpportunityDetail.SBUID);
            OppFactory.GetAllCountry().success(function (data) {
                $scope.CreateCountry = [];
                angular.forEach(data, function (value, key) {
                    if (value.SBUId == $scope.ManualOpportunityDetail.SBUID) {
                        $scope.CreateCountry.push(value);
                    }
                });
                if ($scope.CreateCountry.length > 0) {
                    $scope.ManualOpportunityDetail.CountryId = $scope.CreateCountry[0].Id;
                }
            }).error(function (error) {
                $scope.Error = error;
            })
        }
    };

    $scope.GetParentID = function (sbuID) {
        OppFactory.ParentOpportunity(sbuID).success(function (ParentOpportunitydata) {
            $scope.ParentOpportunityList = ParentOpportunitydata;
        }).error(function (error) {
            $scope.Error = error;
        });
    }

    $scope.GetOpportunityServionLegalEntity = function () {
        OppFactory.GetOpportunityServionLegalEntity().success(function (data) {
            $scope.OpportunityServionLegalEntityList = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.GetOpportunityCustomerType = function () {
        OppFactory.GetOpportunityCustomerType().success(function (data) {
            $scope.OpportunityCustomerTypeList = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.GetTypeID = function () {
        OppFactory.GetTypeID($rootScope.UserInfo.user.userId).success(function (data) {
            console.log('typeid:' + data[0].TypeId);
            $scope.MyType = data[0].TypeId;
            $scope.InitializeOppPage();
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.FindOppByDate = function (fromdate, to) {
        $scope.ShowDateMessage = false;
        $scope.DateMessage = '';
        $scope.OppsFoundByDate = [];
        angular.forEach($scope.AllOpps, function (value, key) {
            if (IsDateBetween(fromdate, to, value.CreatedOn) == true) {
                $scope.OppsFoundByDate.push(value);
            }
        });
        if ($scope.OppsFoundByDate.length == 0) {
            $scope.ShowDateMessage = true;
            if ($scope.DateMessage == '') {
                $scope.DateMessage = "No Opportunities found in this range!";
            }
        }
        else {
            $scope.ShowDateMessage = false;
        }
    };

    $scope.InitializeOppPage = function () {
        console.log('initializing..' + $scope.MyType);

        switch ($scope.MyType) {
            case '1':
                $scope.showUnassigned = true;
                $scope.showMyOpps = true;
                $scope.showDeliverables = true;
                $scope.showOppsCreatedToday = true;
                $scope.showOppsAssignedToday = true;
                $scope.showOppsThisQuarter = true;
                $scope.showOppsThisMonth = true;
                break;
            case '2':
                $scope.showUnassigned = true;
                $scope.showMyOpps = true;
                $scope.showDeliverables = true;
                $scope.showOppsCreatedToday = true;
                $scope.showOppsAssignedToday = true;
                $scope.showOppsThisQuarter = true;
                $scope.showOppsThisMonth = true;
                break;
            case '3':
                $scope.showUnassigned = true;
                $scope.showMyOpps = true;
                $scope.showDeliverables = true;
                $scope.showOppsCreatedToday = true;
                $scope.showOppsAssignedToday = true;
                $scope.showOppsThisQuarter = true;
                $scope.showOppsThisMonth = true;
                break;
            case '4':
                $scope.showUnassigned = true;
                $scope.showMyOpps = true;
                $scope.showDeliverables = true;
                $scope.showOppsCreatedToday = true;
                $scope.showOppsAssignedToday = true;
                $scope.showOppsThisQuarter = true;
                $scope.showOppsThisMonth = true;
                break;
            case '5':
                $scope.showUnassigned = true;
                $scope.showMyOpps = true;
                $scope.showDeliverables = true;
                $scope.showOppsCreatedToday = true;
                $scope.showOppsAssignedToday = true;
                $scope.showOppsThisQuarter = true;
                $scope.showOppsThisMonth = true;
                break;
            case '6':
                $scope.showUnassigned = true;
                $scope.showMyOpps = true;
                $scope.showDeliverables = true;
                $scope.showOppsCreatedToday = true;
                $scope.showOppsAssignedToday = true;
                $scope.showOppsThisQuarter = true;
                $scope.showOppsThisMonth = true;
                break;
            case '7':
                $scope.showUnassigned = true;
                $scope.showMyOpps = true;
                $scope.showDeliverables = true;
                $scope.showOppsCreatedToday = true;
                $scope.showOppsAssignedToday = true;
                $scope.showOppsThisQuarter = true;
                $scope.showOppsThisMonth = true;
                break;
            case '8':
                $scope.showUnassigned = true;
                $scope.showMyOpps = true;
                $scope.showDeliverables = true;
                $scope.showOppsCreatedToday = true;
                $scope.showOppsAssignedToday = true;
                $scope.showOppsThisQuarter = true;
                $scope.showOppsThisMonth = true;
                break;
            case '9':
                $scope.showUnassigned = true;
                $scope.showMyOpps = true;
                $scope.showDeliverables = true;
                $scope.showOppsCreatedToday = true;
                $scope.showOppsAssignedToday = true;
                $scope.showOppsThisQuarter = true;
                $scope.showOppsThisMonth = true;
                break;
            case '10':
                $scope.showUnassigned = true;
                $scope.showMyOpps = true;
                $scope.showDeliverables = true;
                $scope.showOppsCreatedToday = true;
                $scope.showOppsAssignedToday = true;
                $scope.showOppsThisQuarter = true;
                $scope.showOppsThisMonth = true;
                break;
            case '11':
                $scope.showUnassigned = true;
                $scope.showMyOpps = true;
                $scope.showDeliverables = true;
                $scope.showOppsCreatedToday = true;
                $scope.showOppsAssignedToday = true;
                $scope.showOppsThisQuarter = true;
                $scope.showOppsThisMonth = true;
                break;
            case '12':
                $scope.showUnassigned = true;
                $scope.showMyOpps = true;
                $scope.showDeliverables = true;
                $scope.showOppsCreatedToday = true;
                $scope.showOppsAssignedToday = true;
                $scope.showOppsThisQuarter = true;
                $scope.showOppsThisMonth = true;
                break;
            case '13':
                $scope.showUnassigned = true;
                $scope.showMyOpps = true;
                $scope.showDeliverables = true;
                $scope.showOppsCreatedToday = true;
                $scope.showOppsAssignedToday = true;
                $scope.showOppsThisQuarter = true;
                $scope.showOppsThisMonth = true;
                break;
            case '14':
                $scope.showUnassigned = true;
                $scope.showMyOpps = true;
                $scope.showDeliverables = true;
                $scope.showOppsCreatedToday = true;
                $scope.showOppsAssignedToday = true;
                $scope.showOppsThisQuarter = true;
                $scope.showOppsThisMonth = true;
                break;
        }
    };
    var formatDate = function (date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
    }

    $scope.GetAllOpportunityVersion = function () {
        OppFactory.GetAllOpportunityVersion().success(function (data) {
            $scope.OppVersions = data;
            //   alert(JSON.stringify(data));
        }).error(function (error) {
            //  alert('Error: ' + error);
            $scope.Error = error;
        })
    };

    $scope.GetPriceVersions = function (oppId) {
        var arraydata = ['ACQUEON', 'ADMIN', 'APPLICATIONS', 'Avaya', 'CISCO', 'eGain', 'PACKAGE', 'REPORT', 'SELF_SERVICE', 'SERVION_PRODUCTS', 'WFO', 'OTHERS']
        Opportunityservice.getOpportunityEstimationProduct(oppId).success(function (ServionEstimationProductdata) {
            angular.forEach(arraydata, function (value, key) {
                $scope[value] = false;
                if (_.where(ServionEstimationProductdata, { ProductName: value }).length > 0)
                    $scope[value] = true;
            });

        })
        $scope.PriceVersions = [];
        $scope.isPriceSheetExist = false;
        $scope.Opp.LatestPriceVersion = 0;
        angular.forEach($scope.OppVersions, function (value, key) {
            if (value.id == oppId && value.PriceSheetId != null) {
                if (value.CreatedOn != null) {
                    value.CreatedOn = formatDate(value.CreatedOn);
                }
                $scope.PriceVersions.push(value);
                if ($scope.Opp.LatestPriceVersion < value.PriceSheetId) {
                    $scope.Opp.LatestPriceVersion = value.PriceSheetId;
                    $scope.isPriceSheetExist = true;
                }
            }
        });
    };

    $scope.Currentpage = 'Application Sheet';

    $scope.GetResourceVersions = function (oppId) {
        $scope.ResourceVersions = [];
        $scope.isResourceSheetExist = false;
        $scope.Opp.LatestResourceVersion = 0;
        EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'ResourceSheet').success(function (data) {
            $scope.ResVersions = data;
            angular.forEach($scope.ResVersions, function (value, key) {
                if (value.ApplicationId != null) {
                    $scope.ResourceVersions.push(value);
                    if ($scope.Opp.LatestResourceVersion < value.ApplicationId) {
                        $scope.Opp.LatestResourceVersion = value.ApplicationId;
                        $scope.isResourceSheetExist = true;
                    }
                }
            });
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.GetStayTravelVersions = function (oppId) {
        $scope.StayTravelVersions = [];
        $scope.isStayTravelSheetExist = false;
        $scope.Opp.LatestStayTravelVersion = 0;
        EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'StayTravelSheet').success(function (data) {
            $scope.stayVersions = data;
            angular.forEach($scope.stayVersions, function (value, key) {
                if (value.ApplicationId != null) {
                    $scope.StayTravelVersions.push(value);
                    if ($scope.Opp.LatestStayTravelVersion < value.ApplicationId) {
                        $scope.Opp.LatestStayTravelVersion = value.ApplicationId;
                        $scope.isStayTravelSheetExist = true;
                    }
                }
            });
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.GetTandEVersions = function (oppId) {
        $scope.TandEVersions = [];
        $scope.isTandESheetExist = false;
        $scope.Opp.LatestTandEVersion = 0;
        EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'TandESheet').success(function (data) {
            $scope.tandEVersions = data;
            angular.forEach($scope.tandEVersions, function (value, key) {
                if (value.ApplicationId != null) {
                    $scope.TandEVersions.push(value);
                    if ($scope.Opp.LatestTandEVersion < value.ApplicationId) {
                        $scope.Opp.LatestTandEVersion = value.ApplicationId;
                        $scope.isTandESheetExist = true;
                    }
                }
            });
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.GetAppVersions = function (id, oppId) {
        $scope.AppVersions = [];
        $scope.isApplicatonSheetExist = false;
        $scope.Opp.LatestAppVersion = 0;
        $scope.TotalAppVersion = 0;
        EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'ApplicationSheet').success(function (data) {
            $scope.ApplicatonVersions = data;

            angular.forEach($scope.ApplicatonVersions, function (value, key) {
                if (value.ApplicationId != null) {
                    $scope.TotalAppVersion++;
                    value.oppautoid = id;
                    $scope.AppVersions.push(value);
                    if ($scope.Opp.LatestAppVersion < value.ApplicationId) {
                        $scope.Opp.LatestAppVersion = value.ApplicationId;
                        $scope.isApplicatonSheetExist = true;
                    }
                }
            });
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.GetManualVersions = function (id, oppId) {
        $scope.ManualVersions = [];
        $scope.isManualSheetExist = false;
        $scope.Opp.LatestManualVersion = 0;
        $scope.TotalOthersVersion = 0;
        EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'ManualEstimationSheet').success(function (data) {
            $scope.OthersVersions = data;

            angular.forEach($scope.OthersVersions, function (value, key) {
                if (value.ApplicationId != null) {
                    $scope.TotalOthersVersion++;
                    value.oppautoid = id;
                    $scope.ManualVersions.push(value);
                    if ($scope.Opp.LatestManualVersion < value.ApplicationId) {
                        $scope.Opp.LatestManualVersion = value.ApplicationId;
                        $scope.isManualSheetExist = true;
                    }
                }
            });
        }).error(function (error) {
            $scope.Error = error;
        });


    };


    $scope.GetOthersVersions = function (id, oppId) {
        $scope.OtherVersions = [];
        $scope.isOthersSheetExist = false;
        $scope.Opp.LatestOthersVersion = 0;
        $scope.TotalOthersVersion = 0;
        EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'OthersSheet').success(function (data) {
            $scope.OthersVersions = data;

            angular.forEach($scope.OthersVersions, function (value, key) {
                if (value.ApplicationId != null) {
                    $scope.TotalOthersVersion++;
                    value.oppautoid = id;
                    $scope.OtherVersions.push(value);
                    if ($scope.Opp.LatestOthersVersion < value.ApplicationId) {
                        $scope.Opp.LatestOthersVersion = value.ApplicationId;
                        $scope.isOthersSheetExist = true;
                    }
                }
            });
        }).error(function (error) {
            $scope.Error = error;
        });


    };

    $scope.GetSelfServiceVersions = function (id, oppId) {
        $scope.SelfVersions = [];
        $scope.isSelfServiceSheetExist = false;
        $scope.Opp.LatestSelfServiceVersion = 0;
        $scope.TotalSelfServiceVersion = 0;
        EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'SelfServiceSheet').success(function (data) {
            $scope.SelfServiceVersions = data;

            angular.forEach($scope.SelfServiceVersions, function (value, key) {
                if (value.ApplicationId != null) {
                    $scope.TotalSelfServiceVersion++;
                    value.oppautoid = id;
                    $scope.SelfVersions.push(value);
                    if ($scope.Opp.LatestSelfServiceVersion < value.ApplicationId) {
                        $scope.Opp.LatestSelfServiceVersion = value.ApplicationId;
                        $scope.isSelfServiceSheetExist = true;
                    }
                }
            });
        }).error(function (error) {
            $scope.Error = error;
        });


    };

    $scope.GetEGainVersions = function (id, oppId) {
        $scope.EGVersions = [];
        $scope.isEGainSheetExist = false;
        $scope.Opp.LatestEGainVersion = 0;
        $scope.TotalEGainVersion = 0;
        EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'EGainSheet').success(function (data) {
            $scope.EGainVersions = data;

            angular.forEach($scope.EGainVersions, function (value, key) {
                if (value.ApplicationId != null) {
                    $scope.TotalEGainVersion++;
                    value.oppautoid = id;
                    $scope.EGVersions.push(value);
                    if ($scope.Opp.LatestEGainVersion < value.ApplicationId) {
                        $scope.Opp.LatestEGainVersion = value.ApplicationId;
                        $scope.isEGainSheetExist = true;
                    }
                }
            });
        }).error(function (error) {
            $scope.Error = error;
        });
    };


    $scope.GetAvayaVersions = function (id, oppId) {
        $scope.AVVersions = [];
        $scope.isAvayaSheetExist = false;
        $scope.Opp.LatestAvayaVersion = 0;
        $scope.TotalAvayaVersion = 0;
        EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'AvayaSheet').success(function (data) {
            $scope.AvayaVersions = data;

            angular.forEach($scope.AvayaVersions, function (value, key) {
                if (value.ApplicationId != null) {
                    $scope.TotalAvayaVersion++;
                    value.oppautoid = id;
                    $scope.AVVersions.push(value);
                    if ($scope.Opp.LatestAvayaVersion < value.ApplicationId) {
                        $scope.Opp.LatestAvayaVersion = value.ApplicationId;
                        $scope.isAvayaSheetExist = true;
                    }
                }
            });
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.GetCiscoVersions = function (id, oppId) {
        $scope.CSVersions = [];
        $scope.isCiscoSheetExist = false;
        $scope.Opp.LatestCiscoVersion = 0;
        $scope.TotalCiscoVersion = 0;
        EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'CiscoSheet').success(function (data) {
            $scope.CiscoVersions = data;

            angular.forEach($scope.CiscoVersions, function (value, key) {
                if (value.ApplicationId != null) {
                    $scope.TotalCiscoVersion++;
                    value.oppautoid = id;
                    $scope.CSVersions.push(value);
                    if ($scope.Opp.LatestCiscoVersion < value.ApplicationId) {
                        $scope.Opp.LatestCiscoVersion = value.ApplicationId;
                        $scope.isCiscoSheetExist = true;
                    }
                }
            });
        }).error(function (error) {
            $scope.Error = error;
        });
    };


    $scope.GetAcqueonVersions = function (id, oppId) {
        $scope.ACQVersions = [];
        $scope.isAcqueonSheetExist = false;
        $scope.Opp.LatestAcqueonVersion = 0;
        $scope.TotalAcqueonVersion = 0;
        EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'AcqueonSheet').success(function (data) {
            $scope.AcqueonVersions = data;

            angular.forEach($scope.AcqueonVersions, function (value, key) {
                if (value.ApplicationId != null) {
                    $scope.TotalAcqueonVersion++;
                    value.oppautoid = id;
                    $scope.ACQVersions.push(value);
                    if ($scope.Opp.LatestAcqueonVersion < value.ApplicationId) {
                        $scope.Opp.LatestAcqueonVersion = value.ApplicationId;
                        $scope.isAcqueonSheetExist = true;
                    }
                }
            });
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.GetWFOVersions = function (id, oppId) {
        $scope.WFVersions = [];
        $scope.isWFOSheetExist = false;
        $scope.Opp.LatestWFOVersion = 0;
        $scope.TotalWFOVersion = 0;
        EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'WFOSheet').success(function (data) {
            $scope.WFOVersions = data;

            angular.forEach($scope.WFOVersions, function (value, key) {
                if (value.ApplicationId != null) {
                    $scope.TotalWFOVersion++;
                    value.oppautoid = id;
                    $scope.WFVersions.push(value);
                    if ($scope.Opp.LatestWFOVersion < value.ApplicationId) {
                        $scope.Opp.LatestWFOVersion = value.ApplicationId;
                        $scope.isWFOSheetExist = true;
                    }
                }
            });
        }).error(function (error) {
            $scope.Error = error;
        });
    };


    $scope.GetServProductsVersions = function (id, oppId) {
        $scope.ServPoductVersions = [];
        $scope.isServionProductsSheetExist = false;
        $scope.Opp.LatestServionProductsVersion = 0;
        $scope.TotalServionProductsVersion = 0;
        EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'ServionProductsSheet').success(function (data) {
            $scope.ServionProductsVersions = data;

            angular.forEach($scope.ServionProductsVersions, function (value, key) {
                if (value.ApplicationId != null) {
                    $scope.TotalServionProductsVersion++;
                    value.oppautoid = id;
                    $scope.ServPoductVersions.push(value);
                    if ($scope.Opp.LatestServionProductsVersion < value.ApplicationId) {
                        $scope.Opp.LatestServionProductsVersion = value.ApplicationId;
                        $scope.isServionProductsSheetExist = true;
                    }
                }
            });
        }).error(function (error) {
            $scope.Error = error;
        });
    };

    $scope.GetAdminVersions = function (id, oppId) {
        $scope.AdminVersions = [];
        $scope.isAdminReportsSheetExist = false;
        $scope.Opp.LatestAdminReportsVersion = 0;
        $scope.TotalAdminReportsVersion = 0;
        EstimationApplicationMasterService.GetEstimationApplicationVersionsForOpp(oppId, 'AdminReportsSheet').success(function (data) {
            $scope.AdminReportsVersions = data;

            angular.forEach($scope.AdminReportsVersions, function (value, key) {
                if (value.ApplicationId != null) {
                    $scope.TotalAdminReportsVersion++;
                    value.oppautoid = id;
                    $scope.AdminVersions.push(value);
                    if ($scope.Opp.LatestAdminReportsVersion < value.ApplicationId) {
                        $scope.Opp.LatestAdminReportsVersion = value.ApplicationId;
                        $scope.isAdminReportsSheetExist = true;
                    }
                }
            });
        }).error(function (error) {
            $scope.Error = error;
        });


    };


    $scope.GetOppFromID = function (oppId) {
        $scope.Opp = [];
        //console.log('Opps content: \n' + JSON.stringify($scope.Opps));
        angular.forEach($scope.Opps, function (value1, key) {
            if (value1.id == oppId) {
                if (value1.ParentOppId != null && value1.ParentOppId != '') {
                    oppId = value1.ParentOppId;
                    angular.forEach($scope.Opps, function (value2, key) {
                        if (value2.OppId == oppId) {
                            console.log('Returning parent opp..' + JSON.stringify(value2));
                            $scope.Opp = value2;
                            $scope.Opp.id = value2.id;
                            return;
                        }
                    })
                }
                else {
                    console.log('Returning opp..' + JSON.stringify(value1));
                    $scope.Opp = value1;
                    return;
                }
            }
        });
    };
    $scope.showPriceVersion = true;
    $scope.showPaymentVersion = true;
    $scope.showEstimationVersion = true;
    $scope.EFirstOpen = true;
    $scope.isDisabled = false;

    $scope.toggleView = function (widget) {
        switch (widget) {
            case 'pricing':
                if ($scope.showPriceVersion == true) {
                    $scope.showPriceVersion = false;
                }
                else {
                    $scope.showPriceVersion = true;
                }
                break;
            case 'payment':
                if ($scope.showPaymentVersion == true) {
                    $scope.showPaymentVersion = false;
                }
                else {
                    $scope.showPaymentVersion = true;
                }
                break;
            case 'estimation':
                if ($scope.showEstimationVersion == true) {
                    $scope.showEstimationVersion = false;
                }
                else {
                    $scope.showEstimationVersion = true;
                }
                break;
        }
    };
    $scope.CheckOppIDFor360 = function () {
        if ($routeParams.id != null) {
            $scope.View360($routeParams.id);
        }
    };
    $scope.View360 = function (id) {
        console.log('calling 360 for id ' + id);
        $scope.GetOppFromID(id);
        console.log('Received opp  ' + $scope.Opp.id);
        if ($scope.Opp.id == undefined) {
            toaster.pop('warning', "Warning", 'You do not have permission to view this Opportunity', null);
        }
        else {
            //$scope.GetPriceVersions($scope.Opp.OppId);
            $scope.GetPriceVersions($scope.Opp.id);
            // $scope.GetResourceVersions($scope.Opp.OppId);
            // $scope.GetStayTravelVersions($scope.Opp.OppId);
            // $scope.GetTandEVersions($scope.Opp.OppId);
            $scope.GetAppVersions($scope.Opp.id, $scope.Opp.OppId);
            $scope.GetManualVersions($scope.Opp.id, $scope.Opp.OppId);
            $scope.GetSelfServiceVersions($scope.Opp.id, $scope.Opp.OppId);
            $scope.GetOthersVersions($scope.Opp.id, $scope.Opp.OppId);
            $scope.GetEGainVersions($scope.Opp.id, $scope.Opp.OppId);
            $scope.GetAdminVersions($scope.Opp.id, $scope.Opp.OppId);
            $scope.GetAvayaVersions($scope.Opp.id, $scope.Opp.OppId);
            $scope.GetCiscoVersions($scope.Opp.id, $scope.Opp.OppId);
            $scope.GetWFOVersions($scope.Opp.id, $scope.Opp.OppId);
            $scope.GetServProductsVersions($scope.Opp.id, $scope.Opp.OppId);
            $scope.GetAcqueonVersions($scope.Opp.id, $scope.Opp.OppId);

            $scope.Opp.CSCStatus = ($scope.Opp.CSCStatus == null || $scope.Opp.CSCStatus == undefined) ? 'Not Assigned' : $scope.Opp.CSCStatus;
            console.log('showing 360 for opp: ' + $scope.Opp.id);
            $('#View360').modal('show');
        }
    };

    $scope.RedirectToOpp = function (oppId) {
        $('#View360').modal('hide');
        $location.path("OpportunityDetail/" + oppId);
    };
    $scope.RedirectToHome = function () {
        $('#View360').modal('hide');
        $location.path("home");
    };
    $scope.RedirectToPrice = function (oppId, groupId) {
        $('#View360').modal('hide');
        $location.path("DaySheet/" + oppId + "/" + groupId);

    };

    $scope.RedirectToResource = function (oppId, groupId) {
        $('#View360').modal('hide');
        $location.path("Resource/" + oppId + "/" + groupId);
    };

    $scope.RedirectToStayTravel = function (oppId, groupId) {
        $('#View360').modal('hide');
        $location.path("StayTravel/" + oppId + "/" + groupId);
    };

    $scope.RedirectToTandE = function (oppId, groupId) {
        $('#View360').modal('hide');
        $location.path("TandE/" + oppId + "/" + groupId);
    };

    $scope.RedirectToDay = function (oppId, groupId) {
        $('#View360').modal('hide');
        $location.path("DaySheet/" + oppId + "/" + groupId);

    };


    $scope.RedirectTomanualestimation = function (oppId, groupId) {
        $('#View360').modal('hide');
        $location.path("manualestimation/" + oppId + "/" + groupId);

    };



    $scope.RedirectToEstimate = function (oppId, groupId) {
        $('#View360').modal('hide');
        $location.path("application/" + oppId + "/" + groupId);
    };

    $scope.RedirectToEstimateWFO = function (oppId, groupId) {
        $('#View360').modal('hide');
        $location.path("wfo/" + oppId + "/" + groupId);
    };


    $scope.RedirectToEstimateSelf = function (oppId, groupId) {
        $('#View360').modal('hide');
        $location.path("selfservice/" + oppId + "/" + groupId);

    };

    $scope.RedirectToOpportunityEstimate = function (oppId) {
        $('#View360').modal('hide');
        $location.path("OpportunityEstimationSDLC/" + oppId);

    };

    $scope.RedirectToEstimateAdmin = function (oppId, groupId) {
        $('#View360').modal('hide');
        $location.path("adminreports/" + oppId + "/" + groupId);
    };

    $scope.RedirectToEstimateAvaya = function (oppId, groupId) {
        $('#View360').modal('hide');
        $location.path("avaya/" + oppId + "/" + groupId);
    };

    $scope.RedirectToEstimateCisco = function (oppId, groupId) {
        $('#View360').modal('hide');
        $location.path("cisco/" + oppId + "/" + groupId);
    };

    $scope.RedirectToEstimateEGain = function (oppId, groupId) {
        $('#View360').modal('hide');
        $location.path("egain/" + oppId + "/" + groupId);
    };


    $scope.RedirectToEstimateServionProducts = function (oppId, groupId) {
        $('#View360').modal('hide');
        $location.path("servionproducts/" + oppId + "/" + groupId);
    };

    $scope.RedirectToEstimateAcqueon = function (oppId, groupId) {
        $('#View360').modal('hide');
        $location.path("acqueon/" + oppId + "/" + groupId);
    };

    $scope.RedirectToEstimateOthers = function (oppId, groupId) {
        $('#View360').modal('hide');
        $location.path("others/" + oppId + "/" + groupId);
    };

    $scope.RedirectToPayment = function (oppId, groupId) {
        $('#View360').modal('hide');
        $location.path("PaymentList/" + oppId + "/" + groupId);
    };
    $scope.ValidateTabRights = function () {
        var currentTab = '';
        OppFactory.GetRightsList($rootScope.UserInfo.user.userId).success(function (data) {
            angular.forEach(data, function (value, key) {
                if (value.RightName == 'CSC Details') {
                    currentTab = 'CSCDetails';
                }
                else if (value.RightName == 'Access Details') {
                    currentTab = 'AccessDetails';
                }
                else if (value.RightName == 'Configuration Details') {
                    currentTab = 'OpportunityDetailTab';
                }
            });
            if (currentTab == '') {
                $scope.RightToViewOpp = false;
            }
        }).error(function (error) {
            console.log('Error when getting rights list: ' + error);
        });
    }


    //Start angular grid


    var columnDefs = [
        {
            headerName: "SBU", field: "SBU", editable: false, width: 100, headerTooltip: "SBU", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
        },
        {
            headerName: "Account Name", field: "AccountName", width: 210, headerTooltip: "Account Name", cellStyle: { 'text-align': 'left', 'display': 'flex', 'align-items': 'center' },
            cellRenderer: function (params) {
                if (params.data.IsManual == true) {
                    return '<a ng-click="View360(' + params.data.id + ')">' + params.value + '&nbsp;&nbsp;&nbsp;&nbsp;</a>' + '<small class="label label-info pull-right">Manual</small>';
                }
                else {
                    return '<a ng-click="View360(' + params.data.id + ')">' + params.value + '</a>';
                }
            }
        },
        {
            headerName: "Opportunity Name", field: "OpportunityName", editable: false, width: 210, headerTooltip: "Opportunity Name", cellStyle: { 'text-align': 'left', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "Opportunity ID", field: "OppId", editable: false, width: 120, headerTooltip: "OpportunityID", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "Account Manager Name", field: "AccManagerName", editable: false, width: 175, headerTooltip: "Account Manager Name", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "Is Child", field: "IsChild", editable: false, width: 140, headerTooltip: "Yes, if the opportunity has a parent opportunity", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' }
        },
        {
            headerName: "CSC Status", field: "CSCStatus", editable: false, width: 150, headerTooltip: "CSC Status", cellStyle: { 'text-align': 'center', 'display': 'flex', 'align-items': 'center' },
            cellClassRules: {
                'rag-green-outer': function (params) { return params.value == 'Closed' },
                'rag-amber-outer': function (params) { return params.value === 'Temp' },
                'rag-red-outer': function (params) { return params.value === 'Not Assigned' || params.value === 'Open' || params.value === null }
            },
            cellRenderer: function (params) {
                if (params.value == null) {
                    return '<span style="font-weight: bold;" class="rag-element">Not Assigned</span>';
                }
                else {
                    return '<span style="font-weight: bold;" class="rag-element">' + params.value + '</span>';
                }
            }
        }
    ];
    $scope.GetTypeID();
    $scope.GetAllOpportunity();
    $scope.GetMyOpportunity();
    $scope.GetUnassignedOpportunity();
    $scope.AllCountryList();
    $scope.GetAllSBU();
    $scope.GetOpportunityForUser($rootScope.UserInfo.user.userId);
    $scope.GetOpportunitySBUCount($rootScope.UserInfo.user);
    $scope.GetOpportunityServionLegalEntity();
    $scope.GetOpportunityCustomerType();
    $scope.GetParentID(1);
    $scope.GetAllOpportunityVersion();
    $scope.ValidateTabRights();
    $scope.ShowPricing();
    $scope.IsUserSCHead();


    $scope.gridOptions = {
        columnDefs: columnDefs,
        rowData: $scope.Opps,
        enableFilter: true,
        rowHeight: 25,
        headerHeight: 38,
        pinnedColumnCount: 1,
        suppressCellSelection: true,
        suppressHorizontalScroll: true,
        angularCompileRows: true,
        enableColResize: true,
        onGridReady: function (event) {
            $scope.gridOptions.api.sizeColumnsToFit();
        }
    };
    //End angular grid

}]);

HomeApp.factory('OppFactory', ['$http',function ($http) {
    var Homeurl = BaseURL + 'home';
    var Authurl = BaseURL + 'auth';
    var Mailurl = BaseURL + 'Mail';
    var OppFactory = {

        GetAllOpportunity: function () {
            return $http.get(Homeurl + '/');
        },
        GetOppForMyDay: function () {
            return $http.get(Homeurl + '/GetOppForMyDay');
        },
        GetAllSBU: function () {
            return $http.get(Homeurl + '/GetAllSBU');
        },
        GetOpportunitySBUCount: function (userID) {
            return $http.post(Homeurl + "/SBUCount", userID);
        },
        GetOpportunity: function (oppid) {
            return $http.get(Homeurl + '/?oppId=' + oppid);
        },
        GetOpportunityBySBU: function (oppID) {
            return $http.post(Homeurl + "/SBUOpportunity", oppID);
        },
        GetOpportunityForUser: function (oppID) {
            return $http.post(Homeurl + "/opportunityForUser", oppID);
        },
        GetTypeID: function (userId) {
            return $http.get(Homeurl + '/GetTypeID/?userId=' + userId);
        },
        GetMyOpportunity: function (userId) {
            return $http.get(Homeurl + '/GetMyAssignedOpportunities/?userId=' + userId)
        },
        GetUnassignedOpportunity: function () {
            return $http.get(Homeurl + '/GetUnassignedOpportunities');
        },
        GetAllCountry: function () {
            var result = $http.get(BaseURL + 'country/');
            return result;
        },
        GetOpportunityCustomerType: function () {
            var result = $http.get(BaseURL + 'country/GetOpportunityCustomerType');
            return result;
        },
        GetOpportunityServionLegalEntity: function () {
            var result = $http.get(BaseURL + 'country/GetServionLegalEntity');
            return result;
        },
        MergeManualOpportunity: function (mergeOpportunity) {
            return $http.post(BaseURL + 'country/MergeManualOpportunity', mergeOpportunity);
        },
        SaveManualOpportunity: function (ManualOpportunityDetail) {
            return $http.post(BaseURL + 'country/SaveManualOpportunity', ManualOpportunityDetail);
        },
        ParentOpportunity: function (SBUID) {
            var result = $http.get(BaseURL + 'country/GetParentOpportunityID?SBUID=' + SBUID);
            return result;
        },
        GetAllOpportunityVersion: function () {
            var result = $http.get(BaseURL + 'price/GetAllOpportunityVersion');
            return result;
        },
        GetRightsList: function (userId) {
            return $http.get(Authurl + '/rights/?userId=' + userId);
        },
    };
    return OppFactory;
}]);


