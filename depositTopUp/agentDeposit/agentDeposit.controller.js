(function () {
    'use strict';

    angular
        .module('app')
        .controller('AgentDepositController', AgentDepositController);

    AgentDepositController.$inject = ['SessionService'];
    function AgentDepositController(SessionService) {
        var vm = this;

        vm.initOTP = initOTP;
        vm.completeOTP = completeOTP;
        vm.initDeposit = initDeposit;
        vm.completeDeposit = completeDeposit;
        vm.user = {};
        vm.isInitOTP = false;
        vm.isCompleteOTP = false;
        vm.isInitDeposit = false;

        function initOTP(){
            vm.dataLoading = true;
            vm.dataLoading = false;
            return vm.isInitOTP = true;
            SessionService.initPinOTP(vm.user.custacctname, vm.user.mobileNumber).then(function(result){
                vm.dataLoading = false;
                result ? vm.isInitOTP = true : '';
                vm.user.pinOTP = result || '';
            });
        }

        function completeOTP(){
            vm.dataLoading = true;
            vm.dataLoading = false;
            return vm.isCompleteOTP = true;
            SessionService.confirmOTP(vm.user.custacctname, vm.user.mobileNumber, vm.user.pinOTP)
            .then(function(result){
                vm.dataLoading = false;
                result ? vm.isCompleteOTP = true : '';                
            });
        }

        function initDeposit(){
            vm.dataLoading = true;
            vm.dataLoading = false;
            return vm.isInitDeposit = true;
            SessionService.initDeposit(vm.user.custacctname, vm.user.cashAmount, vm.user.channel)
            .then(function(result){
                vm.dataLoading = false;
                result ? vm.isInitDeposit = true : '';                
            });
        }

        function completeDeposit(){
            vm.dataLoading = true;
            vm.dataLoading = false;
            SessionService.completeDeposit(vm.user.custacctname, vm.user.transId, vm.user.statusDeposit)
            .then(function(result){
                vm.dataLoading = false;                             
            });
        }
    }

})();