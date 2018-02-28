ReportApp.controller('LTAStrategyNameMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('LTAStrategyName').withTitle('LTA Strategy Name'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }



    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetLTAStrategyNameMasterById(' + data + ')"><img src="images/edit.png"></a> ';
        //+'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }

    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }


    $scope.GetAllLTAStrategyNameMaster = function () {
        ApiCall.MakeApiCall("GetAllLTAStrategyName?LTAStrategyNameId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (LTAStrategyNameMaster) {
        if (LTAStrategyNameMaster != null) {
            if (LTAStrategyNameMaster.LTAStrategyName.trim() != "") {
                ApiCall.MakeApiCall("AddLTAStrategyName", 'POST', LTAStrategyNameMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.LTAStrategyNameMaster = null;
                        $scope.GetAllLTAStrategyNameMaster();
                        $scope.editMode = false;

                        $scope.showAddwindow = false;
                        toaster.pop('success', "Success", 'LTA Strategy Name added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding LTA Strategy Name ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter LTA Strategy Name ', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter LTA Strategy Name ', null);
        }

    };

    $scope.GetLTAStrategyNameMasterById = function (LTAStrategyNameMasterId) {
        ApiCall.MakeApiCall("GetAllLTAStrategyName?LTAStrategyNameId=" + LTAStrategyNameMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.LTAStrategyNameMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding LTA Strategy Name ! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteLTAStrategyName?LTAStrategyNameId=" + $scope.LTAStrategyNameMasterId, 'GET', '').success(function (data) {
            $scope.LTAStrategyNameMaster = null;
            $scope.editMode = false;
            $scope.GetAllLTAStrategyNameMaster();
            $('#confirmModal').modal('hide');
            $scope.showAddwindow = false;
            toaster.pop('success', "Success", 'LTA Strategy Name  deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.UpdateLTAStrategyNameMaster = function (model) {
        if (model != null) {
            if (model.LTAStrategyName.trim() != "") {
                ApiCall.MakeApiCall("ModifyLTAStrategyName", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.LTAStrategyNameMaster = null;
                    $scope.GetAllLTAStrategyNameMaster();
                    $scope.showAddwindow = false;
                    toaster.pop('success', "Success", 'LTA Strategy Name updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding LTAStrategyNameMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter LTAStrategyName', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter LTAStrategyName', null);
        }
    };



    $scope.showconfirm = function (data) {
        $scope.LTAStrategyNameMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.LTAStrategyNameMaster = null;
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
                        if (value.RightName == 'LTAStrategyName Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllLTAStrategyNameMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);