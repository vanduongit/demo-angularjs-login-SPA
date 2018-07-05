(function () {
    'use strict';

    angular
        .module('app')
        .directive('onReadFile', function ($parse) {
            return {
                restrict: 'A',
                scope: false,
                link: function(scope, element, attrs) {
                    var fn = $parse(attrs.onReadFile);
                    
                    element.on('change', function(onChangeEvent) {
                        var reader = new FileReader();
                        
                        reader.onload = function(onLoadEvent) {
                            scope.$apply(function() {
                                fn(scope, {$fileContent:onLoadEvent.target.result});
                            });
                        };
        
                        reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
                    });
                }
            };
        });

    angular
        .module('app')
        .controller('BettingController', BettingController);

    BettingController.$inject = ['SessionService','FlashService','StatusService'];
    function BettingController(SessionService, FlashService, StatusService) {
        var vm = this;
        vm.betting = betting;
        vm.bettingTypes = {
            1 : "LOTTO Bet",
            2 : "DIGIT Bet",
            3 : "Jackpot4D Straight",
            4 : "Jackpot4D System"
        }
        
        vm.showContent = function($fileContent){            
            vm.content = $fileContent;
        };

        function betting(){
            vm.dataLoading = true;
            SessionService.betting(vm.content,vm.bettingType).then(function(res){
                let data = res.data;
                let status = res.status;
                if(StatusService.isOkData(status)){
                    if(!StatusService.isBlank(data)){
                        FlashService.success(`${vm.bettingType} details: ${JSON.stringify(data)}`);
                    }else{
                        FlashService.error('Response: No content');
                    }
                }
            })
        }
        
    }

})();
