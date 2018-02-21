ReportApp.controller('RoleController', ['$scope', '$rootScope', '$window', '$location', 'RoleFactory', 'reportFactory', 'UserFactory', 'ApiCall', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', function ($scope, $rootScope, $window, $location, RoleFactory, reportFactory, UserFactory, ApiCall, toaster, $compile, DTOptionsBuilder, DTColumnBuilder) {
    $scope.data = [];
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('RoleName').withTitle('Role Name'),
        DTColumnBuilder.newColumn('id').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];
    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }
    function actionsHtml(data, type, full, meta) {
        $scope.data = data;
        return '<a  ng-click="EditRole(' + data + ')"><img src="images/edit.png"></a>';
        //'<button class="btn btn-danger" ng-click="delete(' + data + ')" )"="">' +
        //'   <i class="fa fa-trash-o"></i>' +
        //'</button>';
    }
    $scope.Error = {};
    $scope.role = {};
    $scope.Role = {};
    $scope.EditedRole = {};
    $scope.Roles = [];
    $scope.RoleRight = {};
    $scope.Right = {};
    $scope.Rights = [];
    $scope.editMode = false;
    $scope.rolename = {};
    $scope.rightnames = [];
    $scope.IsReadOnly = false;
    //$scope.DisplayMessage = '';

    $scope.IsPageReadOnly = function () {
        UserFactory.getloggedusername().success(function (data) {
            var userId = data;
            if (data != '') {
                reportFactory.GetRightsList(userId).success(function (data) {
                    var isRead = true;
                    $scope.IsReadOnly = true;
                    angular.forEach(data, function (value, key) {
                        if (value.RightName == 'Role Management Write') {
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

    },
        $scope.GetAllRights = function () {
            $scope.Rights = [];
            RoleFactory.GetRights().success(function (data) {
                $scope.Rights = data;
                console.log('Rights length: ' + $scope.Rights.length);
            }).error(function (error) {
                //alert('Get all rights error');
                $scope.Error = error;
            });
        };

    $scope.GetAllRoles = function () {
        UserFactory.getloggedusername().success(function (username) {
            $scope.username = username;
        }).error(function (error) {
            console.log('Error modifying Role-right: ' + error);
        });
        RoleFactory.GetRoles().success(function (data) {
            $scope.data = data;
            $scope.dtOptions.data = $scope.data;
        }).error(function (error) {
            //alert('Get all roles error');
            $scope.Error = error;
        });
    };
    $scope.GetRole = function (roleId) {
        RoleFactory.GetRole(roleId).success(function (data) {
            $scope.Role = data;
            $('#ViewRole').modal('show');
        }).error(function (error) {
            $scope.Error = error;
        })
    };
    $scope.ViewRole = function (roleId) {
        $scope.rolename = {};
        $scope.rightnames = [];
        RoleFactory.GetRoleRightMapping(roleId).success(function (data) {
            var roleName = $scope.GetRoleName(roleId);
            $scope.rolename = { 'roleName': roleName };
            for (i = 0; i < data.length; i++) {
                var rightName = $scope.GetRightName(data[i].RightID);
                $scope.rightnames.push({ 'rightName': rightName });
            }

            $('#ViewRole').modal('show');
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.GetRoleName = function (roleId) {
        for (var i = 0; i < $scope.Roles.length; i++) {
            if ($scope.Roles[i].id == roleId) {
                return $scope.Roles[i].RoleName;
            }
        }
        return "";
    };
    $scope.GetRightName = function (rightId) {
        for (var i = 0; i < $scope.Rights.length; i++) {
            if ($scope.Rights[i].RightID == rightId) {
                return $scope.Rights[i].RightName;
            }
        }
        return "";
    };

    $scope.EditRole = function (data) {
        RoleFactory.GetRole(data).success(function (data) {
            $scope.role = data[0];
            $scope.editMode = true;
            $scope.GetLists();
            $('#AddEditRole').modal('show');
        });

    };

    $scope.GetRoleRightMapping = function (roleId) {
        RoleFactory.GetRoleRightMapping(roleId).success(function (data) {
            $scope.RoleRight = data;
        }).error(function (error) {
            console.log(error);
            $scope.Error = error;
        })
    };
    //Model popup events
    $scope.showadd = function () {
        $scope.role = {};
        $scope.editMode = false;
        $scope.GetLists();
        $('#AddEditRole').modal('show');
    };

    //Model popup events
    $scope.showconfirm = function (data) {
        $scope.RoleRight = data;
        $('#confirmModal').modal('show');
    };

    // add role
    $scope.add = function (v) {
        var currentRole = v;
        if (currentRole != null && currentRole.selectedRole != null && $scope.listB.length > 0) {
            currentRole.Rights = $scope.listB;
            RoleFactory.AddRole(currentRole).success(function (data) {
                currentRole.RoleID = data;
                $scope.role = currentRole;
                RoleFactory.AddRoleRightMapping(currentRole).success(function (data) {
                    $scope.addMode = false;
                    //currentRole.UserId = data;
                    //$scope.users.push(currentRole);
                    $scope.GetAllRoles();
                    $scope.role = {};
                    // $scope.adduserform.$setPristine(); //for form reset
                    toaster.pop('success', "Success", "Role added successfully", null);
                    $('#AddEditRole').modal('hide');
                    $scope.listA = [];
                    $scope.listB = [];
                }).error(function (data) {
                    $scope.error = "An error has occurred while adding Role! " + data.ExceptionMessage;
                });

            })
        }
        else {
            toaster.pop('warning', "Warning", "Select the Rights", null);
        }
    };


    $scope.ModifyRoleRight = function (data) {
        RoleFactory.GetUser($scope.username).success(function (userrole) {
            var isfound = true;
            if (userrole.length > 0) {
                if (userrole[0].RoleId == data.id) {
                    $scope.EditedRole = data;
                    $('#roleChange').modal('show');
                    isfound = false;
                }
            }
            if (isfound) {
                $scope.role = data;
                $scope.role.Rights = $scope.listB;
                RoleFactory.ModifyRoleRight($scope.role).success(function (data) {
                    $scope.GetAllRoles();
                    $scope.role = {};
                    toaster.pop('success', "Success", "Role modified successfully", null);
                    $('#AddEditRole').modal('hide');
                    $scope.listA = [];
                    $scope.listB = [];
                }).error(function (error) {
                    console.log('Error modifying Role-right: ' + error);
                });
            }
        }).error(function (error) {
            console.log('Error getting user roles: ' + error);
        });


    };

    $scope.ModifySelfUser = function (data) {
        $('#roleChange').modal('hide');
        $scope.role = data;
        $scope.role.Rights = $scope.listB;
        RoleFactory.ModifyRoleRight($scope.role).success(function (data) {
            $scope.GetAllRoles();
            $scope.role = {};
            toaster.pop('success', "Success", "Role modified successfully", null);
            $('#AddEditRole').modal('hide');
            $scope.listA = [];
            $scope.listB = [];
            reportFactory.Logout($scope.username).success(function (data) {
                location.href = 'Home/LoginDisplay';
                console.log('Logged out successfully');
            }).error(function (error) {
                console.log('Failed to log out properly. Error: ' + error);
            })
        }).error(function (error) {
            console.log('Error modifying Role-right: ' + error);
        });
    };
    $scope.cancel = function () {
        $scope.role = {};
        $('#AddEditRole').modal('hide');
    }
    $scope.delete = function () {
        var currentRole = $scope.RoleRight;
        ApiCall.MakeApiCall("GetUsersByRoles?Roleid=" + currentRole.id, 'GET', '').success(function (data) {
            console.log(data);
            if (data.length > 0) {
                $('#confirmModal').modal('hide');
                alert('Role is associated with users!.. please remove dependencies.')
            }
            else {
                RoleFactory.GetUserRoles(currentRole.id).success(function (userrole) {
                    if (userrole.length > 0) {
                        toaster.pop('warning', "Warning", "This role cannot be deleted as there are users mapped to it. Please remove the mappings and then delete.", null);
                        $('#confirmModal').modal('hide');
                    }
                    else {
                        RoleFactory.DeleteRole(currentRole).success(function () {
                            $scope.GetAllRoles();
                            $scope.RoleRight = null;
                            toaster.pop('success', "Success", "Role deleted successfully", null);
                            $('#confirmModal').modal('hide');

                        }).error(function (error) {
                            console.log('Error occurred when deleting Role');
                        });
                    }

                }).error(function (error) {
                    console.log('Error occurred when fetching User - Role mapping');
                });
            }
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    //---Dual list control---//

    // init
    $scope.selectedA = [];
    $scope.selectedB = [];
    $scope.listA = [];
    $scope.listB = [];
    $scope.checkedA = false;
    $scope.checkedB = false;

    function reset() {
        $scope.selectedA = [];
        $scope.selectedB = [];
        //$scope.toggle = 0;
    }

    $scope.GetLists = function () {
        $scope.listA = [];
        $scope.listB = [];

        if ($scope.role != null) {
            console.log('role scope is not null');
            var unselectedRights = JSON.parse(JSON.stringify($scope.Rights));
            RoleFactory.GetRoleRightMapping($scope.role.id).success(function (data) {
                for (i = 0; i < data.length; i++) {
                    var rightName = $scope.GetRightName(data[i].RightID);
                    if (rightName != '') {
                        //for (var j = 0; j < $scope.listB.length; j++) {
                        //    if (data[j].RightID == $scope.listB[j].RightID) {
                        //        $scope.listB.splice(j, 1);
                        //    }
                        //}
                        $scope.listB.push({ 'RightID': data[i].RightID, 'RightName': rightName });
                        var delId = arrayObjectIndexOf(unselectedRights, data[i].RightID);
                        unselectedRights.splice(delId, 1);
                    }
                }
            });
            $scope.listA = unselectedRights;
        }
        else {
            console.log('role scope is null');
            $scope.listA = JSON.parse(JSON.stringify($scope.Rights));
            console.log('list A count after: ' + $scope.listA.length);
            $scope.listB = [];
        }
    }

    function arrayObjectIndexOf(myArray, searchTerm) {
        for (var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i].RightID == searchTerm) {
                return i;
            }
        }
        return -1;
    }

    $scope.stateBChanged = function (isChecked, rightID) {
        if (isChecked == true) {
            $scope.selectedB.push(rightID);
        }
        else {
            var delId = arrayObjectIndexOf($scope.selectedB, rightID);
            $scope.selectedB.splice(delId, 1);
        }
    }
    $scope.stateAChanged = function (isChecked, rightID) {
        if (isChecked == true) {
            $scope.selectedA.push(rightID);
        }
        else {
            var delId = arrayObjectIndexOf($scope.selectedA, rightID);
            $scope.selectedA.splice(delId, 1);
        }
    }

    $scope.AlltoA = function () {
        if ($scope.selectedA.length == 0) {
            $scope.selectedB = [];
            angular.forEach($scope.listB, function (value, key) {
                $scope.selectedB.push(value.RightID);
            })
            $scope.bToA();
        }
    }

    $scope.AlltoB = function () {
        if ($scope.selectedB.length == 0) {
            $scope.selectedA = [];
            angular.forEach($scope.listA, function (value, key) {
                $scope.selectedA.push(value.RightID);
            })
            $scope.aToB();
        }
    }

    $scope.aToB = function () {
        console.log('a to b');
        if ($scope.selectedB.length == 0) {
            var items = JSON.parse(JSON.stringify($scope.Rights));
            for (var i = 0; i < $scope.selectedA.length; i++) {
                var moveId = arrayObjectIndexOf(items, $scope.selectedA[i]);
                $scope.listB.push(items[moveId]);
                var delId = arrayObjectIndexOf($scope.listA, $scope.selectedA[i]);
                $scope.listA.splice(delId, 1);
                console.log('list A count after: ' + $scope.listA.length);
                console.log('list B count after: ' + $scope.listB.length);
            }
            reset();
        }
    };

    $scope.bToA = function () {
        console.log('b to a');
        if ($scope.selectedA.length == 0) {
            for (var i = 0; i < $scope.selectedB.length; i++) {
                var moveId = arrayObjectIndexOf($scope.Rights, $scope.selectedB[i]);
                $scope.listA.push($scope.Rights[moveId]);
                var delId = arrayObjectIndexOf($scope.listB, $scope.selectedB[i]);
                $scope.listB.splice(delId, 1);
                console.log('list B count after: ' + $scope.listB.length);
                console.log('list A count after: ' + $scope.listA.length);
            }
            reset();
        }
    };

    //--- End of Dual List---//

    $scope.GetAllRoles();
    $scope.GetAllRights();
    $scope.IsPageReadOnly();
}]);

ReportApp.factory('RoleFactory', ['$http', function ($http) {
    var URL = 'Main/';
    var RoleFactory = {
        GetRoles: function () {
            return $http.get(URL + 'roles?roleId=');
        },
        GetRole: function (roleId) {
            return $http.get(URL + 'roles?roleId=' + roleId);
        },
        GetUserRoles: function (roleId) {
            return $http.get(URL + 'GetUserRoles?roleId=' + roleId);
        },
        GetRights: function () {
            return $http.get(URL + 'GetRights?right=');
        },
        GetUser: function (userid) {
            return $http.get(URL + 'getusers?userId=' + userid);
        },
        AddRole: function (role) {
            return $http.post(URL + 'AddRole', role);
        },
        AddRoleRightMapping: function (roleright) {
            return $http.post(URL + 'AddRoleRightMapping', roleright);
        },
        ModifyRoleRight: function (roleright) {
            return $http.post(URL + 'ModifyRoleRight', roleright);
        },
        DeleteRole: function (roleright) {
            return $http.post(URL + 'DeleteRole', roleright);
        },

        GetRoleRightMapping: function (roleId) {
            return $http.get(URL + 'GetRoleRightMapping?roleId=' + roleId);
        }

    };
    return RoleFactory;
}]);

