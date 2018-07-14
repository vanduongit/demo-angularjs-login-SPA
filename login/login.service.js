(function () {
    'use strict';

    angular
        .module('app')
        .factory('LoginService', LoginService);
        LoginService.$inject = ['$http','host','md5','AuthenticationService','StatusService'];

    function LoginService($http,host, md5, AuthenticationService, StatusService) {
        
        return {
            loginAgent : loginAgent,
            loginUser : loginUser
        }

        function loginAgent(username, pwd){
            let url = host("/EbsAgentWS/services/apis/login");
            let pwdmd5 = md5.createHash(pwd);
            let authoStr = `acctid=${username},pass=${pwdmd5}`;
            console.log(pwdmd5);
            console.log(btoa(authoStr));
            return $http({
                url : url,
                method : "GET",
                headers : {
                    "Authorization" : btoa(authoStr)
                }
            }).then(function(res){
                let data = res.data;
                let status = res.status;
                if(StatusService.isOkData(status)){                                        
                    if(StatusService.isBlank(data)){                        
                        let tokens = data.split(",");
                        let accessToken = tokens[0].split(":")[1].replaceAll("\"", "");
                        console.log("response: accessToken=" + accessToken);
                        let refreshToken = tokens[2].split(":")[1].replaceAll("\"", "");
                        console.log("response: refreshToken=" + refreshToken);                    
                        let nWhoLoggedIn = 1;    // Agent logged in
                        AuthenticationService.SetCredentials(username, accessToken, refreshToken, "agent");
                    }else{
                        FlashService.Error("response: No content");
                    }
                    
                }else{
                    StatusService.failStatus(status,data);
                }
                return res;
            })
        }

        function loginUser(username, pwd){
            let url = host("/EbsUserWS/services/apis/login");
            let pwdmd5 = md5.createHash(pwd);
            let authoStr = `acctid=${username},pass=${pwdmd5}`;
            return $http({
                url : url,
                method : "GET",
                headers : {
                    AUTHORIZATION : btoa(authoStr),
                    Access-Control-Allow-Origin
                }
            }).then(function(res){
                let data = res.data;
                let status = res.status;
                if(StatusService.isOkData(status)){
                    if(StatusService.isBlank(data)){
                        let tokens = data.split(",");
                        let accessToken = tokens[0].split(":")[1].replaceAll("\"", "");
                        console.log("response: accessToken=" + accessToken);
                        let refreshToken = tokens[2].split(":")[1].replaceAll("\"", "");
                        console.log("response: refreshToken=" + refreshToken);
                        let nWhoLoggedIn = 1;    // Agent logged in
                        AuthenticationService.SetCredentials(username, accessToken, refreshToken, "user");
                    }else{
                        FlashService.Error("response: No content");
                    }

                }else{
                    StatusService.failStatus(status,data);
                }
                return res;
            })
        }
    }
})();