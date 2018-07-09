(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService','LoginService'];
    function LoginController($location, AuthenticationService, FlashService, LoginService) {
        var vm = this;

        vm.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login() {
            vm.dataLoading = true;            
            AuthenticationService.Login(vm.username, vm.password, function (response) {
                console.log(response);
                if (response.success) {
                    AuthenticationService.SetCredentials(vm.username, vm.password, vm.role);
                    $location.path('/');
                } else {
                    FlashService.error(response.message);
                    vm.dataLoading = false;
                }
            });
            LoginService.loginAgent(vm.username, vm.password).then(function(res){
                if(res.status === 200){   
                    let tokens = data.split(",");
                    if(tokens.length <= 1){
                        FlashService.error("UserLogin: Expect First Time Login data=" + JSON.stringify(res.data));
                    }                 
                    $location.path('/');
                }
            });
        };
    }

})();
