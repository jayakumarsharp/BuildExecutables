ReportApp.controller('BusinessSuffixMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('BusinessSuffix').withTitle('Business Suffix'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }



    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetBusinessSuffixMasterById(' + data + ')"><img src="images/edit.png"></a> ';
        //+'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }

    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }


    $scope.GetAllBusinessSuffixMaster = function () {
        ApiCall.MakeApiCall("GetAllBusinessSuffix?BusinessSuffixId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (BusinessSuffixMaster) {
        if (BusinessSuffixMaster != null) {
            if (BusinessSuffixMaster.BusinessSuffix.trim() != "") {
                ApiCall.MakeApiCall("AddBusinessSuffix", 'POST', BusinessSuffixMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.BusinessSuffixMaster = null;
                        $scope.GetAllBusinessSuffixMaster();
                        $scope.editMode = false;

                        $scope.showAddwindow = false;
                        toaster.pop('success', "Success", 'BusinessSuffix added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding BusinessSuffix ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter BusinessSuffix', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter BusinessSuffix', null);
        }

    };

    $scope.GetBusinessSuffixMasterById = function (BusinessSuffixMasterId) {
        ApiCall.MakeApiCall("GetAllBusinessSuffix?BusinessSuffixId=" + BusinessSuffixMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.BusinessSuffixMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding BusinessSuffix! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteBusinessSuffix?BusinessSuffixId=" + $scope.BusinessSuffixMasterId, 'GET', '').success(function (data) {
            $scope.BusinessSuffixMaster = null;
            $scope.editMode = false;
            $scope.GetAllBusinessSuffixMaster();
            $('#confirmModal').modal('hide');
            $scope.showAddwindow = false;
            toaster.pop('success', "Success", 'BusinessSuffix deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.UpdateBusinessSuffixMaster = function (model) {
        if (model != null) {
            if (model.BusinessSuffix.trim() !== "") {
                ApiCall.MakeApiCall("ModifyBusinessSuffix", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.BusinessSuffixMaster = null;
                    $scope.GetAllBusinessSuffixMaster();
                    $scope.showAddwindow = false;
                    toaster.pop('success', "Success", 'BusinessSuffixMaster updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding BusinessSuffixMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter BusinessSuffix', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter BusinessSuffix', null);
        }
    };



    $scope.showconfirm = function (data) {
        $scope.BusinessSuffixMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.BusinessSuffixMaster = null;
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
                        if (value.RightName == 'BusinessSuffix Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllBusinessSuffixMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);