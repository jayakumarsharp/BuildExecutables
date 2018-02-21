ReportApp.controller('UserController', ['$scope', '$rootScope', '$window', '$location', 'UserFactory', 'reportFactory', '$timeout', 'ApiCall', 'RoleFactory', 'toaster', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', '$sce', '_', function ($scope, $rootScope, $window, $location, UserFactory, reportFactory, $timeout, ApiCall, RoleFactory, toaster, $compile, DTOptionsBuilder, DTColumnBuilder, $sce, _) {
    $scope.data = [];
    $scope.dtOptions = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow)
    .withOption('rowCallback', rowCallback1);
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('userId').withTitle('UserId'),
        DTColumnBuilder.newColumn('UserName').withTitle('User Name'),
        DTColumnBuilder.newColumn('EmailId').withTitle('EmailId'),
        DTColumnBuilder.newColumn('checked').withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];

    $scope.dtOptions1 = DTOptionsBuilder.fromSource()
        .withPaginationType('full_numbers').withOption('createdRow', createdRow)
    .withOption('rowCallback', rowCallback);

    $scope.dtColumns1 = [
       DTColumnBuilder.newColumn('userId').withTitle('UserId'),
       DTColumnBuilder.newColumn('UserName').withTitle('UserName'),
       DTColumnBuilder.newColumn('EmailId').withTitle('EmailId'),
          DTColumnBuilder.newColumn('RoleName').withTitle('Role'),
        //DTColumnBuilder.newColumn('RegionName').withTitle('Region'),
        //DTColumnBuilder.newColumn('CountryName').withTitle('Country'),
        //DTColumnBuilder.newColumn('BusinessSector').withTitle('BusinessSector'),
       DTColumnBuilder.newColumn('userId').withTitle('Actions').notSortable()
           .renderWith(actionsHtml1)
    ];
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    function actionsHtml1(data, type, full, meta) {
        return '<a  class="test" ><img src="images/edit.png"></a>' +
            '&nbsp;<a  class="view"><img style="width:24px;height:24px;" src="images/eyeicon.png"></a>';
    }
    function actionsHtml(data, type, full, meta) {
        if (data)
            return '<input type="checkbox" class="checkclick"  checked />';
        else
            return '<input type="checkbox" class="checkclick" />';
    }
    function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        $('.test', nRow).unbind('click');
        $('.test', nRow).bind('click', function () {
            $scope.$apply(function () {
                $scope.EditUser(aData.userId);
            });
        });

        $('.view', nRow).unbind('click');
        $('.view', nRow).bind('click', function () {
            $scope.$apply(function () {
                $scope.GetUser(aData.userId);
            });
        });
        //$('.checkclick', nRow).unbind('click');
        //$('.checkclick', nRow).bind('click', function () {
        //    $scope.$apply(function () {
        //        $scope.chkChanged(aData);
        //    });
        //});
        return nRow;
    }
    function rowCallback1(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        $('.checkclick', nRow).unbind('click');
        $('.checkclick', nRow).bind('click', function () {
            $scope.$apply(function () {
                $scope.chkChanged(aData);
            });
        });
        return nRow;
    }

    $scope.UpdatedUserTypes = [];
    $scope.selectedSBU = {};
    $scope.selectedRole = {};
    $scope.selectedStatus = {};
    $scope.InvalidMessage = '';
    $scope.Error = {};
    $scope.user = {};
    $scope.User = {};
    $scope.EditedUser = {};
    $scope.Users = [];
    $scope.UsersView = [];
    $scope.ADUsers = [];
    $scope.Roles = [];
    $scope.IsReadOnly = false;
    $scope.IsUserSCHead = function () {
        UserFactory.GetUser($rootScope.UserInfo.user.userId).success(function (data) {
            if (data.TypeId == '8') {
                $scope.IsSCUser = true;
            }
        }).error(function (err) {
            $scope.IsSCUser = false;
        });
    };
    $scope.stateChanged = function (selectedType) {
        if (selectedType.Id != undefined) {
            if (selectedType.Id == 2) {
                $scope.BillingSBU = $scope.OnlySBU;
                return;
            }
            else {
                $scope.BillingSBU = $scope.AllSBU;
                return;
            }
        }
        else if (selectedType.TypeID == 13 || selectedType.TypeID == 14 || selectedType.TypeID == 1 || selectedType.TypeID == 2 || selectedType.TypeID == 5 || selectedType.TypeID == 3 || selectedType.TypeID == 4) {
            $scope.SBU = $scope.OnlySBU;
        }
        else {
            $scope.SBU = $scope.AllSBU;
        }
    },

    $scope.ConvertToUserTypes = function (data) {
        $scope.UserTypes = [];
        angular.forEach(data, function (value, key) {
            $scope.UserTypes.push({ 'userId': value.userId, 'UserName': value.UserName, 'EmailId': value.EmailId, 'checked': false });
        });
        $scope.dtOptions.data = $scope.UserTypes;
    };
    $scope.GetAllRoles = function () {
        RoleFactory.GetRoles().success(function (data) {
            $scope.Roles = data;
        }).error(function (error) {
            $scope.Error = error;
        });
        ApiCall.MakeApiCall("GetAllBusinessLine?BusinessLineId=", 'GET', '').success(function (data) {
            $scope.BusinessLineList = data;
            bindBusinessSectordata($scope.BusinessLineList);
        }).error(function (error) {
            $scope.Error = error;
        });
        ApiCall.MakeApiCall("GetAllCountry?CountryId=", 'GET', '').success(function (data) {
            console.log(data);
            $scope.CountryMasterList = data;
            bindCountrydata($scope.CountryMasterList);
        }).error(function (error) {
            $scope.Error = error;
        })
        ApiCall.MakeApiCall("GetAllRegion?RegionId=", 'GET', '').success(function (data) {
            console.log(data);
            $scope.RegionMasterList = data;
            bindRegiondata($scope.RegionMasterList);
        }).error(function (error) {
            $scope.Error = error;
        })
    };
    $scope.ViewData = {};
    function Getusermappingdata(userid) {
        ApiCall.MakeApiCall("GetusercountryMapping?userId=" + userid, 'GET', '').success(function (data) {
            $scope.ViewData.country = data.map(function (val) {
                return val.CountryName;
            }).join(',');
            assignCountry(data);
        }).error(function (error) {
            $scope.Error = error;
        })
        ApiCall.MakeApiCall("GetuserRegionMapping?userId=" + userid, 'GET', '').success(function (data) {

            $scope.ViewData.region = data.map(function (val) {
                return val.RegionName;
            }).join(',');
            assignRegion(data);
        }).error(function (error) {
            $scope.Error = error;
        })
        ApiCall.MakeApiCall("GetBusinessMapping?userId=" + userid, 'GET', '').success(function (data) {
            $scope.ViewData.businessmapping = data.map(function (val) {
                return val.BusinessLine;
            }).join(',');
            assignBusinessSector(data)
        }).error(function (error) {
            $scope.Error = error;
        });
    }

    $scope.GetADUsers = function () {
        UserFactory.GetADUsers().success(function (data) {
            $scope.ADUsers = data;
            $scope.ConvertToUserTypes(data);
        }).error(function (error) {
            $scope.Error = error;
        });
    };
    $scope.GetAllUsers = function () {
        $scope.UsersView = [];
        UserFactory.GetUsers().success(function (data) {
            $scope.Users = data;
            angular.forEach($scope.Users, function (value, key) {
                $scope.UsersView.push({
                    'userId': value.userId, 'UserName': value.UserName, 'EmailId': value.EmailId, 'RoleName': value.RoleName,
                    'RegionName': value.RegionName,
                    'CountryName': value.CountryName,
                    'BusinessSector': value.BusinessSector,
                    'Status': value.Status
                })
            })

            $scope.dtOptions1.data = $scope.UsersView;

        }).error(function (error) {
            $scope.Error = error;
        });
    };
    $scope.GetUser = function (userId) {
        UserFactory.GetUser(userId).success(function (data) {
            $scope.User = data[0];
            Getusermappingdata(userId);
            $('#viewModal').modal('show');
        }).error(function (error) {
            $scope.Error = error;
        })
    };

    $scope.CreateTempUser = function (user) {
        $scope.InvalidMessage = '';
        UserFactory.GetUser(user.userId).success(function (data) {
            if (data.length > 0) {
                $scope.userId = '';
                $scope.InvalidMessage = 'The UserID already exists!'
            }
            else {
                user.CountryList = $scope.multiselectCountry.selected;
                user.RegionList = $scope.multiselectRegion.selected;
                user.BusinessSectorList = $scope.multiselectBusinessSector.selected;
                UserFactory.CreateTempUser(user).success(function (data) {
                    $scope.GetAllUsers();
                    $('#userCreateModel').modal('hide');
                }).error(function (err) {
                    $scope.Error = err;
                });
            }
        }).error(function (err) {
            $scope.Error = err;
        });
    };
    $scope.EditUser = function (userId) {
        $scope.EditedUser = {};
        cleardata();
        UserFactory.GetUser(userId).success(function (data) {
            $scope.user = data[0];
            $scope.editMode = true;
            $('#editModel').modal('show');
        }).error(function (error) {
            $scope.Error = error;
        })
        Getusermappingdata(userId);
    };

    function cleardata() {
        $scope.multiselectBusinessSector.selected = [];
        $scope.multiselectCountry.selected = [];
        $scope.multiselectRegion.selected = [];

    }

    $scope.showtempadd = function () {
        cleardata();
        bindBusinessSectordata($scope.BusinessLineList);
        bindCountrydata($scope.CountryMasterList);
        bindRegiondata($scope.RegionMasterList);
        // angular.element(document.querySelector('#loader')).removeClass('hide');
        $scope.InvalidMessage = '';
        $scope.user = {};
        $('#userCreateModel').modal('show');
    };

    //Modal popup events
    $scope.showadd = function () {
        angular.element(document.querySelector('#loader')).removeClass('hide');
        $scope.UpdatedUserTypes = [];
        $scope.user.showSelected = false;
        $scope.user.selectedType = {};
        $scope.user.selectedCountry = {};
        $scope.user.selectedRegion = {};
        $scope.user.selectedRole = {};
        $scope.user.selectedStatus = {};
        $scope.user.selectedBusinessSector = {};
        $scope.user = {};
        $scope.GetADUsers();
        $scope.editMode = false;
        $('#userModel').modal('show');
        $timeout(function () {
            angular.element(document.querySelector('#loader')).addClass('hide');
        }, 2500);
        window.setTimeout(function () {
            $(window).resize();
            $(window).resize();
        }, 1000);

    };

    //Model popup events
    $scope.showconfirm = function (data) {
        $scope.user = data;
        $('#confirmModal').modal('show');
    };

    // add User
    $scope.add = function (v) {
        var currentUser = v;
        if (currentUser != null && currentUser.UserName != null) {
            currentUser.userId = currentUser.UserName;
            currentUser.userName = currentUser.UserName;
            currentUser.password = currentUser.UserName;
            currentUser.emailId = currentUser.EmailId;
            currentUser.mobileNumber = currentUser.MobileNumber;
            $scope.user = currentUser;
            UserFactory.AddUser(currentUser).success(function (data) {
                $scope.addMode = false;
                $scope.GetAllUsers();
                $scope.user = {};
                $('#userModel').modal('hide');
            }).error(function (data) {
                $scope.error = "An Error has occured while Adding user! " + data.ExceptionMessage;
            });
        }
    };

    $scope.cancel = function () {
        $scope.user = {};
        $('#userModel').modal('hide');
    }

    $scope.chkChanged = function (event) {
        var isAddedAlready = false;
        if (event.checked == false) {
            angular.forEach($scope.UpdatedUserTypes, function (value, key) {
                if (event.userId == value.userId) {
                    isAddedAlready = true;
                }
            });
            if (!isAddedAlready)
                $scope.UpdatedUserTypes.push({ 'userId': event.userId, 'UserName': event.UserName, 'EmailId': event.EmailId, 'checked': true });
        }
        else {
            for (var i = $scope.UpdatedUserTypes.length - 1; i >= 0; i--) {
                if ($scope.UpdatedUserTypes[i].userId == event.userId) {
                    $scope.UpdatedUserTypes.splice(i, 1);
                }
            }
        }
        event.checked = !event.checked;
    }

    //Display only selected users
    $scope.showSelectedUsers = function (isChecked) {
        if (isChecked) {
            console.log('setting row data');
            $scope.dtOptions.data = $scope.UpdatedUserTypes;
        }
        else {
            $scope.dtOptions.data = $scope.UserTypes;
        }
    }

    // Add Users
    $scope.getSelected = function (selectedRole, selectedregion, selectedcoutry, selectedBS) {
        try {
            var ar = $scope.UpdatedUserTypes;
            $scope.UpdatedUserTypes = [];
            console.log('Total selected: ' + ar.length);
            if (ar.length == 0) {
                toaster.pop('warning', "Warning", "There are no users selected", null);
            }
            else {
                var successcount = 0;
                for (var i = 0; i < ar.length; i++) {
                    if (ar[i] != null && ar[i].UserName != null && ar[i].EmailId) {
                        console.log('Valid user: ' + ar[i].UserName);
                        $scope.user = ar[i];
                        $scope.user.RoleId = selectedRole.id;
                        $scope.user.BusinessSectorId = selectedBS.Id;
                        $scope.user.CountryId = selectedcoutry.Id;
                        $scope.user.RegionId = selectedregion.Id;

                        UserFactory.AddUser($scope.user).success(function (data) {
                            $scope.addMode = false;
                            $scope.GetADUsers();
                            $scope.user = {};
                            toaster.pop('success', "Success", "User added successfully", null);
                            var n = parseInt(ar.length);
                            n = n - 1;
                            if (successcount == n) {
                                $scope.GetAllUsers();
                            }
                            successcount++;
                            $('#userModel').modal('hide');

                        }).error(function (data) {
                            $scope.error = "An Error has occured while Adding user! " + data.ExceptionMessage;
                        });
                    }
                    else {
                        //alert('Please select both the Role and SBU');
                        toaster.pop('warning', "Warning", "Please select both the Role and SBU", null);
                    }
                }
            }
        }
        catch (ex) {
            console.log("Error occurred: " + ex);
        }
    };

    $scope.ModifyUser = function (data) {
        data.CountryList = $scope.multiselectCountry.selected;
        data.RegionList = $scope.multiselectRegion.selected;
        data.BusinessSectorList = $scope.multiselectBusinessSector.selected;
        UserFactory.ModifyUser(data).success(function (data) {
            $scope.GetAllUsers();
            $scope.user = {};
            toaster.pop('success', "Success", "Modified User successfully", null);
            $('#editModel').modal('hide');

        }).error(function (error) {
        });
    };

    $scope.ModifySelfUser = function () {
        $('#roleChange').modal('hide');

        $scope.EditedUser.userName = $scope.EditedUser.UserName;
        // data.password = $scope.EditedUser.UserName;
        $scope.EditedUser.emailId = $scope.EditedUser.EmailId;
        $scope.EditedUser.mobileNumber = $scope.EditedUser.MobileNumber;

        UserFactory.ModifyUser($scope.EditedUser).success(function (data) {
            $scope.GetAllUsers();
            //reset form
            $scope.user = {};
            $scope.EditedUser = {};
            $('#editModel').modal('hide');
            //reportFactory.Logout($rootScope.UserInfo.user.userId).success(function (data) {
            //    $rootScope.UserInfo = null;
            //    $rootScope.isAuth = false;
            //    $location.path('/');
            //    console.log('Logged out successfully');
            //}).error(function (error) {
            //    console.log('Failed to log out properly. Error: ' + error);
            //})

        }).error(function (error) {
        });
    };

    $scope.delete = function () {
        var currentUser = $scope.user;
        currentUser.userId = currentUser.userId;
        UserFactory.DeleteUser(currentUser).success(function () {

            $scope.GetAllUsers();
            //reset form
            $scope.user = {};
            // $scope.adduserform.$setPristine(); //for form reset
            toaster.pop('success', "Success", "User deleted successfully", null);
            $('#confirmModal').modal('hide');
        }).error(function (error) {
        });
    };
    $scope.ChangePassword = function () {
        UserFactory.ChangePassword($scope.User).success(function (data) {

        }).error(function (error) {

        });
    };
    // bind code start
    $scope.multiselectRegion = {
        selected: [],
        options: [],
        config: {
            hideOnBlur: false,
            showSelected: false,
            itemTemplate: function (item) {
                return $sce.trustAsHtml(item.name);
            },
            labelTemplate: function (item) {
                return $sce.trustAsHtml(item.name);
            }
        }
    };
    $scope.multiselectBusinessSector = {
        selected: [],
        options: [],
        config: {
            hideOnBlur: false,
            showSelected: false,
            itemTemplate: function (item) {
                return $sce.trustAsHtml(item.name);
            },
            labelTemplate: function (item) {
                return $sce.trustAsHtml(item.name);
            }
        }
    };
    $scope.multiselectCountry = {
        selected: [],
        options: [],
        config: {
            hideOnBlur: false,
            showSelected: false,
            itemTemplate: function (item) {
                return $sce.trustAsHtml(item.name);
            },
            labelTemplate: function (item) {
                return $sce.trustAsHtml(item.name);
            }
        }
    };
    function assignCountry(data) {
        for (var i = 0; i < data.length > 0; i++) {
            $scope.multiselectCountry.selected.push({ id: data[i].Id, name: data[i].CountryName })
        }
        bindCountrydata($scope.CountryMasterList);
    }
    function assignRegion(data) {
        for (var i = 0; i < data.length > 0; i++) {
            $scope.multiselectRegion.selected.push({ id: data[i].Id, name: data[i].RegionName })
        }
        bindRegiondata($scope.RegionMasterList);
    }

    function assignBusinessSector(data) {
        for (var i = 0; i < data.length > 0; i++) {
            $scope.multiselectBusinessSector.selected.push({ id: data[i].Id, name: data[i].BusinessLine })
        }
        bindBusinessSectordata($scope.BusinessLineList);
    }

    function bindCountrydata(list) {
        $scope.multiselectCountry.options = list.map(function (item) {
            return {
                name: item.CountryName,
                id: item.Id
            };
        });
    }

    function bindRegiondata(list) {
        $scope.multiselectRegion.options = list.map(function (item) {
            return {
                name: item.RegionName,
                id: item.Id
            };
        });
    }

    function bindBusinessSectordata(list) {
        $scope.multiselectBusinessSector.options = list.map(function (item) {
            return {
                name: item.BusinessLine,
                id: item.Id
            };
        });
    }

    $scope.IsPageReadOnly = function () {
        UserFactory.getloggedusername().success(function (data) {
            var userId = data;
            if (data != '') {
                reportFactory.GetRightsList(userId).success(function (data) {
                    var isRead = true;
                    $scope.IsReadOnly = true;
                    angular.forEach(data, function (value, key) {
                        if (value.RightName == 'User Management Write') {
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
    }
    $scope.GetAllRoles();
    $scope.GetAllUsers();
    $scope.IsPageReadOnly();
}]);

ReportApp.factory('UserFactory', ['$http', function ($http) {
    var Url = 'Main/';
    var UserFactory = {
        GetUsers: function () {
            return $http.get(Url + 'getusers?userid=');
        },

        GetADUsers: function () {
            return $http.get(Url + 'getADuser');
        },

        GetUser: function (userid) {
            return $http.get(Url + 'getusers?userid=' + userid);
        },

        AddUser: function (user) {
            return $http.post(Url + 'CreateUser', user);
        },
        CreateTempUser: function (user) {
            return $http.post(Url + 'CreateTempUser', user);
        },
        ModifyUser: function (user) {
            return $http.post(Url + 'ModifyUser', user);
        },
        DeleteUser: function (user) {
            return $http.post(Url + 'DeleteUser', user);
        },

        getloggedusername: function () {
            return $http.get(Url + 'getloggedusername');
        },
        GetUserRoles: function (userId) {
            return $http.get(Url + 'GetUserRoles/?UserId=' + userId);
        },

        GetInactiveUsers: function () {
            return $http.get(Url + '/GetInactiveUsers');
        },
    };
    return UserFactory;
}]);
