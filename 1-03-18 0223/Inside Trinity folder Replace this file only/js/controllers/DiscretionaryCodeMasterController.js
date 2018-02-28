ReportApp.controller('DiscretionaryCodeMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('DiscretionaryCode').withTitle('DiscretionaryCode'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }



    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetDiscretionaryCodeMasterById(' + data + ')"><img src="images/edit.png"></a> ';
        //+'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }

    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }


    $scope.GetAllDiscretionaryCodeMaster = function () {
        ApiCall.MakeApiCall("GetAllDiscretionaryCode?DiscretionaryCodeId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (DiscretionaryCodeMaster) {
        if (DiscretionaryCodeMaster != null) {
            if (DiscretionaryCodeMaster.DiscretionaryCode.trim() != "") {
                ApiCall.MakeApiCall("AddDiscretionaryCode", 'POST', DiscretionaryCodeMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.DiscretionaryCodeMaster = null;
                        $scope.GetAllDiscretionaryCodeMaster();
                        $scope.editMode = false;

                        $scope.showAddwindow = false;
                        toaster.pop('success', "Success", 'DiscretionaryCode added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding DiscretionaryCode ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter DiscretionaryCode', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter DiscretionaryCode', null);
        }

    };

    $scope.GetDiscretionaryCodeMasterById = function (DiscretionaryCodeMasterId) {
        ApiCall.MakeApiCall("GetAllDiscretionaryCode?DiscretionaryCodeId=" + DiscretionaryCodeMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.DiscretionaryCodeMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding DiscretionaryCode! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteDiscretionaryCode?DiscretionaryCodeId=" + $scope.DiscretionaryCodeMasterId, 'GET', '').success(function (data) {
            $scope.DiscretionaryCodeMaster = null;
            $scope.editMode = false;
            $scope.GetAllDiscretionaryCodeMaster();
            $('#confirmModal').modal('hide');
            $scope.showAddwindow = false;
            toaster.pop('success', "Success", 'DiscretionaryCode deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.UpdateDiscretionaryCodeMaster = function (model) {
        if (model != null) {
            if (model.DiscretionaryCode.trim() != "") {
                ApiCall.MakeApiCall("ModifyDiscretionaryCode", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.DiscretionaryCodeMaster = null;
                    $scope.GetAllDiscretionaryCodeMaster();
                    $scope.showAddwindow = false;
                    toaster.pop('success', "Success", 'DiscretionaryCodeMaster updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding DiscretionaryCodeMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter DiscretionaryCode', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter DiscretionaryCode', null);
        }
    };



    $scope.showconfirm = function (data) {
        $scope.DiscretionaryCodeMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.DiscretionaryCodeMaster = null;
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
                        if (value.RightName == 'DiscretionaryCode Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllDiscretionaryCodeMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);