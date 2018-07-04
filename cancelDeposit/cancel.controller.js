(function () {
    'use strict';

    angular
        .module('app')
        .controller('CancelDepositController', CancelDepositController);

    CancelDepositController.$inject = ['SessionService'];
    function CancelDepositController(SessionService) {
        var vm = this;

        vm.cancel = cancelDeposit;
       
        vm.user = {};
        
        function cancelDeposit(){
            vm.dataLoading = true;            
            SessionService.cancelDeposit(vm.user.custacctname,vm.user.mobileNumber,vm.user.merchantTransId)
            .then(function(result){
                vm.dataLoading = false;                                
            });
        }

    }

})();