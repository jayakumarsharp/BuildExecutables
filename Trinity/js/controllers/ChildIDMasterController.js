ReportApp.controller('ChildIDMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('ChildID').withTitle('Child ID'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
        .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetChildIDMasterById(' + data + ')"><img src="images/edit.png"></a> ';
        //+'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }

    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }
    $scope.GetAllChildIDMaster = function () {
        ApiCall.MakeApiCall("GetAllChildID?ChildIDId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (ChildIDMaster) {
        if (ChildIDMaster != null) {
            if (ChildIDMaster.ChildID.trim() != "") {
                ApiCall.MakeApiCall("AddChildID", 'POST', ChildIDMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.ChildIDMaster = null;
                        $scope.GetAllChildIDMaster();
                        $scope.editMode = false;

                        $scope.showAddwindow = false;
                        toaster.pop('success', "Success", 'Child ID added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding Child ID ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter Child ID', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter Child ID', null);
        }

    };

    $scope.GetChildIDMasterById = function (ChildIDMasterId) {
        ApiCall.MakeApiCall("GetAllChildID?ChildIDId=" + ChildIDMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.ChildIDMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding Child ID! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteChildID?ChildIDId=" + $scope.ChildIDMasterId, 'GET', '').success(function (data) {
            $scope.ChildIDMaster = null;
            $scope.editMode = false;
            $scope.GetAllChildIDMaster();
            $('#confirmModal').modal('hide');
            $scope.showAddwindow = false;
            toaster.pop('success', "Success", 'Child ID deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.UpdateChildIDMaster = function (model) {
        if (model != null) {
            if (model.ChildID.trim() != "") {
                ApiCall.MakeApiCall("ModifyChildID", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.ChildIDMaster = null;
                    $scope.GetAllChildIDMaster();
                    $scope.showAddwindow = false;
                    toaster.pop('success', "Success", 'Child ID updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding Child ID ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter Child ID', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter Child ID', null);
        }
    };



    $scope.showconfirm = function (data) {
        $scope.ChildIDMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.ChildIDMaster = null;
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
                        if (value.RightName == 'ChildID Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllChildIDMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);