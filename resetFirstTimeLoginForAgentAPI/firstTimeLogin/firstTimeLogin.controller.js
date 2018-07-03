(function () {
    'use strict';

    angular
        .module('app')
        .controller('FirstTimeLoginController', FirstTimeLoginController);

    FirstTimeLoginController.$inject = ['UserService', '$location', '$rootScope', 'FlashService'];
    function FirstTimeLoginController(UserService, $location, $rootScope, FlashService) {
        var vm = this;

        vm.changePwd = changePwd;

        function changePwd(){
            vm.dataLoading = true;            
            UserService.changePwdAgent().then(function(res){
                vm.dataLoading = false;
            });
        }
        
    }

})();
