ReportApp.controller('BusinessLineMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('BusinessLine').withTitle('BusinessLine'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }



    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetBusinessLineMasterById(' + data + ')"><img src="images/edit.png"></a> ';
        //+'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }

    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }


    $scope.GetAllBusinessLineMaster = function () {
        ApiCall.MakeApiCall("GetAllBusinessLine?BusinessLineId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (BusinessLineMaster) {
        if (BusinessLineMaster != null) {
            if (BusinessLineMaster.BusinessLine.trim() != "") {
                ApiCall.MakeApiCall("AddBusinessLine", 'POST', BusinessLineMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.BusinessLineMaster = null;
                        $scope.GetAllBusinessLineMaster();
                        $scope.editMode = false;

                        $scope.showAddwindow = false;
                        toaster.pop('success', "Success", 'BusinessLine added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding BusinessLine ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter BusinessLine', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter BusinessLine', null);
        }

    };

    $scope.GetBusinessLineMasterById = function (BusinessLineMasterId) {
        ApiCall.MakeApiCall("GetAllBusinessLine?BusinessLineId=" + BusinessLineMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.BusinessLineMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding BusinessLine! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteBusinessLine?BusinessLineId=" + $scope.BusinessLineMasterId, 'GET', '').success(function (data) {
            $scope.BusinessLineMaster = null;
            $scope.editMode = false;
            $scope.GetAllBusinessLineMaster();
            $('#confirmModal').modal('hide');
            $scope.showAddwindow = false;
            toaster.pop('success', "Success", 'BusinessLine deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.UpdateBusinessLineMaster = function (model) {
        if (model != null) {
            if (model.BusinessLine.trim() != "") {
                ApiCall.MakeApiCall("ModifyBusinessLine", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.BusinessLineMaster = null;
                    $scope.GetAllBusinessLineMaster();
                    $scope.showAddwindow = false;
                    toaster.pop('success', "Success", 'BusinessLineMaster updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding BusinessLineMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter BusinessLine', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter BusinessLine', null);
        }
    };



    $scope.showconfirm = function (data) {
        $scope.BusinessLineMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.BusinessLineMaster = null;
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
                        if (value.RightName == 'BusinessLine Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllBusinessLineMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);