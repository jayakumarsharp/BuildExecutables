ReportApp.controller('BusinessSectorMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('BusinessSectorName').withTitle('Business Sector'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetBusinessSectorMasterById(' + data + ')"><img src="images/edit.png"></a>';
        //'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.BusinessSectorMasterList = [];
    $scope.editMode = false;

    $scope.showAddwindow = false
    $scope.IsReadOnly = false;
    $scope.GetAllBusinessSectorMaster = function () {
        ApiCall.MakeApiCall("GetAllBusinessSector?BusinessSectorId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data

        }).error(function (error) {
            $scope.Error = error;
        })
    };
    $rootScope.$on("toggle", function () {
        //jay
        $timeout(function () {
            $scope.BusinessSectorMasterGrid.api.sizeColumnsToFit();
        }, 1000);
    });

    $scope.add = function (BusinessSectorMaster) {
        if (BusinessSectorMaster != null) {
            if (BusinessSectorMaster.BusinessSectorName.trim()) {
                ApiCall.MakeApiCall("AddBusinessSector", 'POST', BusinessSectorMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {

                        $scope.BusinessSectorMaster = null;
                        $scope.GetAllBusinessSectorMaster();
                        $scope.editMode = false;
                        $scope.showAddwindow = false;
                        toaster.pop('success', "Success", 'Business Sector added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding BusinessSectorMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter Business Sector', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter Business Sector', null);
        }

    };

    $scope.GetBusinessSectorMasterById = function (BusinessSectorMasterId) {
        ApiCall.MakeApiCall("GetAllBusinessSector?BusinessSectorId=" + BusinessSectorMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.BusinessSectorMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding Business Sector! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteBusinessSector?BusinessSectorId=" + $scope.BusinessSectorMasterId, 'GET', '').success(function (data) {
            $scope.BusinessSectorMaster = null;
            $scope.editMode = false;
            $scope.GetAllBusinessSectorMaster();
            $('#confirmModal').modal('hide');
            toaster.pop('success', "Success", 'Business Sector deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting Business Sector! " + data.ExceptionMessage;
        });
    };

    $scope.UpdateBusinessSectorMaster = function (model) {
        if (model != null) {
            if (model.BusinessSectorName.trim()) {
                ApiCall.MakeApiCall("ModifyBusinessSector", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.showAddwindow = false;
                    $scope.BusinessSectorMaster = null;
                    $scope.GetAllBusinessSectorMaster();
                    toaster.pop('success', "Success", 'Business Sector updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding BusinessSectorMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter Business Sector', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter Business Sector', null);
        }
    };


    $scope.showconfirm = function (data) {
        $scope.BusinessSectorMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.BusinessSectorMaster = null;
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
                        if (value.RightName == 'Business Sector Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }


                    $scope.GetAllBusinessSectorMaster();

                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();


}]);