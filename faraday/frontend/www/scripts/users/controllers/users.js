// Faraday Penetration Test IDE
// Copyright (C) 2013  Infobyte LLC (http://www.infobytesec.com/)
// See the file 'doc/LICENSE' for the license information

// Description : class for user management
// Author : Bastien Chatelain (T-3a) - HEIA-FR - SEMESTER PROJECT 6
// last modification date : 10.05.2022

angular.module('faradayApp') // import ServerAPI to do HTTP request
    .controller('usersCtrl', ['$uibModal', '$scope', '$q','usersFact', 'dashboardSrv', '$location', '$cookies', 'ServerAPI', 'workspacesFact', // PS6 CODE
        function ($uibModal, $scope, $q, usersFact, dashboardSrv, $location, $cookies, ServerAPI, workspacesFact) { // PS6 CODE
            $scope.users // list of all users
            $scope.workspaces = [] // list of all workspaces
            $scope.currentEditedUserId
            $scope.editedUser
            // object for a new user, used for data binding
            $scope.newUser = {
                "name":"",
                "username":"",
                "password":"",
                "repeated_password":"",
                "role_id":"0",
                "workspaces_id":[]
            }

            $scope.init = function () {
                // get current user details
                $scope.$watch(loginSrv.isAuth, function (newValue) {
                    loginSrv.getUser().then(function (user) {
                        $scope.auth = newValue;
                        ServerAPI.getUserById(user.user_id).then(function (response) {
                            $scope.current_user = JSON.parse(response.data)[0]
                            // get all users
                            usersFact.getUsers().then(function (users) {
                                users.forEach((user, index) => {
                                    // convert number values to String for compatibility with HTML elements
                                    users[index].role_id = user.role_id.toString()
                                    users[index].workspaces_id = user.workspaces_id.map(String)
                                });
                                $scope.users = users
                            });
                        })
                    });
                });
                
                // get all workspaces
                workspacesFact.getWorkspaces().then(function (wss) {
                    $scope.workspaces = []
                    wss.forEach(function (ws) {
                        $scope.workspaces.push(ws)
                    });
                });
            };

            $scope.getWorkspaceNameById = function(id){
                let name = $scope.workspaces.find(function(ws, index){
                    if (ws.id == id){
                        return true;
                    }
                })
                return name;
            }

            // create a new user in the faraday DB
            $scope.addUser = function () {
                
                // check if all user inputs are completed
                if($scope.newUser.username == "" | $scope.newUser.name == "" | $scope.newUser.role_id == "0" |$scope.newUser.workspace == "" | $scope.newUser.password == "" | $scope.newUser.repeated_password == ""){
                    alert("Il faut remplir tous les champs")
                    return
                }
                // check password validity
                if($scope.newUser.password != $scope.newUser.repeated_password){
                    alert("Les mots de passe ne correspondent pas")
                    return
                }
                
                // create new object to send to the Faraday API
                // string are converted in number format to be compatible with the API
                newUser = {
                    "name":$scope.newUser.name,
                    "username":$scope.newUser.username,
                    "password":$scope.newUser.password,
                    "role_id": parseInt($scope.newUser.role_id),
                    "workspaces_id": $scope.newUser.workspaces_id.map(Number)
                }

                // send the new user
                ServerAPI.addUser(newUser).then(function(response){
                    $scope.init()
                    $scope.newUser = {
                        "name":"",
                        "username":"",
                        "password":"",
                        "repeated_password":"",
                        "role_id":"0",
                        "workspaces_id":[]
                    }
                })
            };
            
            // remove a user from the Faraday DB
            $scope.deleteUser = function (user_id) {
                ServerAPI.deleteUser(user_id).then(function(response){
                    $scope.init()
                })
            };

            // start editing a user
            $scope.editUser = function (user) {
                $scope.currentEditedUserId = user.id
                $scope.editedUser = user
                $scope.init()
            };

            // cancel editing of a user, changes are not taken into account
            $scope.cancelUpdateUser = function () {
                $scope.currentEditedUserId = -1
            }

            // confirm user changes
            $scope.updateUser = function (user) {
                $scope.currentEditedUserId = -1 // reset the current edited user
                // create the object to send to the Faraday API
                updatedUser = {
                    "name":user.name,
                    "username":user.username,
                    "password":"",
                    "role_id": parseInt(user.role_id),
                    "workspaces_id": user.workspaces_id.map(Number)
                }
                if (user.password != ""){
                    updatedUser.password = user.password
                }
                // send the update
                ServerAPI.updateUser(user).then(function(response){
                    console.log("user successfully updated")
                    $scope.init()
                })
                $scope.init()
            };
            $scope.init();
        }]);
        