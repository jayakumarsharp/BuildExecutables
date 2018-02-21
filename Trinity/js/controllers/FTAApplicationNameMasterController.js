ReportApp.controller('FTAApplicationNameMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('FTAApplicationName').withTitle('FTAApplicationName'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetFTAApplicationNameMasterById(' + data + ')"><img src="images/edit.png"></a> ';
        //+'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }

    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }


    $scope.GetAllFTAApplicationNameMaster = function () {
        ApiCall.MakeApiCall("GetAllFTAApplicationName?FTAApplicationNameId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (FTAApplicationNameMaster) {
        if (FTAApplicationNameMaster != null) {
            if (FTAApplicationNameMaster.FTAApplicationName.trim() != "") {
                ApiCall.MakeApiCall("AddFTAApplicationName", 'POST', FTAApplicationNameMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.FTAApplicationNameMaster = null;
                        $scope.GetAllFTAApplicationNameMaster();
                        $scope.editMode = false;

                        $scope.showAddwindow = false;
                        toaster.pop('success', "Success", 'FTA ApplicationName added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding FTA ApplicationName ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter FTA ApplicationName', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter FTAApplicationName', null);
        }

    };

    $scope.GetFTAApplicationNameMasterById = function (FTAApplicationNameMasterId) {
        ApiCall.MakeApiCall("GetAllFTAApplicationName?FTAApplicationNameId=" + FTAApplicationNameMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.FTAApplicationNameMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding FTAApplicationName! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteFTAApplicationName?FTAApplicationNameId=" + $scope.FTAApplicationNameMasterId, 'GET', '').success(function (data) {
            $scope.FTAApplicationNameMaster = null;
            $scope.editMode = false;
            $scope.GetAllFTAApplicationNameMaster();
            $('#confirmModal').modal('hide');
            $scope.showAddwindow = false;
            toaster.pop('success', "Success", 'FTAApplicationName deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.UpdateFTAApplicationNameMaster = function (model) {
        if (model != null) {
            if (model.FTAApplicationName.trim() != "") {
                ApiCall.MakeApiCall("ModifyFTAApplicationName", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.FTAApplicationNameMaster = null;
                    $scope.GetAllFTAApplicationNameMaster();
                    $scope.showAddwindow = false;
                    toaster.pop('success', "Success", 'FTAApplicationNameMaster updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding FTAApplicationNameMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter FTAApplicationName', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter FTAApplicationName', null);
        }
    };



    $scope.showconfirm = function (data) {
        $scope.FTAApplicationNameMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.FTAApplicationNameMaster = null;
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
                        if (value.RightName == 'FTAApplicationName Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllFTAApplicationNameMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);