ReportApp.controller('ApprovalsController', ['$scope', '$rootScope', 'StrategyService', '$timeout', '$filter', 'UserFactory', 'reportFactory', 'toaster', 'TaskService', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', 'ApiCall', function ($scope, $rootScope, StrategyService, $timeout, $filter, UserFactory, reportFactory, toaster, TaskService, $compile, DTOptionsBuilder, DTColumnBuilder, ApiCall) {
    $scope.data = [];

    //grid1
    $scope.dtOptionspendingAppproval = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow)
       .withOption('rowCallback', rowCallback);
    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        $('.test', nRow).unbind('click');
        $('.test', nRow).bind('click', function () {
            $scope.$apply(function () {
                $scope.showapprovaldata(aData);
            });
        });
        return nRow;
    }
    $scope.dtColumnsPendingAppproval = [
        DTColumnBuilder.newColumn('RefNumber').withTitle('Ref Number'),
        DTColumnBuilder.newColumn('Ver').withTitle('Version'),
           DTColumnBuilder.newColumn('CreatedDate').withTitle('Created Date'),
        DTColumnBuilder.newColumn('RefNumber').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];

    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }

    //grid2
    $scope.dtOptionscompleteAppproval = DTOptionsBuilder.fromSource()
       .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumnsCompleteAppproval = [
        DTColumnBuilder.newColumn('RefNumber').withTitle('Ref Number'),
        DTColumnBuilder.newColumn('Ver').withTitle('Version'),
        DTColumnBuilder.newColumn('Status').withTitle('Status').renderWith(actionsStatus),
         DTColumnBuilder.newColumn('Comments').withTitle('Comments'),
          DTColumnBuilder.newColumn('ApprovedDate').withTitle('Date'),
    ];


    //grid1
    $scope.dtOptionspendingDelegates = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumnsPendingDelegates = [
        DTColumnBuilder.newColumn('RefNumber').withTitle('Ref Number'),
        DTColumnBuilder.newColumn('Approver').withTitle('Approver'),
        DTColumnBuilder.newColumn('Ver').withTitle('Version'),
        DTColumnBuilder.newColumn('CreatedDate').withTitle('Created Date')
    ];

    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a   class="test"><img src="images/edit.png"></a>';
    }
    function actionsStatus(data, type, full, meta) {

        if (data == "Y")
            return '<a  class="dta-act">Approved</a>';
        else if (data == "N")
            return '<a  class="dta-act-not">Not Approved</a>';
        else
            return '<a  class="dta-sign">Pending</a>';
    }


    //grid2
    $scope.dtOptionscompleteDelegates = DTOptionsBuilder.fromSource()
       .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumnsCompleteDelegates = [
     //DTColumnBuilder.newColumn('Id').withTitle('ID'),
        DTColumnBuilder.newColumn('RefNumber').withTitle('Ref Number'),
        DTColumnBuilder.newColumn('Approver').withTitle('Approver'),
        DTColumnBuilder.newColumn('Ver').withTitle('Version'),
        DTColumnBuilder.newColumn('Status').withTitle('Status'),
         DTColumnBuilder.newColumn('Comments').withTitle('Comments'),
          DTColumnBuilder.newColumn('ApprovedDate').withTitle('Date'),
    ];

    $scope.errorinfo = '';
    $scope.CurrencyList = [];
    $scope.editMode = false;
    $scope.IsReadOnly = true;
    $scope.ecurrency = {};
    $scope.LockedPriceSheet = [];


    $scope.GetRightsList = function () {
        angular.forEach($rootScope.RightList, function (value, key) {
            if (value.RightName.contains('Currency Rate Write')) {
                $scope.IsReadOnly = false;
            }
        });
    };
    $scope.tab1 = true;
    $scope.tab2 = false
    $scope.tab3 = false
    $scope.tab4 = false
    $scope.activatetab = function (id) {
        if (id == 1) {
            $scope.tab1 = true;
            $scope.tab2 = false;
            $scope.tab3 = false;
            $scope.tab4 = false;
        }
        else if (id == 2) {
            $scope.tab1 = false;
            $scope.tab2 = true;
            $scope.tab3 = false;
            $scope.tab4 = false;
        }
        else if (id == 3) {
            $scope.tab1 = false;
            $scope.tab2 = false;
            $scope.tab3 = true;
            $scope.tab4 = false;
        }
        else if (id == 4) {
            $scope.tab1 = false;
            $scope.tab2 = false;
            $scope.tab3 = false;
            $scope.tab4 = true;
        }
    }
    $scope.Strategydata = [];
    $scope.StrategyVersiondata = [];
    $scope.Selcurrentversion = 0;

    $scope.showapprovaldata = function (obj) {
        $('#LayoutModel1').modal('show');
        $scope.notificationExist = true;
        $scope.currency = { 'Comments': obj.Comments, 'RefNumber': obj.RefNumber, 'Approver': obj.Approver, 'Version': obj.Version, 'ApprovedDate': obj.ApprovedDate, 'Status': obj.Status, 'Type': obj.Type };
    };

    $scope.changestatus = function (status) {
        $timeout(function () { $scope.currency.Status = status; });
    }
    $scope.notificationExist = false;
    $scope.notificationdata = [];
    $scope.GetCurrencyConversionForIdView = function (id, Version) {
        $scope.ViewData = [];
        StrategyService.GetStrategyApprovalById(id, Version).success(function (data) {
            $('#viewApprovals').modal('show');
            $scope.ViewData = data;
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding user! " + data.ExceptionMessage;
        });
    };

    $scope.PendingGriddata = [];
    $scope.CompletedGriddata = [];
    $scope.GetAlldata = function (opt) {
        StrategyService.GetStrategyApprovalByuser().success(function (data) {
            $timeout(function () {
                $scope.PendingGriddata = [];
                $scope.CompletedGriddata = [];
                for (var i = 0; i < data.length; i++) {
                    console.log(data[i])
                    data[i].Ver = "Version - " + data[i].Version;
                    data[i].Version = data[i].Version;
                    if (data[i].Status == 'Y' || data[i].Status == 'N')
                        $scope.CompletedGriddata.push(data[i])
                    else
                        $scope.PendingGriddata.push(data[i]);
                }
                $scope.dtOptionspendingAppproval.data = $scope.PendingGriddata;
                $scope.dtOptionscompleteAppproval.data = $scope.CompletedGriddata;
                if (opt == 'Completed')
                    $scope.showMyApproval = false;
                else
                    $scope.showMyApproval = true;
            }, 100)
        }).error(function (error) {
            $scope.Error = error;
        });
    };
    $scope.GetAlldata('Pending');

    $scope.PendingGriddata = [];
    $scope.CompletedGriddata = [];
    $scope.GetDelegatedApprovalAlldata = function (opt) {
        StrategyService.Get_ApprovaltransferByuser().success(function (data) {
            $timeout(function () {
                $scope.DelegatedPendingGriddata = [];
                $scope.DelegatedCompletedGriddata = [];
                for (var i = 0; i < data.length; i++) {
                    console.log(data[i])
                    data[i].Ver = "Version - " + data[i].Version;
                    data[i].Version = data[i].Version;
                    if (data[i].Status == 'N' || data[i].Status == 'Y')
                        $scope.DelegatedCompletedGriddata.push(data[i])
                    else
                        $scope.DelegatedPendingGriddata.push(data[i])

                }
                $scope.dtOptionspendingDelegates.data = $scope.DelegatedPendingGriddata;
                $scope.dtOptionscompleteDelegates.data = $scope.DelegatedCompletedGriddata;
                if (opt == 'Completed')
                    $scope.showMyDelegateApproved = false;
                else
                    $scope.showMyDelegateApproved = true;
            }, 100)
        }).error(function (error) {
            $scope.Error = error;
        });
    };
    $scope.GetDelegatedApprovalAlldata('Pending');

    $scope.UpdateStrategyApprover = function (model) {
        //model.UpdatedBy = $rootScope.UserInfo.user.userId;
        if (model.Status) {
            if (model.Status == "N" && model.Comments.trim() == "") {
                toaster.pop('warning', "warning", "Please enter comments", null);
                return;
            }
            TaskService.UpdateStrategyApprover(model).success(function (data) {
                if (data == "success") {
                    $scope.editMode = false;
                    toaster.pop('success', "Success", "Approval status updated successfully", null);
                    $timeout(function () {
                        $scope.GetAlldata();
                    })
                    $('#LayoutModel1').modal('hide');
                }
                else
                    $scope.errorinfo = data;

            }).error(function (data) {
                $scope.error = "An Error has occured while Adding user! " + data.ExceptionMessage;
            });
        }
        else {
            toaster.pop('warning', "warning", "Please select approval status", null);
        }

    };

    $scope.showconfirm = function (data) {
        $scope.Id = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.currency = {};
        $scope.ecurrency = {};
        $('#LayoutModel1').modal('hide');
    };

    $scope.dtOptionsDelegateRequestAppproval = DTOptionsBuilder.fromSource()
      .withPaginationType('full_numbers').withOption('createdRow', createdRow)
    .withOption('rowCallback', rowCallbackapprove);

    $scope.dtColumnsDelegateRequestAppproval = [
        DTColumnBuilder.newColumn('RefNumber').withTitle('Ref Number'),
        DTColumnBuilder.newColumn('Ver').withTitle('Version'),
        DTColumnBuilder.newColumn('OriginalApprover').withTitle('Delegated By'),
        DTColumnBuilder.newColumn('CreatedDate').withTitle('Created Date'),
        DTColumnBuilder.newColumn('RefNumber').withTitle('Actions').notSortable()
            .renderWith(actionsrequestHtml)
    ];
    function actionsrequestHtml(data, type, full, meta) {
        $scope.data = data;
        return ' <button  class="btn btn-success approvereq"> Accept</button>        <button  class="btn btn-danger rejectreq"> Reject</button>';
    }
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }

    function rowCallbackapprove(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        $('.approvereq', nRow).unbind('click');
        $('.approvereq', nRow).bind('click', function () {
            $scope.$apply(function () {
                $scope.updatedelegateAcceptance(aData, 'Y');
            });
        });
        $('.rejectreq', nRow).unbind('click');
        $('.rejectreq', nRow).bind('click', function () {
            $scope.$apply(function () {
                $scope.updatedelegateAcceptance(aData, 'N');
            });
        });
        return nRow;
    }

    $scope.updatedelegateAcceptance = function (model, status) {
        model.Status = status;
        TaskService.updatedelegateAcceptance(model).success(function (data) {
            if (data == "success") {
                $timeout(function () {
                    $scope.GetAlltransdata();
                })
            }
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding user! " + data.ExceptionMessage;
        });
    }
    $scope.GetAlltransdata = function () {
        ApiCall.MakeApiCall("GetStrategyDelegatesApprovalByuser", 'GET', '').success(function (data) {
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                console.log(data[i])
                data[i].Ver = "Version - " + data[i].Version;
                data[i].Version = data[i].Version;
            }
            $scope.dtOptionsDelegateRequestAppproval.data = data;
        }).error(function (error) {
            $scope.Error = error;
        });
    };
    $scope.GetAlltransdata();
}]);