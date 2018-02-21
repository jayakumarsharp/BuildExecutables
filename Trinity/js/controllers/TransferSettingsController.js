ReportApp.controller('TransferSettingsController', ['$scope', '$rootScope', 'StrategyService', '$timeout', 'UserFactory', 'reportFactory', 'toaster', function ($scope, $rootScope, StrategyService, $timeout, UserFactory, reportFactory, toaster) {
    $scope.status = false;
    $scope.IsReadOnly = true;
    $scope.userlist = [];
    $scope.transfer = {};

    $scope.changeStatus = function () {
        if (!$scope.IsReadOnly)
            $scope.status = !$scope.status;
    }
    $scope.GetRightsList = function () {
        UserFactory.getloggedusername().success(function (data) {
            var userId = data;
            if (data !== '') {
                reportFactory.GetRightsList(userId).success(function (data) {
                    var isRead = true;
                    $scope.IsReadOnly = true;
                    angular.forEach(data, function (value, key) {
                        if (value.RightName === 'Delegate Settings Write') {
                            isRead = false;
                        }
                    })
                    if (!isRead) {
                        $scope.IsReadOnly = false;
                    }
                }).error(function (error) {
                    console.log('Error when getting rights list: ' + error);
                });
            }

        });
        UserFactory.GetUsers().success(function (data) {
            for (var i = 0; i < data.length; i++) {
                $scope.userlist.push({ RefNumber: '', Approver: data[i].userId, Id: data[i].Id })
            }
            $scope.getallcurrencyconversions();

        });

    };

    $scope.getallcurrencyconversions = function () {
        StrategyService.GetTransfersetting().success(function (data) {
            if (data !== null && data.length > 0) {
                $scope.status = true;
                $scope.TransferTo = moment(data[0].TransferTo, 'DD-MM-YYYY HH:mm:ss').format('MM/DD/YYYY');
                $scope.TransferFrom = moment(data[0].TransferFrom, 'DD-MM-YYYY HH:mm:ss').format('MM/DD/YYYY');
                $scope.Transferuser = data[0].Transferuser;
            }
            else {
                $scope.TransferTo = '';
                $scope.TransferFrom = '';
                $scope.TransferTo = '';
            }
        })
    };


    $scope.update = function () {
        if ($scope.status) {
            if (validate()) {
                var currency = { Transferuser: $scope.Transferuser, TransferFrom: $scope.TransferFrom, TransferTo: $scope.TransferTo }
                StrategyService.InsertTransferSetting(currency).success(function (data) {
                    if (data === "success") {
                        $scope.getallcurrencyconversions()
                        toaster.pop('success', "Success", 'Delegate setting updated successfully', null);
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Adding currency! " + data.ExceptionMessage;
                });
            }
        }
        else {
            StrategyService.DeleteTransferSetting().success(function (data) {
                if (data === "success") {
                    $scope.getallcurrencyconversions()
                    toaster.pop('success', "Success", 'Delegate setting updated successfully', null);
                }
            }).error(function (data) {
                $scope.error = "An Error has occured while Adding currency! " + data.ExceptionMessage;
            });
        }


    };

    function validate() {
        if (!$scope.Transferuser) {
            toaster.pop('warning', "Warning", 'please select delegate user', null);
            return false;
        }
        else if (!$scope.TransferFrom) {
            toaster.pop('warning', "Warning", 'please select delegate duration From', null);
            return false;
        }
        else if (!$scope.TransferTo) {
            toaster.pop('warning', "Warning", 'please select delegate duration To', null);
            return false;
        }
        return true;
    }

    $scope.showconfirm = function (data) {
        $scope.Id = data;
        $('#confirmModal').modal('show');
    };

    $scope.cancel = function () {
        $scope.currency = {};
        $scope.ecurrency = {};
        $('#currencyModel').modal('hide');
    };

    $scope.GetRightsList();

}]);