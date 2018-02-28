ReportApp.controller('CountryMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.showAddwindow = false;
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').notVisible(),
        DTColumnBuilder.newColumn('CountryName').withTitle('Country'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }



    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetCountryMasterById(' + data + ')"><img src="images/edit.png"></a> ';
        //+'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }

    $scope.editMode = false;
    $scope.IsReadOnly = false;
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }


    $scope.GetAllCountryMaster = function () {
        ApiCall.MakeApiCall("GetAllCountry?CountryId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (CountryMaster) {
        if (CountryMaster != null) {
            if (CountryMaster.CountryName.trim() != "") {
                ApiCall.MakeApiCall("AddCountry", 'POST', CountryMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.CountryMaster = null;
                        $scope.GetAllCountryMaster();
                        $scope.editMode = false;

                        $scope.showAddwindow = false;
                        toaster.pop('success', "Success", 'Country added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding Country ! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter Country', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter Country', null);
        }

    };

    $scope.GetCountryMasterById = function (CountryMasterId) {
        ApiCall.MakeApiCall("GetAllCountry?CountryId=" + CountryMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.CountryMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding Country! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteCountry?CountryId=" + $scope.CountryMasterId, 'GET', '').success(function (data) {
            $scope.CountryMaster = null;
            $scope.editMode = false;
            $scope.GetAllCountryMaster();
            $('#confirmModal').modal('hide');
            $scope.showAddwindow = false;
            toaster.pop('success', "Success", 'Country deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }

    $scope.UpdateCountryMaster = function (model) {
        if (model != null) {
            if (model.CountryName.trim() != "") {
                ApiCall.MakeApiCall("ModifyCountry", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.CountryMaster = null;
                    $scope.GetAllCountryMaster();
                    $scope.showAddwindow = false;
                    toaster.pop('success', "Success", 'CountryMaster updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding CountryMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter Country', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter Country', null);
        }
    };



    $scope.showconfirm = function (data) {
        $scope.CountryMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.CountryMaster = null;
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
                        if (value.RightName == 'Country Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                    $scope.GetAllCountryMaster();
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();

}]);