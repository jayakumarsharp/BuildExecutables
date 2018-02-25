ReportApp.controller('ParentIDMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('ParentID').withTitle('Parent ID'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }



    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetParentIDMasterById(' + data + ')"><img src="images/edit.png"></a> ';
        //+'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }

    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }


    $scope.GetAllParentIDMaster = function () {
        ApiCall.MakeApiCall("GetAllParentID?ParentIDId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (ParentIDMaster) {
        if (ParentIDMaster != null) {
            if (ParentIDMaster.ParentID.trim() != "") {
                ApiCall.MakeApiCall("AddParentID", 'POST', ParentIDMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.ParentIDMaster = null;
                        $scope.GetAllParentIDMaster();
                        $scope.editMode = false;

                        $scope.showAddwindow = false;
                        toaster.pop('success', "Success", 'ParentID added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding ParentID ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter ParentID', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter ParentID', null);
        }

    };

    $scope.GetParentIDMasterById = function (ParentIDMasterId) {
        ApiCall.MakeApiCall("GetAllParentID?ParentIDId=" + ParentIDMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.ParentIDMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding ParentID! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteParentID?ParentIDId=" + $scope.ParentIDMasterId, 'GET', '').success(function (data) {
            $scope.ParentIDMaster = null;
            $scope.editMode = false;
            $scope.GetAllParentIDMaster();
            $('#confirmModal').modal('hide');
            $scope.showAddwindow = false;
            toaster.pop('success', "Success", 'ParentID deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.UpdateParentIDMaster = function (model) {
        if (model != null) {
            if (model.ParentID.trim() != "") {
                ApiCall.MakeApiCall("ModifyParentID", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.ParentIDMaster = null;
                    $scope.GetAllParentIDMaster();
                    $scope.showAddwindow = false;
                    toaster.pop('success', "Success", 'ParentIDMaster updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding ParentIDMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter ParentID', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter ParentID', null);
        }
    };



    $scope.showconfirm = function (data) {
        $scope.ParentIDMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.ParentIDMaster = null;
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
                        if (value.RightName == 'ParentID Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllParentIDMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);