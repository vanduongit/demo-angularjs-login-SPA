(function(){
    'use strict'

    angular.module('app').factory('SessionService', SessionService);

    SessionService.$inject = ['$http','UserService', 'host', 'StatusService', 'FlashService'];

    function SessionService($http, UserService, host, StatusService, FlashService){

        return {
            extendSession : extendSession,
            validateSession : validateSession,
            checkAccountBalance : checkAccountBalance,
            initOTPDeposit : initOTPDeposit,
            confirmOTPDeposit : confirmOTPDeposit,
            initOTPWithdrawal : initOTPWithdrawal,
            confirmOTPWithdrawal : confirmOTPWithdrawal,
            initOTPWithdrawalUser : initOTPWithdrawalUser,
            confirmOTPWithdrawalUser : confirmOTPWithdrawalUser,
            initDeposit : initDeposit,
            completeDeposit : completeDeposit,
            depositUser : depositUser,
            cancelDeposit : cancelDeposit,
            initWithdrawal : initWithdrawal,
            completeWithdrawal : completeWithdrawal,
            initWithdrawalUser : initWithdrawalUser,
            completeWithdrawalUser : completeWithdrawalUser,
            getDrawResult : getDrawResult,
            getDrawOpen : getDrawOpen,
            getViewWinning : getViewWinning,
            getTransactionHistory : getTransactionHistory,
            getGames : getGames,
            betting : betting,
            upload : upload   
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

        function initOTPDeposit(custacctname, mobileNumber){
            var auth = `${UserService.getCurrentUser().authdata},acctid=${custacctname}`;
            return initPinOTP(custacctname, mobileNumber, "deposit",auth);
        }

        function initOTPWithdrawal(custacctname, mobileNumber){
            var auth = `${UserService.getCurrentUser().authdata},acctid=${custacctname}`;
            return initPinOTP(custacctname, mobileNumber, "withdrawal",auth);
        }

        function initOTPWithdrawalUser(custacctname, mobileNumber){
            var auth = `${UserService.getCurrentUser().authdata}`;
            return initPinOTP(custacctname, mobileNumber, "withdrawal",auth);
        }

        function initPinOTP(custacctname, mobileNumber, actionType, auth){
            var url = `${host('EbsAgentWS/services/apis/initotp')}?mobile=${mobileNumber}&actionType=${actionType}`;            
            return $http({
                method : "GET",
                headers:{
                    Authorization : auth,
                },                
                url : url
            }).then(function(res){
                let status = res.status;
                let data = res.data;
                if(StatusService.isOkData(status)){
                    if(!StatusService.isBlank(data)){
                        Flash.success(`Init OTP ${actionType} (initotp): ` + data);
                        return data;                        
                    }else{
                        Flash.error(`Init OTP ${actionType}: No content`);
                        return false;
                    }
                }else{
                    StatusService.failStatus(status,data);
                    return false;
                }
            })
        }

        function confirmOTPDeposit(custacctname, mobileNumber, pinOTP){
            var auth = `${UserService.getCurrentUser().authdata},acctid=${custacctname}`;
            return confirmOTP(custacctname, mobileNumber, pinOTP, "deposit");
        }

        function confirmOTPWithdrawal(custacctname, mobileNumber, pinOTP){
            var auth = `${UserService.getCurrentUser().authdata},acctid=${custacctname}`;
            return confirmOTP(custacctname, mobileNumber, pinOTP, "withdrawal");
        }

        function confirmOTPWithdrawalUser(custacctname, mobileNumber, pinOTP){
            var auth = `${UserService.getCurrentUser().authdata}`;
            return confirmOTP(custacctname, mobileNumber, pinOTP, "withdrawal");
        }

        function confirmOTP(custacctname, mobileNumber, pinOTP, actionType, auth){
            let url = `${host('EbsAgentWS/services/apis/confotp')}?mobile=${mobileNumber}$pin=${pinOTP}&actionType=${actionType}`;
            
            return $http({
                method : "GET",
                headers:{
                    Authorization : auth
                },                
                url : url
            }).then(function(res){
                let status = res.status;
                let data = res.data;
                if(StatusService.isOkData(status)){
                    if(!StatusService.isBlank(data)){
                        Flash.success(`Init OTP ${actionType}(confotp)` + data);
                        return true;                        
                    }else{
                        Flash.error(`Init OTP ${actionType}: No content`);
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
                headers:{
                    Authorization : auth
                }, 
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

        function initWithdrawal(custacctname, cashAmount, channel, nric){
            let url = `${host('EbsAgentWS/services/apis/initwithdrawal')}?amount=${cashAmount}&channel=${channel}&nric=${nric}`;
            let auth = `${UserService.getCurrentUser().authdata},acctid=${custacctname}`;
            return $http({
                method : "GET",
                headers:{
                    Authorization : auth
                }, 
                url : url
            }).then(function(res){
                let status = res.status;
                let data = res.data;
                if(StatusService.isOkData(status)){
                    if(!StatusService.isBlank(data)){
                        let transStatus = ((data.split(":")[0].startsWith("-") == false) ? "Success" : "Failed");
                        let bankTransId = data.split(":")[1];
                        Flash.success("AgentWithdrawal(initwithdrawal): Transaction Status = " + transStatus +
                        ", Transaction Id or Status Message = " + bankTransId);
                        return true;                        
                    }else{
                        Flash.error("AgentWithdrawal(initwithdrawal): No content");
                        return false;
                    }
                }else{
                    StatusService.failStatus(status,data);
                    return false;
                }
            });            
        }

        function initWithdrawalUser(nric, cashAmount, channel, bankAcctNum, bankAcctName){
            let url = `${host('EbsAgentWS/services/apis/initwithdrawal')}?amount=${cashAmount}&channel=${channel}&nric=${nric}&bnkacctnum=${bnkacctnum}&bnkacctnam=${bnkacctnam}`;
            let auth = `${UserService.getCurrentUser().authdata},acctid=${custacctname}`;
            return $http({
                method : "GET",
                headers:{
                    Authorization : auth
                }, 
                url : url
            }).then(function(res){
                let status = res.status;
                let data = res.data;
                if(StatusService.isOkData(status)){
                    if(!StatusService.isBlank(data)){
                        let transStatus = ((data.split(":")[0].startsWith("-") == false) ? "Success" : "Failed");
                        let bankTransId = data.split(":")[1];
                        Flash.success("UserWithdrawal(initwithdrawal): Transaction Status = " + transStatus +
                        ", Transaction Id or Status Message = " + bankTransId);
                        return true;                        
                    }else{
                        Flash.error("UserWithdrawal(initwithdrawal): No content");
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
                headers:{
                    Authorization : auth
                }, 
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

        function completeWithdrawal(custacctname,transId,status){
            let url = `${host('EbsAgentWS/services/apis/confwithdrawal')}?transId=${transId}&status=${status}`;            
            return $http({
                method : "GET",                
                url : url
            }).then(function(res){
                let status = res.status;
                let data = res.data;
                if(StatusService.isOkData(status)){
                    if(!StatusService.isBlank(data)){                            
                        let isSuccess = ((data.split(":")[0].startsWith("-") == false) ? "Success" : "Failed");
                        let mesg = data.split(":")[1];
                        Flash.success(`*** AgentWithdrawal ***: Confirm Withdrawal Status =  ${isSuccess}
                                        , mobile|Status Message = ${mesg}`);
                        return true;                        
                    }else{
                        Flash.error("AgentWithdrawal: No content");
                        return false;
                    }
                }else{
                    StatusService.failStatus(status,data);
                    return false;
                }
            }); 
        }

        function completeWithdrawalUser(transId,status){
            let url = `${host('EbsAgentWS/services/apis/confwithdrawal')}?transId=${transId}&status=${status}`;
        
            return $http({
                method : "GET",            
                url : url
            }).then(function(res){
                let status = res.status;
                let data = res.data;
                if(StatusService.isOkData(status)){
                    if(!StatusService.isBlank(data)){                            
                        let isSuccess = ((data.split(":")[0].startsWith("-") == false) ? "Success" : "Failed");
                        let mesg = data.split(":")[1];
                        Flash.success(`*** UserWithdrawal ***: Confirm Withdrawal Status =  ${isSuccess}
                                        , mobile|Status Message = ${mesg}`);
                        return true;                        
                    }else{
                        Flash.error("UserWithdrawal: No content");
                        return false;
                    }
                }else{
                    StatusService.failStatus(status,data);
                    return false;
                }
            }); 
        }

        function depositUser(cashAmount, merchantTransId, merchantId, status){
            let url = host(`EbsUserWS/services/apis/confebnktopup?amount=${cashAmount}&merchantTransId=${merchantTransId}&merchantId=${merchantId}&status=${status}`);
            return $http({
                method : "GET",
                url : url
            }).then(function(res){
                let status = res.status;
                let data = res.data;
                if(StatusService.isOkData(status)){
                    if(!StatusService.isBlank(data)){                            
                        let transStatus = ((data.startsWith("true") == false) ? "Success" : "Failed");                        
                        Flash.success("*** UserDepositTopUp(EBanking) ***: Transaction Status = " + transStatus);
                        return true;                        
                    }else{
                        Flash.error("UserDepositTopUp: No content");
                        return false;
                    }
                }else{
                    StatusService.failStatus(status,data);
                    return false;
                }
            }); 
        }

        function cancelDeposit(acctname, mobileNumber, transId){
            let url = host(`EbsUserWS/services/apis/canceltrans?transId=${transId}`);
            return $http({
                method : "GET",                
                url : url
            }).then(function(res){
                let status = res.status;
                let data = res.data;
                if(StatusService.isOkData(status)){
                    if(!StatusService.isBlank(data)){                            
                        let isSuccess = ((data.split(":")[0].startsWith("-") == false) ? "Success" : "Failed");
                        let mesg = data.split(":")[1];
                        Flash.success(`*** CancelDepositTopUp ***: Cancel Deposit Status =  ${isSuccess}
                                        , mobile|Status Message = ${mesg}`);
                        return true;                        
                    }else{
                        Flash.error("CancelDepositTopUp: No content");
                        return false;
                    }
                }else{
                    StatusService.failStatus(status,data);
                    return false;
                }
            }); 
        }

        function getDrawResult(gameId, drawId){
            let url = `${host('EbsUserWS/services/apis/getdrwres')}?gameId=${gameId}&drawId=${drawId}`;
            return $http.get(url).then(function(res){
                let status = res.status;
                let data = res.data;
                if(StatusService.isOkData(status)){
                    if(!StatusService.isBlank(data)){
                        Flash.success("GetDrawResults(getdrwres): Draw Results Status = " + data);                        
                    }else{
                        Flash.error("GetDrawResults: No content");
                    }
                }else{
                    StatusService.failStatus(status,data);
                }
            });
        }

        function getDrawOpen(gameId){
            let url = `${host('EbsUserWS/services/apis/getopndrws')}?gameId=${gameId}`;
            return $http.get(url).then(function(res){
                let status = res.status;
                let data = res.data;
                if(StatusService.isOkData(status)){
                    if(!StatusService.isBlank(data)){
                        Flash.success("GetOpenDraws(getopndrws): Open Draws Status = " + data);                        
                    }else{
                        Flash.error("GetOpenDraws: No content");
                    }
                }else{
                    StatusService.failStatus(status,data);
                }
            });
        }

        function getViewWinning(startdate, enddate){
            let url = `${host("EbsUserWS/services/apis/viewwinnings")}?startdate=${startdate}&enddate=${enddate}`;
            return $http.get(url).then(function(res){
                let status = res.status;
                let data = res.data;
                if(StatusService.isOkData(status)){
                    if(!StatusService.isBlank(data)){
                        Flash.success("ViewWinnings: status= " + JSON.stringify(data));                        
                    }else{
                        Flash.error("ViewWinnings: No content");
                    }
                }else{
                    StatusService.failStatus(status,data);
                }
            });
        }

        function getTransactionHistory(params){
            let url = host('EbsAgentWS/services/apis/gettranshist');
            url = StatusService.generateQueryParams(url,params);
            return $http.get(url).then(function(res){
                let status = res.status;
                let data = res.data;
                if(!StatusService.isOkData(status)){
                    StatusService.failStatus(status,data);
                }
                return res;
            });
        }

        function getGames(gameType){
            let url = `${host('EbsUserWS/services/apis/getgames')}?gametype=${gameType}`;
            return $http.get(url).then(function(res){
                let status = res.status;
                let data = res.data;
                if(StatusService.isOkData(status)){
                    if(!StatusService.isBlank(data)){
                        Flash.success("Game(s): " + JSON.stringify(data));                        
                    }else{
                        Flash.error("Game(s): No content");
                    }
                }else{
                    StatusService.failStatus(status,data);
                }
            });
        }

        function validateSession(){
            let user = UserService.getCurrentUser();
            let url = `${host('EbsUserWS/services/apis/validateAndExtendSession')}?loginname=${user.username}&tokenid=${user.token}&refreshtokenid=${user.refreshtoken}`;
            return $http.get(url).then(function(res){
                let status = res.status;
                let data = res.data;
                if(StatusService.isOkData(status)){
                    if(!StatusService.isBlank(data)){
                        Flash.success("ValidateAndExtendSession: status=" + JSON.stringify(data));                        
                    }else{
                        Flash.error("ValidateAndExtendSession: No content");
                    }
                }else{
                    StatusService.failStatus(status,data);
                }
            });
        }

        function betting(fileContent, type){
            console.log(fileContent);
            let bettingUrl = {
                1 : 'EbsUserWS/services/apis/lottobet',
                2 : 'EbsUserWS/services/apis/digitbet',
                3 : 'EbsUserWS/services/apis/jackpot4d',
                4 : 'EbsUserWS/services/apis/jackpot4dsys'
            }
            let url = `${host(bettingUrl[type])}?betData=${fileContent}`;
            return $http.post(url,{betData:fileContent}).then(function(res){
                StatusService.failStatus(res);
                return res;
            });
        }

        function upload(fileContent, customerId){            
            var auth = `${UserService.getCurrentUser().authdata},acctid=${customerId}`;
            let url = `${host('EbsAgentWS/services/apis/uploadfilestr')}?strData=${fileContent}`;
            return $http({
                method : "POST",
                url : url, 
                headers : {
                    Authorization : auth
                }
            }).then(function(res){  
                StatusService.failStatus(res);
                return res;
            });
        }
    

    }
})();