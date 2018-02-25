ReportApp.controller('VenuetypeMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('Venuetype').withTitle('Venue Type'),
        DTColumnBuilder.newColumn('Venuetypecode').withTitle('Code'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetVenuetypeMasterById(' + data + ')"><img src="images/edit.png"></a> ';
        //+'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }

    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }


    $scope.GetAllVenuetypeMaster = function () {
        ApiCall.MakeApiCall("GetAllVenuetype?VenuetypeId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (VenuetypeMaster) {
        if (VenuetypeMaster != null) {
            if (VenuetypeMaster.Venuetype && VenuetypeMaster.Venuetypecode) {
                ApiCall.MakeApiCall("AddVenuetype", 'POST', VenuetypeMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.VenuetypeMaster = null;
                        $scope.GetAllVenuetypeMaster();
                        $scope.editMode = false;

                        $scope.showAddwindow = false;
                        toaster.pop('success', "Success", 'Venue Type added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding Venue Type ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter Venue Type and code', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter Venue Type and code', null);
        }

    };

    $scope.GetVenuetypeMasterById = function (VenuetypeMasterId) {
        ApiCall.MakeApiCall("GetAllVenuetype?VenuetypeId=" + VenuetypeMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.VenuetypeMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding Venue Type! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteVenuetype?VenuetypeId=" + $scope.VenuetypeMasterId, 'GET', '').success(function (data) {
            $scope.VenuetypeMaster = null;
            $scope.editMode = false;
            $scope.GetAllVenuetypeMaster();
            $('#confirmModal').modal('hide');
            $scope.showAddwindow = false;
            toaster.pop('success', "Success", 'Venue Type deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.UpdateVenuetypeMaster = function (model) {
        if (model != null) {
            if (model.Venuetype && model.Venuetypecode) {
                ApiCall.MakeApiCall("ModifyVenuetype", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.VenuetypeMaster = null;
                    $scope.GetAllVenuetypeMaster();
                    $scope.showAddwindow = false;
                    toaster.pop('success', "Success", 'Venue Type updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding VenuetypeMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter Venue Type and code', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter Venue Type and code', null);
        }
    };



    $scope.showconfirm = function (data) {
        $scope.VenuetypeMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.VenuetypeMaster = null;
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
                        if (value.RightName == 'Venuetype Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllVenuetypeMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);