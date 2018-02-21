ReportApp.controller('FTAApplicationOwnerMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('FTAApplicationOwner').withTitle('FTAApplicationOwner'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }



    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetFTAApplicationOwnerMasterById(' + data + ')"><img src="images/edit.png"></a> ';
        //+'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }

    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }


    $scope.GetAllFTAApplicationOwnerMaster = function () {
        ApiCall.MakeApiCall("GetAllFTAApplicationOwner?FTAApplicationOwnerId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (FTAApplicationOwnerMaster) {
        if (FTAApplicationOwnerMaster != null) {
            if (FTAApplicationOwnerMaster.FTAApplicationOwner.trim() != "") {
                ApiCall.MakeApiCall("AddFTAApplicationOwner", 'POST', FTAApplicationOwnerMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.FTAApplicationOwnerMaster = null;
                        $scope.GetAllFTAApplicationOwnerMaster();
                        $scope.editMode = false;

                        $scope.showAddwindow = false;
                        toaster.pop('success', "Success", 'FTAApplicationOwner added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding FTAApplicationOwner ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter FTAApplicationOwner', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter FTAApplicationOwner', null);
        }

    };

    $scope.GetFTAApplicationOwnerMasterById = function (FTAApplicationOwnerMasterId) {
        ApiCall.MakeApiCall("GetAllFTAApplicationOwner?FTAApplicationOwnerId=" + FTAApplicationOwnerMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.FTAApplicationOwnerMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding FTAApplicationOwner! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteFTAApplicationOwner?FTAApplicationOwnerId=" + $scope.FTAApplicationOwnerMasterId, 'GET', '').success(function (data) {
            $scope.FTAApplicationOwnerMaster = null;
            $scope.editMode = false;
            $scope.GetAllFTAApplicationOwnerMaster();
            $('#confirmModal').modal('hide');
            $scope.showAddwindow = false;
            toaster.pop('success', "Success", 'FTAApplicationOwner deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.UpdateFTAApplicationOwnerMaster = function (model) {
        if (model != null) {
            if (model.FTAApplicationOwner.trim() != "") {
                ApiCall.MakeApiCall("ModifyFTAApplicationOwner", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.FTAApplicationOwnerMaster = null;
                    $scope.GetAllFTAApplicationOwnerMaster();
                    $scope.showAddwindow = false;
                    toaster.pop('success', "Success", 'FTAApplicationOwnerMaster updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding FTAApplicationOwnerMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter FTAApplicationOwner', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter FTAApplicationOwner', null);
        }
    };



    $scope.showconfirm = function (data) {
        $scope.FTAApplicationOwnerMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.FTAApplicationOwnerMaster = null;
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
                        if (value.RightName == 'FTAApplicationOwner Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllFTAApplicationOwnerMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);