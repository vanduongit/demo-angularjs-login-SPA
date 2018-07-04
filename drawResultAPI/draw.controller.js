(function () {
    'use strict';

    angular
        .module('app')
        .controller('DrawController', DrawController);

    DrawController.$inject = ['SessionService','FlashService'];
    function DrawController(SessionService, FlashService) {
        var vm = this;

        vm.games = {
            1 : "1 - Lotto 6/45",
            2 : "2 - Lotto 6/55",
            4 : "4 - Digit 4D"
        }
        vm.getResult = getResult;

        function getResult(){
            vm.dataLoading = true;            
            SessionService.getDrawResult(vm.gameId, vm.drawId).then(function(res){
                vm.dataLoading = false;
            });
        }
        
    }

})();
