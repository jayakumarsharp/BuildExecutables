ReportApp.controller('FTAStrategyOwnerMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('FTAStrategyOwner').withTitle('FTAStrategyOwner'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }



    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetFTAStrategyOwnerMasterById(' + data + ')"><img src="images/edit.png"></a> ';
        //+'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }

    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }


    $scope.GetAllFTAStrategyOwnerMaster = function () {
        ApiCall.MakeApiCall("GetAllFTAStrategyOwner?FTAStrategyOwnerId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (FTAStrategyOwnerMaster) {
        if (FTAStrategyOwnerMaster != null) {
            if (FTAStrategyOwnerMaster.FTAStrategyOwner.trim() != "") {
                ApiCall.MakeApiCall("AddFTAStrategyOwner", 'POST', FTAStrategyOwnerMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.FTAStrategyOwnerMaster = null;
                        $scope.GetAllFTAStrategyOwnerMaster();
                        $scope.editMode = false;

                        $scope.showAddwindow = false;
                        toaster.pop('success', "Success", 'FTAStrategyOwner added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding FTAStrategyOwner ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter FTAStrategyOwner', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter FTAStrategyOwner', null);
        }

    };

    $scope.GetFTAStrategyOwnerMasterById = function (FTAStrategyOwnerMasterId) {
        ApiCall.MakeApiCall("GetAllFTAStrategyOwner?FTAStrategyOwnerId=" + FTAStrategyOwnerMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.FTAStrategyOwnerMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding FTAStrategyOwner! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteFTAStrategyOwner?FTAStrategyOwnerId=" + $scope.FTAStrategyOwnerMasterId, 'GET', '').success(function (data) {
            $scope.FTAStrategyOwnerMaster = null;
            $scope.editMode = false;
            $scope.GetAllFTAStrategyOwnerMaster();
            $('#confirmModal').modal('hide');
            $scope.showAddwindow = false;
            toaster.pop('success', "Success", 'FTAStrategyOwner deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.UpdateFTAStrategyOwnerMaster = function (model) {
        if (model != null) {
            if (model.FTAStrategyOwner.trim() != "") {
                ApiCall.MakeApiCall("ModifyFTAStrategyOwner", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.FTAStrategyOwnerMaster = null;
                    $scope.GetAllFTAStrategyOwnerMaster();
                    $scope.showAddwindow = false;
                    toaster.pop('success', "Success", 'FTAStrategyOwnerMaster updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding FTAStrategyOwnerMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter FTAStrategyOwner', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter FTAStrategyOwner', null);
        }
    };



    $scope.showconfirm = function (data) {
        $scope.FTAStrategyOwnerMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.FTAStrategyOwnerMaster = null;
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
                        if (value.RightName == 'FTAStrategyOwner Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllFTAStrategyOwnerMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);