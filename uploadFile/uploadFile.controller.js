(function () {
    'use strict';

    angular
        .module('app')
        .directive('onReadFile', function ($parse) {
            return {
                restrict: 'A',
                scope:{
                    onReadFile : "&"
                },                
                link: function(scope, element, attrs) {
                    var fn = $parse(attrs.onReadFile);
                    
                    element.on('change', function(onChangeEvent) {
                        var reader = new FileReader();
                        console.log(scope);
                        reader.onload = function(onLoadEvent) {                            
                            scope.$apply(function() {
                                var canvas = document.createElement("canvas");
                                var imageElement = document.createElement("img");
                                var url = onLoadEvent.target.result;                                             
                                imageElement.setAttribute("src",url);
                                var ctx = canvas.getContext("2d");
                                let data;
                                imageElement.addEventListener("load",function(){                                        
                                        canvas.width = this.width;
                                        canvas.height = this.height;
                                        ctx.drawImage(this, 0, 0);
                                        var base64Image = canvas.toDataURL("image/png");
                                        data = base64Image.replace(/^data:image\/\w+;base64,/, "");                                                                                                                        
                                        //fn(scope, {$fileConten:data});  
                                        scope.onReadFile({$fileContent:data});                                                                
                                });                                                                
                            });
                        };
        
                        reader.readAsDataURL((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
                    });
                }
            };
        });

    angular
        .module('app')
        .controller('UploadController', UploadController);

    UploadController.$inject = ['SessionService','FlashService','StatusService'];
    function UploadController(SessionService, FlashService, StatusService) {
        var vm = this;
        vm.upload = upload;       
        
        vm.showContent = function($fileContent){
            console.log("Run it ");
            console.log($fileContent);                      ;
            vm.content = $fileContent;            
        };

        function upload(){            
            vm.dataLoading = true;
            SessionService.upload(vm.content,vm.custacctname).then(function(res){
                let data = res.data;
                let status = res.status;
                if(StatusService.isOkData(status)){
                    if(!StatusService.isBlank(data)){
                        FlashService.success(`File Upload(uploadfiledata): Status = ${JSON.stringify(data)}`);
                    }else{
                        FlashService.error('Response: No content');
                    }
                }
            })
        }
        
    }

})();
