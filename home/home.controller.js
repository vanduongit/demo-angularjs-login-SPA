(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', '$rootScope','AuthenticationService','FlashService'];
    function HomeController(UserService, $rootScope, AuthenticationService, FlashService) {
        var vm = this;

        vm.user = null;
        vm.allUsers = [];
        vm.deleteUser = deleteUser;
        vm.logout = logout;

        initController();

        function initController() {
            loadCurrentUser();
            // loadAllUsers();
        }

        function logout(){
            vm.dataLoading = true;
            AuthenticationService.logout().then(function(res){
                let data = res.data;
                let status = res.data;
                if(status == 200){
                    if(data.isLowerCase() == "true"){
                        AuthenticationService.ClearCredentials();
                        FlashService.success("Successful Logout");
                        $location.path('/login');
                    }else{
                        FlashService.error("Failed Logout");
                    }
                }
                vm.dataLoading = false;
            });
        }

        function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user;
                });
        }

        function loadAllUsers() {
            UserService.GetAll()
                .then(function (users) {
                    vm.allUsers = users;
                });
        }

        function deleteUser(id) {
            UserService.Delete(id)
            .then(function () {
                loadAllUsers();
            });
        }
    }

})();