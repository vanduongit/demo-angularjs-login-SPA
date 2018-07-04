(function () {
    'use strict';

    angular
        .module('app')
        .controller('UserDepositController', UserDepositController);

    UserDepositController.$inject = ['SessionService'];
    function UserDepositController(SessionService) {
        var vm = this;

        vm.userDeposit = userDeposit;
       
        vm.user = {};
        
        function userDeposit(){
            vm.dataLoading = true;            
            SessionService.depositUser(vm.user.cashAmount, vm.user.merchantTransId, vm.user.merchantId, vm.user.status)
            .then(function(result){
                vm.dataLoading = false;                                
            });
        }

    }

})();