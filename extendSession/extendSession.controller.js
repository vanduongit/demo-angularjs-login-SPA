(function () {
    'use strict';

    angular
        .module('app')
        .controller('ExtendSessionController', ExtendSessionController);

    ExtendSessionController.$inject = ['SessionService'];
    function ExtendSessionController(SessionService) {
        var vm = this;

        vm.extendSession = extendSession;

        function extendSession(){
            vm.dataLoading = true;
            SessionService.extendSession().then(function(){
                vm.dataLoading = false;
            });
        }
    }

})();