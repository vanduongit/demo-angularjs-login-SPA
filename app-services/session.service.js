(function(){
    'use strict'

    angular.module('app').factory('SessionService', SessionService);

    SessionService.$inject = ['$http','UserService', 'host', 'StatusService', 'FlashService'];

    function SessionService($http, UserService, host, StatusService, FlashService){

        return {
            extendSession : extendSession,
            checkAccountBalance : checkAccountBalance,
            initOTP : initOTP,
            confirmOTP : confirmOTP,
            initDeposit : initDeposit,
            completeDeposit : completeDeposit
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
                    StatusService.failStatus(status,data);
                }
            });
        }

        function checkAccountBalance(){
            return $http({
                method : "GET",
                url : host('EbsUserWS/services/apis/getacctbal')
            }).then(function(res){                
                let status = res.status;
                let data = res.data;
                if(StatusService.isOkData(status)){
                    if(!StatusService.isBlank(data)){
                        Flash.success("*** CheckUserBalance ***: account balance = " + data.split(":")[1]);                        
                    }else{
                        Flash.error("CheckUserBalance: No content");
                    }
                }else{
                    StatusService.failStatus(status,data);
                }
            });
        }

        function initPinOTP(custacctname, mobileNumber){
            var url = `${host('EbsAgentWS/services/apis/initotp')}?mobile=${mobileNumber}&actionType=deposit`;
            var auth = `${UserService.getCurrentUser().authdata},acctid=${custacctname}`;
            return $http({
                method : "GET",
                Authorization : auth,
                url : url
            }).then(function(res){
                let status = res.status;
                let data = res.data;
                if(StatusService.isOkData(status)){
                    if(!StatusService.isBlank(data)){
                        Flash.success("AgentDepositTopUp(initotp): " + data);
                        return data;                        
                    }else{
                        Flash.error("AgentDepositTopUp: No content");
                        return false;
                    }
                }else{
                    StatusService.failStatus(status,data);
                    return false;
                }
            })
        }

        function confirmOTP(custacctname, mobileNumber, pinOTP){
            let url = `${host('EbsAgentWS/services/apis/confotp')}?mobile=${mobileNumber}$pin=${pinOTP}&actionType=deposit`;
            var auth = `${UserService.getCurrentUser().authdata},acctid=${custacctname}`;
            return $http({
                method : "GET",
                Authorization : auth,
                url : url
            }).then(function(res){
                let status = res.status;
                let data = res.data;
                if(StatusService.isOkData(status)){
                    if(!StatusService.isBlank(data)){
                        Flash.success("AgentDepositTopUp(confotp)" + data);
                        return true;                        
                    }else{
                        Flash.error("AgentDepositTopUp: No content");
                        return false;
                    }
                }else{
                    StatusService.failStatus(status,data);
                    return false;
                }
            });
        }

        function initDeposit(custacctname, cashAmount, channel){
            let url = `${host('EbsAgentWS/services/apis/initdeptopup')}?amount=${cashAmount}&channel=${channel}`
            var auth = `${UserService.getCurrentUser().authdata},acctid=${custacctname}`;
            return $http({
                method : "GET",
                Authorization : auth,
                url : url
            }).then(function(res){
                let status = res.status;
                let data = res.data;
                if(StatusService.isOkData(status)){
                    if(!StatusService.isBlank(data)){
                        let transStatus = ((data.split(":")[0].startsWith("-") == false) ? "Success" : "Failed");
                        let bankTransId = data.split(":")[1];
                        Flash.success("AgentDepositTopUp(initdeptopup): Transaction Status = " + transStatus +
                        ", Transaction Id or Status Message = " + bankTransId);
                        return true;                        
                    }else{
                        Flash.error("AgentDepositTopUp: No content");
                        return false;
                    }
                }else{
                    StatusService.failStatus(status,data);
                    return false;
                }
            });            
        }
         
        function completeDeposit(custacctname,transId,statusDeposit){
            let url = `${host('EbsAgentWS/services/apis/initdeptopup')}?transId=${transId}&status=${statusDeposit}`;
            var auth = `${UserService.getCurrentUser().authdata},acctid=${custacctname}`;
            return $http({
                method : "GET",
                Authorization : auth,
                url : url
            }).then(function(res){
                let status = res.status;
                let data = res.data;
                if(StatusService.isOkData(status)){
                    if(!StatusService.isBlank(data)){                            
                        let isSuccess = ((data.split(":")[0].startsWith("-") == false) ? "Success" : "Failed");
                        let mesg = data.split(":")[1];
                        Flash.success(`*** AgentDepositTopUp ***: Confirm Deposit Status = ${isSuccess}
                                        , mobile|Status Message = ${mesg}`);
                        return true;                        
                    }else{
                        Flash.error("AgentDepositTopUp: No content");
                        return false;
                    }
                }else{
                    StatusService.failStatus(status,data);
                    return false;
                }
            }); 
        }

    }
})();