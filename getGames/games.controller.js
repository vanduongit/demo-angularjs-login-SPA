(function () {
    'use strict';

    angular
        .module('app')
        .controller('GetGamesController', GetGamesController);

    GetGamesController.$inject = ['SessionService','FlashService'];
    function GetGamesController(SessionService, FlashService) {
        var vm = this;
        vm.gameTypes = {
            1 : "1. Games", 
            2 : "2. Sub-Games"
        };
        vm.getGames = getGames;

        function getGames(){
            vm.dataLoading = true;
            SessionService.getGames(vm.gameType).then(function(res){
                vm.dataLoading = false;
            })
        }
        
    }

})();
