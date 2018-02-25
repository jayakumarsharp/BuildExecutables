ReportApp.controller('LTAStrategyOwnerMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('LTAStrategyOwner').withTitle('LTA Strategy Owner'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }



    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetLTAStrategyOwnerMasterById(' + data + ')"><img src="images/edit.png"></a> ';
        //+'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }

    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }


    $scope.GetAllLTAStrategyOwnerMaster = function () {
        ApiCall.MakeApiCall("GetAllLTAStrategyOwner?LTAStrategyOwnerId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (LTAStrategyOwnerMaster) {
        if (LTAStrategyOwnerMaster != null) {
            if (LTAStrategyOwnerMaster.LTAStrategyOwner.trim() != "") {
                ApiCall.MakeApiCall("AddLTAStrategyOwner", 'POST', LTAStrategyOwnerMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.LTAStrategyOwnerMaster = null;
                        $scope.GetAllLTAStrategyOwnerMaster();
                        $scope.editMode = false;

                        $scope.showAddwindow = false;
                        toaster.pop('success', "Success", 'LTA Strategy Owner added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding LTA Strategy Owner ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter LTA Strategy Owner', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter LTA Strategy Owner', null);
        }

    };

    $scope.GetLTAStrategyOwnerMasterById = function (LTAStrategyOwnerMasterId) {
        ApiCall.MakeApiCall("GetAllLTAStrategyOwner?LTAStrategyOwnerId=" + LTAStrategyOwnerMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.LTAStrategyOwnerMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding LTA Strategy Owner! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteLTAStrategyOwner?LTAStrategyOwnerId=" + $scope.LTAStrategyOwnerMasterId, 'GET', '').success(function (data) {
            $scope.LTAStrategyOwnerMaster = null;
            $scope.editMode = false;
            $scope.GetAllLTAStrategyOwnerMaster();
            $('#confirmModal').modal('hide');
            $scope.showAddwindow = false;
            toaster.pop('success', "Success", 'LTA Strategy Owner deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.UpdateLTAStrategyOwnerMaster = function (model) {
        if (model != null) {
            if (model.LTAStrategyOwner.trim() != "") {
                ApiCall.MakeApiCall("ModifyLTAStrategyOwner", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.LTAStrategyOwnerMaster = null;
                    $scope.GetAllLTAStrategyOwnerMaster();
                    $scope.showAddwindow = false;
                    toaster.pop('success', "Success", 'LTA Strategy Owner updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding LTAStrategyOwnerMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter LTAStrategyOwner', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter LTAStrategyOwner', null);
        }
    };



    $scope.showconfirm = function (data) {
        $scope.LTAStrategyOwnerMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.LTAStrategyOwnerMaster = null;
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
                        if (value.RightName == 'LTAStrategyOwner Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllLTAStrategyOwnerMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);