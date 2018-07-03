(function () {
    'use strict';

    angular
        .module('app')
        .factory('LoginService', LoginService);
        LoginService.$inject = ['$http','host','md5','AuthenticationService'];

    function LoginService($http,host, md5, AuthenticationService) {
        
        return {
            loginAgent : loginAgent
        }

        function loginAgent(username, pwd){
            let url = host("/EbsAgentWS/services/apis/login");
            let pwdmd5 = md5.createHash(pwd);
            let authoStr = `acctid=${username},pass=${pwdmd5}`;            
            return $http({
                url:url,
                method : "GET",
                headers : {
                    "Authorization" : btoa(authoStr)
                }
            }).then(function(res){
                if(res.status == 200){
                    console.log(res.data);
                    if(typeof res.data !== 'undefined' && res.data !== '' && res.data !== null){
                        let data = res.data;
                        let tokens = data.split(",");

                        let accessToken = tokens[0].split(":")[1].replaceAll("\"", "");
                        console.log("response: accessToken=" + accessToken);
                        let refreshToken = tokens[2].split(":")[1].replaceAll("\"", "");
                        console.log("response: refreshToken=" + refreshToken);                    

                        let nWhoLoggedIn = 1;    // Agent logged in
                        AuthenticationService.SetCredentials(accessToken, refreshToken);                        
                    }else{
                        FlashService.Error("response: No content");
                    }
                    
                }else{
                    if (res.status == 204)
                        FlashService.Error("response: No content");
                    else if (res.status == 400)
                        FlashService.Error("response: Bad Request (" + JSON.stringify(data) + ")");
                    else if (res.status == 404)
                        FlashService.Error("response: Not Found (" + JSON.stringify(data) + ")");
                    else if (res.status == 417)
                        FlashService.Error("response: Expectation Failed (" + JSON.stringify(data) + ")");
                    else
                        FlashService.Error("response: Other errors (" + res.status + ") [" + JSON.stringify(data) + "]");
                }
                return res.status;
            })
        }

        
    }
})();