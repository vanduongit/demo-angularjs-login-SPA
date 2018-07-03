(function () {
    'use strict';

    angular
        .module('app')
        .controller('UpdateProfileController', UpdateProfileController);

    UpdateProfileController.$inject = ['UserService', '$location', '$rootScope', 'FlashService'];
    function UpdateProfileController(UserService, $location, $rootScope, FlashService) {
        var vm = this;

        vm.update = update;
        vm.user = {};

        initialize();

        function initialize(){
            vm.user = UserService.getCurrentUser();
        }

        function update() {
            vm.dataLoading = true;
            UserService.userUpdateProfile(vm.user)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('userUpdateProfile successful', true);                        
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }
    }

})();
