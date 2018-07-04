(function () {
    'use strict';

    angular
        .module('app')
        .controller('UserWithdrawalController', UserWithdrawalController);

    UserWithdrawalController.$inject = ['SessionService'];
    function UserWithdrawalController(SessionService) {
        var vm = this;

        vm.initOTP = initOTP;
        vm.completeOTP = completeOTP;
        vm.initWithdrawal = initWithdrawal;
        vm.completeWithdrawal = completeWithdrawal;
        vm.user = {};
        vm.isInitOTP = false;
        vm.isCompleteOTP = false;
        vm.isInitWithdrawal = false;

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

        function initWithdrawal(){
            vm.dataLoading = true;
            vm.dataLoading = false;
            return vm.isInitWithdrawal = true;
            SessionService.initWithdrawal(vm.user.custacctname, vm.user.cashAmount, vm.user.channel)
            .then(function(result){
                vm.dataLoading = false;
                result ? vm.isInitWithdrawal = true : '';                
            });
        }

        function completeWithdrawal(){
            vm.dataLoading = true;
            vm.dataLoading = false;
            SessionService.completeWithdrawal(vm.user.custacctname, vm.user.transId, vm.user.statusWithdrawal)
            .then(function(result){
                vm.dataLoading = false;                             
            });
        }
    }

})();