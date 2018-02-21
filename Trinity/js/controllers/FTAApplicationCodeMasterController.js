ReportApp.controller('FTAApplicationCodeMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('FTAApplicationCode').withTitle('FTAApplicationCode'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }



    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetFTAApplicationCodeMasterById(' + data + ')"><img src="images/edit.png"></a> ';
        //+'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }

    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }


    $scope.GetAllFTAApplicationCodeMaster = function () {
        ApiCall.MakeApiCall("GetAllFTAApplicationCode?FTAApplicationCodeId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (FTAApplicationCodeMaster) {
        if (FTAApplicationCodeMaster != null) {
            if (FTAApplicationCodeMaster.FTAApplicationCode.trim() != "") {
                ApiCall.MakeApiCall("AddFTAApplicationCode", 'POST', FTAApplicationCodeMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.FTAApplicationCodeMaster = null;
                        $scope.GetAllFTAApplicationCodeMaster();
                        $scope.editMode = false;

                        $scope.showAddwindow = false;
                        toaster.pop('success', "Success", 'FTAApplicationCode added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding FTAApplicationCode ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter FTAApplicationCode', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter FTAApplicationCode', null);
        }

    };

    $scope.GetFTAApplicationCodeMasterById = function (FTAApplicationCodeMasterId) {
        ApiCall.MakeApiCall("GetAllFTAApplicationCode?FTAApplicationCodeId=" + FTAApplicationCodeMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.FTAApplicationCodeMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding FTAApplicationCode! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteFTAApplicationCode?FTAApplicationCodeId=" + $scope.FTAApplicationCodeMasterId, 'GET', '').success(function (data) {
            $scope.FTAApplicationCodeMaster = null;
            $scope.editMode = false;
            $scope.GetAllFTAApplicationCodeMaster();
            $('#confirmModal').modal('hide');
            $scope.showAddwindow = false;
            toaster.pop('success', "Success", 'FTAApplicationCode deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.UpdateFTAApplicationCodeMaster = function (model) {
        if (model != null) {
            if (model.FTAApplicationCode.trim() != "") {
                ApiCall.MakeApiCall("ModifyFTAApplicationCode", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.FTAApplicationCodeMaster = null;
                    $scope.GetAllFTAApplicationCodeMaster();
                    $scope.showAddwindow = false;
                    toaster.pop('success', "Success", 'FTAApplicationCodeMaster updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding FTAApplicationCodeMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter FTAApplicationCode', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter FTAApplicationCode', null);
        }
    };



    $scope.showconfirm = function (data) {
        $scope.FTAApplicationCodeMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.FTAApplicationCodeMaster = null;
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
                        if (value.RightName == 'FTAApplicationCode Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllFTAApplicationCodeMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);