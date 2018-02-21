ReportApp.controller('FTAStrategyMappingController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.editMode = false;
    $scope.IsReadOnly = false;

    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('FTAStrategyName').withTitle('FTAStrategy Name'),
        DTColumnBuilder.newColumn('FTAStrategyCode').withTitle('FTAStrategy Code'),
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


    $scope.GetAllFTAStrategyMaster = function () {
        ApiCall.MakeApiCall("GetAllFTAStrategyMapping?FTAStrategyId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data

        }).error(function (error) {
            $scope.Error = error;
        })
        ApiCall.MakeApiCall("GetAllFTAStrategyName?FTAStrategyNameId=", 'GET', '').success(function (data) {
            $scope.FTAStrategyNameList = data;
        }).error(function (error) {
            $scope.Error = error;
        });
        ApiCall.MakeApiCall("GetAllFTAStrategyCode?FTAStrategyCodeId=", 'GET', '').success(function (data) {
            $scope.FTAStrategyCodeList = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (FTAStrategyMaster) {
        if (FTAStrategyMaster != null) {
            if (FTAStrategyMaster.FTAStrategyCode.FTAStrategyCode && FTAStrategyMaster.FTAStrategyName.FTAStrategyName) {
                var input = { FTAStrategyCodeId: FTAStrategyMaster.FTAStrategyCode.Id, FTAStrategyNameId: FTAStrategyMaster.FTAStrategyName.Id };

                ApiCall.MakeApiCall("AddFTAStrategyMapping", 'POST', input).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        if (data == "success") {
                            $scope.FTAStrategyMaster = null;
                            $scope.GetAllFTAStrategyMaster();
                            $scope.editMode = false;

                            $scope.showAddwindow = false;
                            toaster.pop('success', "Success", 'FTAStrategy added successfully', null);
                        }
                        else
                            toaster.pop('warning', "Warning", data, null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding FTAStrategy ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter FTAStrategy', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter FTAStrategy', null);
        }

    };

    $scope.GetFTAStrategyMasterById = function (FTAStrategyMasterId) {
        ApiCall.MakeApiCall("GetAllFTAStrategy?FTAStrategyId=" + FTAStrategyMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.FTAStrategyMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding FTAStrategy! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function (id) {
        ApiCall.MakeApiCall("DeleteFTAStrategyMapping?Id=" + id, 'GET', '').success(function (data) {
            if (data == "success") {
                $scope.FTAStrategyMaster = null;
                $scope.editMode = false;
                $scope.GetAllFTAStrategyMaster();
                $('#confirmModal').modal('hide');
                $scope.showAddwindow = false;
                toaster.pop('success', "Success", 'FTAStrategy deleted successfully', null);
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

    //$scope.UpdateFTAStrategyMaster = function (model) {
    //    if (model != null) {
    //        if (model.FTAStrategy.trim() != "") {
    //            ApiCall.MakeApiCall("ModifyFTAStrategy", 'POST', model).success(function (data) {
    //                $scope.editMode = false;
    //                $scope.FTAStrategyMaster = null;
    //                $scope.GetAllFTAStrategyMaster();
    //                $scope.showAddwindow = false;
    //                toaster.pop('success', "Success", 'FTAStrategyMaster updated successfully', null);
    //            }).error(function (data) {
    //                $scope.error = "An Error has occured while Adding FTAStrategyMaster! " + data.ExceptionMessage;
    //            });
    //        }
    //        else {
    //            toaster.pop('warning', "Warning", 'Please enter FTAStrategy', null);
    //        }
    //    }
    //    else {
    //        toaster.pop('warning', "Warning", 'Please enter FTAStrategy', null);
    //    }
    //};



    $scope.showconfirm = function (data) {
        $scope.FTAStrategyMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.FTAStrategyMaster = null;
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
                        if (value.RightName == 'FTAStrategy Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllFTAStrategyMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);