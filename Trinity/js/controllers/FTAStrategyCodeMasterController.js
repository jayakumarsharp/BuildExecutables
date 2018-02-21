ReportApp.controller('FTAStrategyCodeMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('FTAStrategyCode').withTitle('FTAStrategyCode'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }



    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetFTAStrategyCodeMasterById(' + data + ')"><img src="images/edit.png"></a> ';
        //+'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }

    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }


    $scope.GetAllFTAStrategyCodeMaster = function () {
        ApiCall.MakeApiCall("GetAllFTAStrategyCode?FTAStrategyCodeId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (FTAStrategyCodeMaster) {
        if (FTAStrategyCodeMaster != null) {
            if (FTAStrategyCodeMaster.FTAStrategyCode.trim() != "") {
                ApiCall.MakeApiCall("AddFTAStrategyCode", 'POST', FTAStrategyCodeMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.FTAStrategyCodeMaster = null;
                        $scope.GetAllFTAStrategyCodeMaster();
                        $scope.editMode = false;

                        $scope.showAddwindow = false;
                        toaster.pop('success', "Success", 'FTAStrategyCode added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding FTAStrategyCode ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter FTAStrategyCode', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter FTAStrategyCode', null);
        }

    };

    $scope.GetFTAStrategyCodeMasterById = function (FTAStrategyCodeMasterId) {
        ApiCall.MakeApiCall("GetAllFTAStrategyCode?FTAStrategyCodeId=" + FTAStrategyCodeMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.FTAStrategyCodeMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding FTAStrategyCode! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteFTAStrategyCode?FTAStrategyCodeId=" + $scope.FTAStrategyCodeMasterId, 'GET', '').success(function (data) {
            $scope.FTAStrategyCodeMaster = null;
            $scope.editMode = false;
            $scope.GetAllFTAStrategyCodeMaster();
            $('#confirmModal').modal('hide');
            $scope.showAddwindow = false;
            toaster.pop('success', "Success", 'FTAStrategyCode deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.UpdateFTAStrategyCodeMaster = function (model) {
        if (model != null) {
            if (model.FTAStrategyCode.trim() != "") {
                ApiCall.MakeApiCall("ModifyFTAStrategyCode", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.FTAStrategyCodeMaster = null;
                    $scope.GetAllFTAStrategyCodeMaster();
                    $scope.showAddwindow = false;
                    toaster.pop('success', "Success", 'FTAStrategyCodeMaster updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding FTAStrategyCodeMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter FTAStrategyCode', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter FTAStrategyCode', null);
        }
    };



    $scope.showconfirm = function (data) {
        $scope.FTAStrategyCodeMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.FTAStrategyCodeMaster = null;
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
                        if (value.RightName == 'FTAStrategyCode Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllFTAStrategyCodeMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);