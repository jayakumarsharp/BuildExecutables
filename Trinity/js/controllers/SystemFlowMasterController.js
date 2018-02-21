ReportApp.controller('SystemFlowMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('SystemFlowName').withTitle('SystemFlow'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }



    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetSystemFlowMasterById(' + data + ')"><img src="images/edit.png"></a> ';
        //+'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }

    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }


    $scope.GetAllSystemFlowMaster = function () {
        ApiCall.MakeApiCall("GetAllSystemFlow?SystemFlowId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (SystemFlowMaster) {
        if (SystemFlowMaster != null) {
            if (SystemFlowMaster.SystemFlowName.trim() != "") {
                ApiCall.MakeApiCall("AddSystemFlow", 'POST', SystemFlowMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.SystemFlowMaster = null;
                        $scope.GetAllSystemFlowMaster();
                        $scope.editMode = false;

                        $scope.showAddwindow = false;
                        toaster.pop('success', "Success", 'SystemFlow added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding SystemFlow ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter SystemFlow', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter SystemFlow', null);
        }

    };

    $scope.GetSystemFlowMasterById = function (SystemFlowMasterId) {
        ApiCall.MakeApiCall("GetAllSystemFlow?SystemFlowId=" + SystemFlowMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.SystemFlowMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding SystemFlow! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteSystemFlow?SystemFlowId=" + $scope.SystemFlowMasterId, 'GET', '').success(function (data) {
            $scope.SystemFlowMaster = null;
            $scope.editMode = false;
            $scope.GetAllSystemFlowMaster();
            $('#confirmModal').modal('hide');
            $scope.showAddwindow = false;
            toaster.pop('success', "Success", 'SystemFlow deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.UpdateSystemFlowMaster = function (model) {
        if (model != null) {
            if (model.SystemFlowName.trim() != "") {
                ApiCall.MakeApiCall("ModifySystemFlow", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.SystemFlowMaster = null;
                    $scope.GetAllSystemFlowMaster();
                    $scope.showAddwindow = false;
                    toaster.pop('success', "Success", 'SystemFlowMaster updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding SystemFlowMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter SystemFlow', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter SystemFlow', null);
        }
    };



    $scope.showconfirm = function (data) {
        $scope.SystemFlowMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.SystemFlowMaster = null;
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
                        if (value.RightName == 'SystemFlow Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllSystemFlowMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);