(function () {
    'use strict';

    angular
        .module('app')
        .controller('TransactionHistoryAgentController', TransactionHistoryAgentController);

    TransactionHistoryAgentController.$inject = ['SessionService','FlashService','StatusService'];
    function TransactionHistoryAgentController(SessionService, FlashService, StatusService) {
        var vm = this;

        vm.transactionTypes = {
            0 : "0. Registration/Inital Deposit",
            1 : "1. Top Up",
            2 : "2. Withdrawal"
        }
        vm.getResult = getResult;

        function getResult(){
            vm.dataLoading = true;            
            SessionService.getTransactionHistory(vm.user).then(function(res){
                vm.dataLoading = false;
                if(StatusService.isOkData(res.status)){
                    if(StatusService.isBlank(res.data)){
                        FlashService.Success("Get Transaction History: " + JSON.stringify(res.data));
                    }
                }
            });
        }
        
    }

})();
