(function(){
    'use strict'

    angular.module('app').factory('SessionService', SessionService);

    SessionService.$inject = ['$http','UserService', 'host', 'StatusService', 'FlashService'];

    function SessionService($http, UserService, host, StatusService, FlashService){

        return {
            extendSession : extendSession
        }

        function extendSession(){
            return $http({
                method : "GET",
                url : host('EbsUserWS/services/apis/extsession')
            }).then(function(res){
                let status = res.status;
                let data = res.data;
                if(StatusService.isOkData(status)){
                    if(!StatusService.isBlank(data)){
                        if(data.isLowerCase() === 'true'){
                            Flash.success("*** UserExtendSession ***: session extension status=Success");
                        }else{
                            Flash.error("*** UserExtendSession ***: session extension status=Failure");
                        }
                    }else{
                        Flash.error("UserExtendSession: No content");
                    }
                }else{
                    StatusService.failStatus(status,res.data);
                }
            });
        }

    }
})();