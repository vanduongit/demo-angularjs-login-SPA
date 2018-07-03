(function () {
    'use strict';

    angular
        .module('app')
        .controller('ResetAgentPasswordController', ResetAgentPasswordController);

    ResetAgentPasswordController.$inject = ['UserService', '$location', '$rootScope', 'FlashService'];
    function ResetAgentPasswordController(UserService, $location, $rootScope, FlashService) {
        var vm = this;

        vm.reset = reset;

        function reset(){
            vm.dataLoading = true;            
            UserService.resetPwdAgent().then(function(res){
                vm.dataLoading = false;
            });
        }
        
    }

})();
