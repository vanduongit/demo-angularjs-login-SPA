(function () {
    'use strict';

    angular
        .module('app')
        .controller('CheckAccountBalanceController', CheckAccountBalanceController);

    CheckAccountBalanceController.$inject = ['SessionService'];
    function CheckAccountBalanceController(SessionService) {
        var vm = this;

        vm.checkAccountBalance = checkAccountBalance;

        function checkAccountBalance(){
            vm.dataLoading = true;
            SessionService.checkAccountBalance().then(function(){
                vm.dataLoading = false;
            });
        }
    }

})();