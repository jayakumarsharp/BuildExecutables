ReportApp.controller('BusinessMappingController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.editMode = false;
    $scope.IsReadOnly = false;

    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('Business').withTitle('Business'),
        DTColumnBuilder.newColumn('BusinessSuffix').withTitle('Business Suffix'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }



    function actionsHtml(data, type, full, meta) {
        return '<a  ng-click="delete(' + data + ')"><img src="images/delete.png"></a> ';
    }


    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }


    $scope.GetAllBusinessMaster = function () {
        ApiCall.MakeApiCall("GetAllBusinessMapping?BusinessId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data

        }).error(function (error) {
            $scope.Error = error;
        })
        ApiCall.MakeApiCall("GetAllBusiness?BusinessId=", 'GET', '').success(function (data) {
            //$scope.data = data;
            //$scope.dtOptions.data = $scope.data
            $scope.BusinessList = data;
        }).error(function (error) {
            $scope.Error = error;
        })
        ApiCall.MakeApiCall("GetAllBusinessSuffix?BusinessSuffixId=", 'GET', '').success(function (data) {
            $scope.BusinessSuffixList = data;
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (BusinessMaster) {
        if (BusinessMaster != null) {
            if (BusinessMaster.Business.Business && BusinessMaster.BusinessSuffix.BusinessSuffix) {
                var input = { BusinessId: BusinessMaster.Business.Id, BusinessSuffixId: BusinessMaster.BusinessSuffix.Id };
                ApiCall.MakeApiCall("AddBusinessMapping", 'POST', input).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {

                        if (data == "success") {
                            $scope.BusinessMaster = null;
                            $scope.GetAllBusinessMaster();
                            $scope.editMode = false;
                            $scope.showAddwindow = false;
                            toaster.pop('success', "Success", 'Business added successfully', null);
                        }
                        else
                            toaster.pop('warning', "Warning", data, null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding Business ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter Business', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter Business', null);
        }

    };

    $scope.GetBusinessMasterById = function (BusinessMasterId) {
        ApiCall.MakeApiCall("GetAllBusiness?BusinessId=" + BusinessMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.BusinessMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding Business! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function (id) {
        ApiCall.MakeApiCall("DeleteBusinessMapping?BusinessId=" + id, 'GET', '').success(function (data) {
            if (data == "success") {
                $scope.BusinessMaster = null;
                $scope.editMode = false;
                $scope.GetAllBusinessMaster();
                $('#confirmModal').modal('hide');
                $scope.showAddwindow = false;
                toaster.pop('success', "Success", 'Business deleted successfully', null);
            }
            else
                toaster.pop('warning', "Warning", data, null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    //$scope.UpdateBusinessMaster = function (model) {
    //    if (model != null) {
    //        if (model.Business.trim() != "") {
    //            ApiCall.MakeApiCall("ModifyBusiness", 'POST', model).success(function (data) {
    //                $scope.editMode = false;
    //                $scope.BusinessMaster = null;
    //                $scope.GetAllBusinessMaster();
    //                $scope.showAddwindow = false;
    //                toaster.pop('success', "Success", 'BusinessMaster updated successfully', null);
    //            }).error(function (data) {
    //                $scope.error = "An Error has occured while Adding BusinessMaster! " + data.ExceptionMessage;
    //            });
    //        }
    //        else {
    //            toaster.pop('warning', "Warning", 'Please enter Business', null);
    //        }
    //    }
    //    else {
    //        toaster.pop('warning', "Warning", 'Please enter Business', null);
    //    }
    //};



    $scope.showconfirm = function (data) {
        $scope.BusinessMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.BusinessMaster = null;
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
                        if (value.RightName == 'Business Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllBusinessMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);