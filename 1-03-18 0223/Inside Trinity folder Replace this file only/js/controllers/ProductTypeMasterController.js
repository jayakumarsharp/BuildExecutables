ReportApp.controller('ProductMasterController', ['$scope', '$rootScope', '$timeout', 'ApiCall', 'UserFactory', 'reportFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $timeout, ApiCall, UserFactory, reportFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID'),
        DTColumnBuilder.newColumn('ProductName').withTitle('Product'),
        DTColumnBuilder.newColumn('Id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];

    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }

    $scope.Confirmcancel = function () {
        $('#confirmModal').modal('show');
    }


    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="GetProductMasterById(' + data + ')"><img src="images/edit.png"></a> ';
    }
    $scope.Showadd = function () {
        $scope.showAddwindow = true;
    }
    $scope.showAddwindow = false;

    $scope.editMode = false;
    $scope.IsReadOnly = false;

    $scope.GetAllProductMaster = function () {
        ApiCall.MakeApiCall("GetAllProductType?ProductTypeId=", 'GET', '').success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data
        }).error(function (error) {
            $scope.Error = error;
        })
    };


    $scope.add = function (ProductMaster) {
        if (ProductMaster != null) {
            if (ProductMaster.ProductName.trim() != "") {
                ApiCall.MakeApiCall("AddProductType", 'POST', ProductMaster).success(function (data) {
                    if (data.Error != undefined) {
                        toaster.pop('error', "Error", data.Error, null);
                    } else {
                        $scope.ProductMaster = null;
                        $scope.GetAllProductMaster();
                        $scope.showAddwindow = false;
                        $scope.editMode = false;
                        toaster.pop('success', "Success", 'Product added successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding ProductMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter Product', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter Product', null);
        }

    };

    $scope.GetProductMasterById = function (ProductMasterId) {
        ApiCall.MakeApiCall("GetAllProductType?ProductTypeId=" + ProductMasterId, 'GET', '').success(function (data) {
            $scope.editMode = true;
            $scope.showAddwindow = true;
            $scope.ProductMaster = data[0];
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding Product! " + data.ExceptionMessage;
        });
    };


    $scope.delete = function () {
        ApiCall.MakeApiCall("DeleteProductType?ProductTypeId=" + $scope.ProductMasterId, 'GET', '').success(function (data) {
            $scope.ProductMaster = null;
            $scope.editMode = false;
            $scope.GetAllProductMaster();
            $('#confirmModal').modal('hide');
            toaster.pop('success', "Success", 'ProductMaster deleted successfully', null);
        }).error(function (data) {
            $scope.error = "An Error has occured while deleting user! " + data.ExceptionMessage;
        });
    };

    $scope.UpdateProductMaster = function (model) {
        if (model != null) {
            if (model.ProductName.trim() != "") {
                ApiCall.MakeApiCall("ModifyProductType", 'POST', model).success(function (data) {
                    $scope.editMode = false;
                    $scope.ProductMaster = null;
                    $scope.showAddwindow = false;
                    $scope.GetAllProductMaster();
                    toaster.pop('success', "Success", 'Product updated successfully', null);
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding ProductMaster! " + data.ExceptionMessage;
                });
            }
            else {
                toaster.pop('warning', "Warning", 'Please enter ProductMaster', null);
            }
        }
        else {
            toaster.pop('warning', "Warning", 'Please enter Product', null);
        }
    };


    $scope.showconfirm = function (data) {
        $scope.ProductMasterId = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.ProductMaster = null;
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
                        if (value.RightName == 'Product Type Write') {
                            isRead = false;
                        }
                    });
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }

                    $scope.GetAllProductMaster();

                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
    };
    $scope.GetRightsList();



}]);