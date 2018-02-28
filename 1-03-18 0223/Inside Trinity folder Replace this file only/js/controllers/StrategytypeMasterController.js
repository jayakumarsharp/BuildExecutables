ReportApp.controller('StrategytypeMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('Strategytype').withTitle('Strategy Type'),
        DTColumnBuilder.newColumn('Strategytypecode').withTitle('Code'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }

    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetStrategytypeMasterById(' + data + ')"><img src="images/edit.png"></a> ';
        //+'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }

    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }


    $scope.GetAllStrategytypeMaster = function () {
        ApiCall.MakeApiCall("GetAllStrategytype?StrategytypeId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (StrategytypeMaster) {
        if (StrategytypeMaster != null) {
            if (StrategytypeMaster.Strategytype && StrategytypeMaster.Strategytypecode) {
                ApiCall.MakeApiCall("AddStrategytype", 'POST', StrategytypeMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.StrategytypeMaster = null;
                        $scope.GetAllStrategytypeMaster();
                        $scope.editMode = false;
                        $scope.showAddwindow = false;
                        toaster.pop('success', "Success", 'Strategy Type added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding Strategy Type ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter Strategy Type and code', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter Strategy Type', null);
        }

    };

    $scope.GetStrategytypeMasterById = function (StrategytypeMasterId) {
        ApiCall.MakeApiCall("GetAllStrategytype?StrategytypeId=" + StrategytypeMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.StrategytypeMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding Strategytype! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteStrategytype?StrategytypeId=" + $scope.StrategytypeMasterId, 'GET', '').success(function (data) {
            $scope.StrategytypeMaster = null;
            $scope.editMode = false;
            $scope.GetAllStrategytypeMaster();
            $('#confirmModal').modal('hide');
            $scope.showAddwindow = false;
            toaster.pop('success', "Success", 'Strategy Type deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.UpdateStrategytypeMaster = function (model) {
        if (model != null) {
            if (model.Strategytype && model.Strategytypecode) {
                ApiCall.MakeApiCall("ModifyStrategytype", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.StrategytypeMaster = null;
                    $scope.GetAllStrategytypeMaster();
                    $scope.showAddwindow = false;
                    toaster.pop('success', "Success", 'Strategy Type updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding StrategytypeMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter Strategy Type and code', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter Strategy Type', null);
        }
    };



    $scope.showconfirm = function (data) {
        $scope.StrategytypeMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.StrategytypeMaster = null;
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
                        if (value.RightName == 'Strategytype Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllStrategytypeMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);