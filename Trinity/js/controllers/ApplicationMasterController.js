ReportApp.controller('ApplicationMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder',function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(), ,
        DTColumnBuilder.newColumn('ApplicationId').withTitle('Application ID'),
        DTColumnBuilder.newColumn('ApplicationName').withTitle('Application Name'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    function actionsHtml(data, type, full, meta) {
        return '<a  ng-click="GetApplicationMasterById(' + data + ')"><img src="images/edit.png"></a>';
        //'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }
    $scope.showAddwindow = false;
    $scope.ApplicationMasterList = [];
    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.GetAllApplicationMaster = function () {
        ApiCall.MakeApiCall("GetAllApplication?ApplicationId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.ApplicationMasterGrid = {
        paginationPageSizes: [10, 20, 30, 40, 50, 60],
        paginationPageSize: 10,
        columnDefs: [],
    };
    $scope.add = function (ApplicationMaster) {
        if (ApplicationMaster != null) {
            if (ApplicationMaster.ApplicationId.trim() != "" && ApplicationMaster.ApplicationName.trim() != "") {
                ApiCall.MakeApiCall("AddApplication", 'POST', ApplicationMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.ApplicationMaster = null;
                        $scope.GetAllApplicationMaster();
                        $scope.editMode = false;
                        $scope.showAddwindow = false;
                        toaster.pop('success', "Success", 'Application added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding Application! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter Application ID and Application Name', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter Application ID and Application Name', null);
        }

    };

    $scope.GetApplicationMasterById = function (ApplicationMasterId) {
        ApiCall.MakeApiCall("GetAllApplication?ApplicationId=" + ApplicationMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.ApplicationMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding ApplicationMaster! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteApplication?ApplicationId=" + $scope.ApplicationMasterId, 'GET', '').success(function (data) {
            $scope.ApplicationMaster = null;
            $scope.editMode = false;
            $scope.GetAllApplicationMaster();
            $('#confirmModal').modal('hide');
            toaster.pop('success', "Success", 'ApplicationMaster deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.UpdateApplicationMaster = function (model) {
        if (model != null) {
            if (model.ApplicationId.trim() != "" && model.ApplicationName.trim() != "") {
                ApiCall.MakeApiCall("ModifyApplication", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.ApplicationMaster = null;
                    $scope.GetAllApplicationMaster();
                    $scope.showAddwindow = false;
                    toaster.pop('success', "Success", 'Application updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding Application ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter Application ', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter Application', null);
        }
    };


    $scope.showconfirm = function (data) {
        $scope.ApplicationMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.ApplicationMaster = null;
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
                        if (value.RightName == 'Application Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }

                    $scope.GetAllApplicationMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };

    $scope.GetAllApplicationMaster();
    $scope.GetRightsList();
}]);