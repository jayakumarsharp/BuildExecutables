ReportApp.controller('CapacityMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('Capacity').withTitle('Capacity'),
        DTColumnBuilder.newColumn('Capacitycode').withTitle('Code'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }

    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetCapacityMasterById(' + data + ')"><img src="images/edit.png"></a> ';
        //+'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }

    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }


    $scope.GetAllCapacityMaster = function () {
        ApiCall.MakeApiCall("GetAllCapacity?CapacityId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (CapacityMaster) {
        if (CapacityMaster != null) {
            if (CapacityMaster.Capacity.trim() != "") {
                ApiCall.MakeApiCall("AddCapacity", 'POST', CapacityMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.CapacityMaster = null;
                        $scope.GetAllCapacityMaster();
                        $scope.editMode = false;

                        $scope.showAddwindow = false;
                        toaster.pop('success', "Success", 'Capacity added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding Capacity ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter Capacity and code', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter Capacity and code', null);
        }

    };

    $scope.GetCapacityMasterById = function (CapacityMasterId) {
        ApiCall.MakeApiCall("GetAllCapacity?CapacityId=" + CapacityMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.CapacityMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding Capacity! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteCapacity?CapacityId=" + $scope.CapacityMasterId, 'GET', '').success(function (data) {
            $scope.CapacityMaster = null;
            $scope.editMode = false;
            $scope.GetAllCapacityMaster();
            $('#confirmModal').modal('hide');
            $scope.showAddwindow = false;
            toaster.pop('success', "Success", 'Capacity deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.UpdateCapacityMaster = function (model) {
        if (model != null) {
            if (model.Capacity && model.Capacitycode) {
                ApiCall.MakeApiCall("ModifyCapacity", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.CapacityMaster = null;
                    $scope.GetAllCapacityMaster();
                    $scope.showAddwindow = false;
                    toaster.pop('success', "Success", 'CapacityMaster updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding CapacityMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter Capacity and code', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter Capacity and code', null);
        }
    };



    $scope.showconfirm = function (data) {
        $scope.CapacityMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.CapacityMaster = null;
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
                        if (value.RightName == 'Capacity Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllCapacityMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);