// Faraday Penetration Test IDE
// Copyright (C) 2013  Infobyte LLC (http://www.infobytesec.com/)
// See the file 'doc/LICENSE' for the license information

angular.module('faradayApp') // import ServerAPI to do HTTP request
    .controller('usersCtrl', ['$uibModal', '$scope', '$q','usersFact', 'dashboardSrv', '$location', '$cookies', 'ServerAPI', 'workspacesFact', // PS6 CODE
        function ($uibModal, $scope, $q, usersFact, dashboardSrv, $location, $cookies, ServerAPI, workspacesFact) { // PS6 CODE
            $scope.users
            $scope.workspaces = []
            $scope.currentEditedUserId
            $scope.editedUser
            $scope.newUser = {
                "name":"",
                "username":"",
                "password":"",
                "repeated_password":"",
                "role_id":"0",
                "workspaces_id":[]
            }

            $scope.init = function () {
                console.log("usersCtrl init")
                $scope.$watch(loginSrv.isAuth, function (newValue) {
                    loginSrv.getUser().then(function (user) {
                        $scope.auth = newValue;
                        ServerAPI.getUserById(user.user_id).then(function (response) {
                            $scope.current_user = JSON.parse(response.data)[0]
                            usersFact.getUsers().then(function (users) {
                                users.forEach((user, index) => {
                                    users[index].role_id = user.role_id.toString()
                                    users[index].workspaces_id = user.workspaces_id.map(String)
                                });
                                $scope.users = users
                            });
                        })
                    });
                });
                

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

            $scope.addUser = function () {
                
                if($scope.newUser.username == "" | $scope.newUser.name == "" | $scope.newUser.role_id == "0" |$scope.newUser.workspace == "" | $scope.newUser.password == "" | $scope.newUser.repeated_password == ""){
                    alert("Il faut remplir tous les champs")
                    return
                }
                
                if($scope.newUser.password != $scope.newUser.repeated_password){
                    alert("Les mots de passe ne correspondent pas")
                    return
                }
                
                newUser = {
                    "name":$scope.newUser.name,
                    "username":$scope.newUser.username,
                    "password":$scope.newUser.password,
                    "role_id": parseInt($scope.newUser.role_id),
                    "workspaces_id": $scope.newUser.workspaces_id.map(Number)
                }


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
            
            $scope.deleteUser = function (user_id) {
                ServerAPI.deleteUser(user_id).then(function(response){
                    $scope.init()
                })
            };

            $scope.editUser = function (user) {
                $scope.currentEditedUserId = user.id
                $scope.editedUser = user
                $scope.init()
            };

            $scope.cancelUpdateUser = function () {
                $scope.currentEditedUserId = -1
            }

            $scope.updateUser = function (user) {
                $scope.currentEditedUserId = -1
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

                ServerAPI.updateUser(user).then(function(response){
                    console.log("user successfully updated")
                    $scope.init()
                })
                $scope.init()
            };
            $scope.init();
        }]);
        