ReportApp.controller('RegionMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.showAddwindow = false;

    $scope.data = [];
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(), ,
        DTColumnBuilder.newColumn('RegionName').withTitle('Region'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetRegionMasterById(' + data + ')"><img src="images/edit.png"></a>';
    }
    
    $scope.GetAllRegionMaster = function () {
        ApiCall.MakeApiCall("GetAllRegion?RegionId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.add = function (RegionMaster) {
        if (RegionMaster != null) {
            if (RegionMaster.RegionName.trim() != "") {
                ApiCall.MakeApiCall("AddRegion", 'POST', RegionMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.showAddwindow = false;
                        $scope.RegionMaster = null;
                        $scope.GetAllRegionMaster();
                        $scope.editMode = false;
                        toaster.pop('success', "Success", 'Region added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding Region! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter Region', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter Region', null);
        }

    };

    $scope.GetRegionMasterById = function (RegionMasterId) {
        $scope.showAddwindow = true;
        ApiCall.MakeApiCall("GetAllRegion?RegionId=" + RegionMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.RegionMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding Region! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteRegion?RegionId=" + $scope.RegionMasterId, 'GET', '').success(function (data) {
            $scope.RegionMaster = null;
            $scope.editMode = false;
            $scope.GetAllRegionMaster();
            $('#confirmModal').modal('hide');
            toaster.pop('success', "Success", 'Region deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.UpdateRegionMaster = function (model) {
        if (model != null) {
            if (model.RegionName.trim()) {
                ApiCall.MakeApiCall("ModifyRegion", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.RegionMaster = null;
                    $scope.showAddwindow = false;
                    $scope.GetAllRegionMaster();
                    toaster.pop('success', "Success", 'Region updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding RegionMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter RegionMaster', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter RegionMaster', null);
        }
    };


    $scope.showconfirm = function (data) {
        $scope.RegionMasterId = data;
        $('#confirmModal').modal('show');
    };
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }

    $scope.cancel = function () {
        $scope.RegionMaster = null;
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
                        if (value.RightName == 'Region Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }

                    $scope.GetAllRegionMaster();

                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();


}]);