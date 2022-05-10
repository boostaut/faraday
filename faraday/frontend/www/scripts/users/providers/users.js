// Faraday Penetration Test IDE
// Copyright (C) 2013  Infobyte LLC (http://www.infobytesec.com/)
// See the file 'doc/LICENSE' for the license information

// Description : class used to fetch user data from the ServerAPI 
// Author : Bastien Chatelain (T-3a) - HEIA-FR - SEMESTER PROJECT 6
// last modification date : 10.05.2022

angular.module('faradayApp')
    .factory('usersFact', ['BASEURL', 'ServerAPI', '$http', '$q', '$rootScope', function(BASEURL, ServerAPI, $http, $q, $rootScope) {
        var usersFact = {};
        //workspacesFact.workspace = '';
        /*
        workspacesFact.list = function() {
            var deferred = $q.defer();
            ServerAPI.getWorkspacesNames().
                then(function(response) {
                    var names = [];
                    response.data.forEach(function(workspace){
                        names.push(workspace.name);
                    });
                    deferred.resolve(names);
                }, errorHandler);
            return deferred.promise;
        };
        */
        usersFact.getUsers = function() {
            console.log("usersFact getUsers")
            var deferred = $q.defer();
            ServerAPI.getAllUsers().
                then(function(response)
                    {
                        console.log("getUsers")
                        console.log("response = " + response.data)
                        deferred.resolve(JSON.parse(response.data))
                    });
            return deferred.promise;
        };
        /*
        returnStatus = function(data) {
            return $q.when(data.status);
        };

        workspacesFact.get = function(workspace_name) {
            var deferred = $q.defer();
            ServerAPI.getWorkspace(workspace_name).
                then(function(ws) {
                    deferred.resolve(ws.data);
                }, function() {
                    deferred.reject();
                });
            return deferred.promise;
        };

        workspacesFact.getDuration = function(workspace_name) {
            var deferred = $q.defer();
            ServerAPI.getWorkspace(workspace_name).then(function(workspace) {
                deferred.resolve({
                    "start": workspace.data.duration.start_date,
                    "end": workspace.data.duration.end_date
                });
            });
            return deferred.promise;
        };

        workspacesFact.exists = function(workspace_name) {
            var deferred = $q.defer();
            ServerAPI.getWorkspace(workspace_name).then(
                function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response);
            });
            return deferred.promise;
        };

        errorHandler = function(response) {
            if(typeof(response) == "object")
                return $q.reject(response.data.reason.replace("file", "workspace"));
            else if(typeof(response) == "string")
                return $q.reject(response);
            else
                return $q.reject("Something bad happened");
        };

        workspacesFact.put = function(workspace) {
            return ServerAPI.createWorkspace(workspace.name, workspace);
        };

        indexOfDocument = function(list, name) {
            var ret = -1;
            list.forEach(function(item, index) {
                if(item._id == name) {
                    ret = index;
                }
            });
            return ret;
        };

        workspacesFact.update = function(workspace, wsName) {
            var deferred = $q.defer();
            ServerAPI.updateWorkspace(workspace, wsName).then(function(data){
                workspace._rev = data.rev;
                deferred.resolve(workspace);
            }, function(err){
                deferred.reject(err);
            });
            return deferred.promise;
        };

        workspacesFact.delete = function(workspace_name) {
            var deferred = $q.defer();
            ServerAPI.deleteWorkspace(workspace_name).then(function(data) {
                deferred.resolve(workspace_name);
            }, function() {
                deferred.reject();
            });
            return deferred.promise;
        };

        workspacesFact.activate = function(wsName) {
            var deferred = $q.defer();
            ServerAPI.activateWorkspace(wsName).then(function(data){
                deferred.resolve(data);
            }, function(err){
                deferred.reject(err);
            });
            return deferred.promise;
        };

        workspacesFact.deactivate = function(wsName) {
            var deferred = $q.defer();
            ServerAPI.deactivateWorkspace(wsName).then(function(data){
                deferred.resolve(data);
            }, function(err){
                deferred.reject(err);
            });
            return deferred.promise;
        };

        workspacesFact.readOnlyToogle = function(wsName) {
            var deferred = $q.defer();
            ServerAPI.readOnlyToogle(wsName).then(function(data){
                deferred.resolve(data);
            }, function(err){
                deferred.reject(err);
            });
            return deferred.promise;
        };

        workspacesFact.changeWorkspace = function (workspace) {
            this.workspace = workspace;
            this.broadcastItem();
        };

        workspacesFact.getWorkspace = function () {
            return workspacesFact.workspace;
        };

        workspacesFact.broadcastItem = function () {
            $rootScope.$broadcast('handleChangeWSBroadcast');
        };
        */

        return usersFact;
    }]);
