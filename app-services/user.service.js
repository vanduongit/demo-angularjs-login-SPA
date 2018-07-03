(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http','host','$rootScope','StatusService','FlashService'];
    function UserService($http,host,$rootScope,StatusService,FlashService) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.resetPwdAgent = resetPwdAgent;
        service.changePwdAgent = changePwdAgent;
        service.userUpdateProfile = userUpdateProfile;
        service.getCurrentUser = getCurrentUser;

        return service;

        function GetAll() {
            return $http.get('/api/users').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetById(id) {
            return $http.get('/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByUsername(username) {
            return $http.get('/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }

        function Create(user) {
            //return $http.post('/api/users', user).then(handleSuccess, handleError('Error creating user'));            
            let url = host('EbsAgentWS/services/apis/reguser');
            url = StatusService.generateQueryParams(url,user);
            return $http({
                method : 'GET',
                url : url 
            })
        }

        function Update(user) {
            return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        function resetPwdAgent(){
            let url = host(`EbsAgentWS/services/apis/resetpin?loginname=${_getCurrentUserName()}`);
            return $http.get(url).then(function(res){
                if(res.status == 200){                    
                    let data = res.data;
                    if(!StatusService.isBlank(data)){
                        let tokens = data.split(":");
                        FlashService.success("response: newPassword=" + tokens[0]);
                        FlashService.success("response: status msg=" + tokens[1]);
                        FlashService.success("*** ResetAgentPassword ***: New/Temporary Password=[" + tokens[0] + "], msg=[" + tokens[1] + "]");                            
                    }else{
                        FlashService.error("ResetAgentPassword: No content");
                    }
                    
                }else{
                    StatusService.failStatus(res.status, res.data);
                }
            });
        }

        function changePwdAgent(opass, npass){
            let url = host(`EbsAgentWS/services/apis/ftlogin?opass=${opass}&npass=${npass}`);
            return $http({
                method : 'GET',
                url : url,
                headers : {
                    Authorization : btoa(`agentid=${_getCurrentUserName()}`)
                }
            }).then(function(res){
                if(res.status == 200){                    
                    let data = res.data;
                    if(!StatusService.isBlank(data)){                 
                        FlashService.success("*** FirstTimeAgentLogin ***: status=[" + data + "]");                            
                    }else{
                        FlashService.error("FirstTimeAgentLogin: No content");
                    }
                    
                }else{
                    StatusService.failStatus(res.status, res.data);
                }
            });
        }

        function userUpdateProfile(user){
            var url = host('EbsUserWS/services/apis/upusrgenprof');
            url = StatusService.generateQueryParams(url,user);
            return $http({
                method : "GET",
                url : url
            }).then(function(res){
                console.log(res);
                if(res.status == 200){                    
                    let data = res.data;
                    if(!StatusService.isBlank(data)){                 
                        FlashService.success("UpdateUserGeneralProfile: status=[" + JSON.stringify(data) + "]");                            
                    }else{
                        FlashService.error("UpdateUserGeneralProfile: No content");
                    }                    
                }else{
                    StatusService.failStatus(res.status, res.data);
                }
            });
        }

        function _getCurrentUserName(){
            return $rootScope.globals.currentUser.username;
        }

        function getCurrentUser(){
            return $rootScope.globals.currentUser;
        }

        // private functions

        

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
