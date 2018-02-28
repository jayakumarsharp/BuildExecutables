ReportApp.controller('PriorityScoreMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('PriorityScore').withTitle('Priority Score'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }



    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetPriorityScoreMasterById(' + data + ')"><img src="images/edit.png"></a> ';
        //+'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }

    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }


    $scope.GetAllPriorityScoreMaster = function () {
        ApiCall.MakeApiCall("GetAllPriorityScore?PriorityScoreId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (PriorityScoreMaster) {
        if (PriorityScoreMaster != null) {
            if (PriorityScoreMaster.PriorityScore.trim() != "") {
                ApiCall.MakeApiCall("AddPriorityScore", 'POST', PriorityScoreMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.PriorityScoreMaster = null;
                        $scope.GetAllPriorityScoreMaster();
                        $scope.editMode = false;

                        $scope.showAddwindow = false;
                        toaster.pop('success', "Success", 'PriorityScore added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding PriorityScore ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter PriorityScore', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter PriorityScore', null);
        }

    };

    $scope.GetPriorityScoreMasterById = function (PriorityScoreMasterId) {
        ApiCall.MakeApiCall("GetAllPriorityScore?PriorityScoreId=" + PriorityScoreMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.PriorityScoreMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding PriorityScore! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeletePriorityScore?PriorityScoreId=" + $scope.PriorityScoreMasterId, 'GET', '').success(function (data) {
            $scope.PriorityScoreMaster = null;
            $scope.editMode = false;
            $scope.GetAllPriorityScoreMaster();
            $('#confirmModal').modal('hide');
            $scope.showAddwindow = false;
            toaster.pop('success', "Success", 'PriorityScore deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.UpdatePriorityScoreMaster = function (model) {
        if (model != null) {
            if (model.PriorityScore.trim() != "") {
                ApiCall.MakeApiCall("ModifyPriorityScore", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.PriorityScoreMaster = null;
                    $scope.GetAllPriorityScoreMaster();
                    $scope.showAddwindow = false;
                    toaster.pop('success', "Success", 'PriorityScoreMaster updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding PriorityScoreMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter PriorityScore', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter PriorityScore', null);
        }
    };



    $scope.showconfirm = function (data) {
        $scope.PriorityScoreMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.PriorityScoreMaster = null;
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
                        if (value.RightName == 'PriorityScore Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllPriorityScoreMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);