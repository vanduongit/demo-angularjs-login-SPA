(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['UserService', '$location', '$rootScope', 'FlashService'];
    function RegisterController(UserService, $location, $rootScope, FlashService) {
        var vm = this;

        vm.register = register;
        vm.user = {
            "fullname": "Raymond L. Richard",
            "personId": "Cabot, VT 05647",
            "mobile": "802-584-3768",
            "nationality": "America",
            "initDep": 0,
            "birthDay": "24/12/1943",
            "gender": "m",
            "nickName": "Baker",
            "cntryId": "1",
            "addr1": "2892 Selah Way",
            "cityId": "1",
            "provId": "1",
            "pstCd": "05647",
            "phone": "802-584-3768",
            "bnkNam": "0394178181",
            "bnkAcctNum": "0394178181",
            "bnkAcctNam": "0394178181",
            "email": "RaymondLRichard@armyspy.com",
            "regDate": "03/07/2018",
        }

        function register() {
            vm.dataLoading = true;
            UserService.Create(vm.user)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Registration successful', true);
                        $location.path('/login');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }
    }

})();
