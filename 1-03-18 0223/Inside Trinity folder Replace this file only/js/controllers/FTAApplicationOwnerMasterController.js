ReportApp.controller('LTAApplicationOwnerMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('LTAApplicationOwner').withTitle('LTA Application Owner'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }



    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetLTAApplicationOwnerMasterById(' + data + ')"><img src="images/edit.png"></a> ';
        //+'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }

    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }


    $scope.GetAllLTAApplicationOwnerMaster = function () {
        ApiCall.MakeApiCall("GetAllLTAApplicationOwner?LTAApplicationOwnerId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (LTAApplicationOwnerMaster) {
        if (LTAApplicationOwnerMaster != null) {
            if (LTAApplicationOwnerMaster.LTAApplicationOwner.trim() != "") {
                ApiCall.MakeApiCall("AddLTAApplicationOwner", 'POST', LTAApplicationOwnerMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.LTAApplicationOwnerMaster = null;
                        $scope.GetAllLTAApplicationOwnerMaster();
                        $scope.editMode = false;

                        $scope.showAddwindow = false;
                        toaster.pop('success', "Success", 'LTA Application Owner added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding LTA Application Owner ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter LTA Application Owner', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter LTA Application Owner', null);
        }

    };

    $scope.GetLTAApplicationOwnerMasterById = function (LTAApplicationOwnerMasterId) {
        ApiCall.MakeApiCall("GetAllLTAApplicationOwner?LTAApplicationOwnerId=" + LTAApplicationOwnerMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.LTAApplicationOwnerMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding LTA Application Owner! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteLTAApplicationOwner?LTAApplicationOwnerId=" + $scope.LTAApplicationOwnerMasterId, 'GET', '').success(function (data) {
            $scope.LTAApplicationOwnerMaster = null;
            $scope.editMode = false;
            $scope.GetAllLTAApplicationOwnerMaster();
            $('#confirmModal').modal('hide');
            $scope.showAddwindow = false;
            toaster.pop('success', "Success", 'LTA Application Owner deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.UpdateLTAApplicationOwnerMaster = function (model) {
        if (model != null) {
            if (model.LTAApplicationOwner.trim() != "") {
                ApiCall.MakeApiCall("ModifyLTAApplicationOwner", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.LTAApplicationOwnerMaster = null;
                    $scope.GetAllLTAApplicationOwnerMaster();
                    $scope.showAddwindow = false;
                    toaster.pop('success', "Success", 'LTA Application Owner updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding LTAApplicationOwnerMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter LTA Application Owner', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter LTA Application Owner', null);
        }
    };



    $scope.showconfirm = function (data) {
        $scope.LTAApplicationOwnerMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.LTAApplicationOwnerMaster = null;
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
                        if (value.RightName == 'LTAApplicationOwner Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllLTAApplicationOwnerMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);