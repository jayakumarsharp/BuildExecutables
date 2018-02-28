ReportApp.controller('LTAStrategyCodeMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('LTAStrategyCode').withTitle('LTA Strategy Code'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }



    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetLTAStrategyCodeMasterById(' + data + ')"><img src="images/edit.png"></a> ';
        //+'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }

    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }


    $scope.GetAllLTAStrategyCodeMaster = function () {
        ApiCall.MakeApiCall("GetAllLTAStrategyCode?LTAStrategyCodeId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (LTAStrategyCodeMaster) {
        if (LTAStrategyCodeMaster != null) {
            if (LTAStrategyCodeMaster.LTAStrategyCode.trim() != "") {
                ApiCall.MakeApiCall("AddLTAStrategyCode", 'POST', LTAStrategyCodeMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.LTAStrategyCodeMaster = null;
                        $scope.GetAllLTAStrategyCodeMaster();
                        $scope.editMode = false;

                        $scope.showAddwindow = false;
                        toaster.pop('success', "Success", 'LTA Strategy Code added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding LTA Strategy Code! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter LTA Strategy Code', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter LTA Strategy Code', null);
        }

    };

    $scope.GetLTAStrategyCodeMasterById = function (LTAStrategyCodeMasterId) {
        ApiCall.MakeApiCall("GetAllLTAStrategyCode?LTAStrategyCodeId=" + LTAStrategyCodeMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.LTAStrategyCodeMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding LTA Strategy Code! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteLTAStrategyCode?LTAStrategyCodeId=" + $scope.LTAStrategyCodeMasterId, 'GET', '').success(function (data) {
            $scope.LTAStrategyCodeMaster = null;
            $scope.editMode = false;
            $scope.GetAllLTAStrategyCodeMaster();
            $('#confirmModal').modal('hide');
            $scope.showAddwindow = false;
            toaster.pop('success', "Success", 'LTA Strategy Code deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.UpdateLTAStrategyCodeMaster = function (model) {
        if (model != null) {
            if (model.LTAStrategyCode.trim() != "") {
                ApiCall.MakeApiCall("ModifyLTAStrategyCode", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.LTAStrategyCodeMaster = null;
                    $scope.GetAllLTAStrategyCodeMaster();
                    $scope.showAddwindow = false;
                    toaster.pop('success', "Success", 'LTA Strategy Code updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding LTAStrategyCodeMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter LTA Strategy Code', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter LTA Strategy Code', null);
        }
    };



    $scope.showconfirm = function (data) {
        $scope.LTAStrategyCodeMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.LTAStrategyCodeMaster = null;
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
                        if (value.RightName == 'LTAStrategyCode Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllLTAStrategyCodeMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);