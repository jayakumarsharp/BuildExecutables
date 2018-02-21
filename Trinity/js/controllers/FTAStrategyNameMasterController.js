ReportApp.controller('FTAStrategyNameMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('FTAStrategyName').withTitle('FTAStrategyName'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }



    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetFTAStrategyNameMasterById(' + data + ')"><img src="images/edit.png"></a> ';
        //+'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }

    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }


    $scope.GetAllFTAStrategyNameMaster = function () {
        ApiCall.MakeApiCall("GetAllFTAStrategyName?FTAStrategyNameId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (FTAStrategyNameMaster) {
        if (FTAStrategyNameMaster != null) {
            if (FTAStrategyNameMaster.FTAStrategyName.trim() != "") {
                ApiCall.MakeApiCall("AddFTAStrategyName", 'POST', FTAStrategyNameMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.FTAStrategyNameMaster = null;
                        $scope.GetAllFTAStrategyNameMaster();
                        $scope.editMode = false;

                        $scope.showAddwindow = false;
                        toaster.pop('success', "Success", 'FTAStrategyName added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding FTAStrategyName ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter FTAStrategyName', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter FTAStrategyName', null);
        }

    };

    $scope.GetFTAStrategyNameMasterById = function (FTAStrategyNameMasterId) {
        ApiCall.MakeApiCall("GetAllFTAStrategyName?FTAStrategyNameId=" + FTAStrategyNameMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.FTAStrategyNameMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding FTAStrategyName! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteFTAStrategyName?FTAStrategyNameId=" + $scope.FTAStrategyNameMasterId, 'GET', '').success(function (data) {
            $scope.FTAStrategyNameMaster = null;
            $scope.editMode = false;
            $scope.GetAllFTAStrategyNameMaster();
            $('#confirmModal').modal('hide');
            $scope.showAddwindow = false;
            toaster.pop('success', "Success", 'FTAStrategyName deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.UpdateFTAStrategyNameMaster = function (model) {
        if (model != null) {
            if (model.FTAStrategyName.trim() != "") {
                ApiCall.MakeApiCall("ModifyFTAStrategyName", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.FTAStrategyNameMaster = null;
                    $scope.GetAllFTAStrategyNameMaster();
                    $scope.showAddwindow = false;
                    toaster.pop('success', "Success", 'FTAStrategyNameMaster updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding FTAStrategyNameMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter FTAStrategyName', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter FTAStrategyName', null);
        }
    };



    $scope.showconfirm = function (data) {
        $scope.FTAStrategyNameMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.FTAStrategyNameMaster = null;
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
                        if (value.RightName == 'FTAStrategyName Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllFTAStrategyNameMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);