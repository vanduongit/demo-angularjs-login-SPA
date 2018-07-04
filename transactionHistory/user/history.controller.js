(function () {
    'use strict';

    angular
        .module('app')
        .controller('TransactionHistoryUserController', TransactionHistoryUserController);

    TransactionHistoryUserController.$inject = ['SessionService','FlashService','StatusService'];
    function TransactionHistoryUserController(SessionService, FlashService, StatusService) {
        var vm = this;

        vm.transactionTypes = {
            0 : "0. Registration/Inital Deposit",
            1 : "1. Top Up",
            2 : "2. Withdrawal",
            3 : "3. Bet Transactions",
            4 : "4. Winning Deposits",
            5 : "5. Charges/Fees"
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
