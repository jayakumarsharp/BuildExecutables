ReportApp.controller('ApplicationCategoryMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('ApplicationCategory').withTitle('Application Category'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }



    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetApplicationCategoryMasterById(' + data + ')"><img src="images/edit.png"></a> ';
        //+'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }

    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }


    $scope.GetAllApplicationCategoryMaster = function () {
        ApiCall.MakeApiCall("GetAllApplicationCategory?ApplicationCategoryId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (ApplicationCategoryMaster) {
        if (ApplicationCategoryMaster !== null) {
            if (ApplicationCategoryMaster.ApplicationCategory.trim() != "") {
                ApiCall.MakeApiCall("AddApplicationCategory", 'POST', ApplicationCategoryMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.ApplicationCategoryMaster = null;
                        $scope.GetAllApplicationCategoryMaster();
                        $scope.editMode = false;

                        $scope.showAddwindow = false;
                        toaster.pop('success', "Success", 'ApplicationCategory added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding ApplicationCategory ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter ApplicationCategory', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter ApplicationCategory', null);
        }

    };

    $scope.GetApplicationCategoryMasterById = function (ApplicationCategoryMasterId) {
        ApiCall.MakeApiCall("GetAllApplicationCategory?ApplicationCategoryId=" + ApplicationCategoryMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.ApplicationCategoryMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding ApplicationCategory! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteApplicationCategory?ApplicationCategoryId=" + $scope.ApplicationCategoryMasterId, 'GET', '').success(function (data) {
            $scope.ApplicationCategoryMaster = null;
            $scope.editMode = false;
            $scope.GetAllApplicationCategoryMaster();
            $('#confirmModal').modal('hide');
            $scope.showAddwindow = false;
            toaster.pop('success', "Success", 'ApplicationCategory deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.UpdateApplicationCategoryMaster = function (model) {
        if (model != null) {
            if (model.ApplicationCategory.trim() != "") {
                ApiCall.MakeApiCall("ModifyApplicationCategory", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.ApplicationCategoryMaster = null;
                    $scope.GetAllApplicationCategoryMaster();
                    $scope.showAddwindow = false;
                    toaster.pop('success', "Success", 'ApplicationCategoryMaster updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding ApplicationCategoryMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter ApplicationCategory', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter ApplicationCategory', null);
        }
    };



    $scope.showconfirm = function (data) {
        $scope.ApplicationCategoryMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.ApplicationCategoryMaster = null;
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
                        if (value.RightName == 'ApplicationCategory Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllApplicationCategoryMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);