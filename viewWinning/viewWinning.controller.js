(function () {
    'use strict';

    angular
        .module('app')
        .controller('ViewWinningController', ViewWinningController);

    ViewWinningController.$inject = ['SessionService','FlashService'];
    function ViewWinningController(SessionService, FlashService) {
        var vm = this;
        vm.viewWinning = viewWinning;

        function viewWinning(){
            vm.dataLoading = true;
            SessionService.getViewWinning(vm.startdate,vm.enddate).then(function(res){
                vm.dataLoading = false;
            })
        }
        
    }

})();
