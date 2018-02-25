ReportApp.controller('LTAStrategyMappingController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.editMode = false;
    $scope.IsReadOnly = false;

    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('LTAStrategyName').withTitle('LTA Strategy Name'),
        DTColumnBuilder.newColumn('LTAStrategyCode').withTitle('LTA Strategy Code'),
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


    $scope.GetAllLTAStrategyMaster = function () {
        ApiCall.MakeApiCall("GetAllLTAStrategyMapping?LTAStrategyId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data

        }).error(function (error) {
            $scope.Error = error;
        })
        ApiCall.MakeApiCall("GetAllLTAStrategyName?LTAStrategyNameId=", 'GET', '').success(function (data) {
            $scope.LTAStrategyNameList = data;
        }).error(function (error) {
            $scope.Error = error;
        });
        ApiCall.MakeApiCall("GetAllLTAStrategyCode?LTAStrategyCodeId=", 'GET', '').success(function (data) {
            $scope.LTAStrategyCodeList = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (LTAStrategyMaster) {
        if (LTAStrategyMaster != null) {
            if (LTAStrategyMaster.LTAStrategyCode.LTAStrategyCode && LTAStrategyMaster.LTAStrategyName.LTAStrategyName) {
                var input = { LTAStrategyCodeId: LTAStrategyMaster.LTAStrategyCode.Id, LTAStrategyNameId: LTAStrategyMaster.LTAStrategyName.Id };

                ApiCall.MakeApiCall("AddLTAStrategyMapping", 'POST', input).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        if (data == "success") {
                            $scope.LTAStrategyMaster = null;
                            $scope.GetAllLTAStrategyMaster();
                            $scope.editMode = false;

                            $scope.showAddwindow = false;
                            toaster.pop('success', "Success", 'LTA Strategy added successfully', null);
                        }
                        else
                            toaster.pop('warning', "Warning", data, null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding LTAStrategy ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter LTAStrategy', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter LTAStrategy', null);
        }

    };

    $scope.GetLTAStrategyMasterById = function (LTAStrategyMasterId) {
        ApiCall.MakeApiCall("GetAllLTAStrategy?LTAStrategyId=" + LTAStrategyMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.LTAStrategyMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding LTAStrategy! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function (id) {
        ApiCall.MakeApiCall("DeleteLTAStrategyMapping?Id=" + id, 'GET', '').success(function (data) {
            if (data == "success") {
                $scope.LTAStrategyMaster = null;
                $scope.editMode = false;
                $scope.GetAllLTAStrategyMaster();
                $('#confirmModal').modal('hide');
                $scope.showAddwindow = false;
                toaster.pop('success', "Success", 'LTA Strategy deleted successfully', null);
            }
            else
                toaster.pop('warning', "Warning", data, null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    //$scope.UpdateLTAStrategyMaster = function (model) {
    //    if (model != null) {
    //        if (model.LTAStrategy.trim() != "") {
    //            ApiCall.MakeApiCall("ModifyLTAStrategy", 'POST', model).success(function (data) {
    //                $scope.editMode = false;
    //                $scope.LTAStrategyMaster = null;
    //                $scope.GetAllLTAStrategyMaster();
    //                $scope.showAddwindow = false;
    //                toaster.pop('success', "Success", 'LTAStrategyMaster updated successfully', null);
    //            }).error(function (data) {
    //                $scope.error = "An Error has occured while Adding LTAStrategyMaster! " + data.ExceptionMessage;
    //            });
    //        }
    //        else {
    //            toaster.pop('warning', "Warning", 'Please enter LTAStrategy', null);
    //        }
    //    }
    //    else {
    //        toaster.pop('warning', "Warning", 'Please enter LTAStrategy', null);
    //    }
    //};



    $scope.showconfirm = function (data) {
        $scope.LTAStrategyMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.LTAStrategyMaster = null;
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
                        if (value.RightName == 'LTAStrategy Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllLTAStrategyMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);