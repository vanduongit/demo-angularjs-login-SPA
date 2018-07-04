(function () {
    'use strict';

    angular
        .module('app')
        .controller('ValidateSessionController', ValidateSessionController);

    ValidateSessionController.$inject = ['SessionService'];
    function ValidateSessionController(SessionService) {
        var vm = this;

        vm.validateSession = validateSession;

        function validateSession(){
            vm.dataLoading = true;            
            SessionService.validateSession().then(function(res){
                vm.dataLoading = false;
            });
        }
        
    }

})();
