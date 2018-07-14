(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies','ui.router','angular-md5'])
        .constant("host",function getUrl(url){
            return `http://172.19.19.179:8080${url}`
        })
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider', '$httpProvider', '$stateProvider', '$urlRouterProvider'];
    function config($routeProvider, $locationProvider, $httpProvider, $stateProvider, $urlRouterProvider) {
        // $routeProvider
        //     .when('/', {
        //         controller: 'HomeController',
        //         templateUrl: 'home/home.view.html',
        //         controllerAs: 'vm',
        //         abstract: true
        //     })
        //     .when('/menu1',{
        //         parent : "",
        //         template : "<div><h3>Menu 1</h3></div>"
        //     })
            
        //     .when('/login', {
        //         controller: 'LoginController',
        //         templateUrl: 'login/login.view.html',
        //         controllerAs: 'vm'
        //     })

        //     .when('/register', {
        //         controller: 'RegisterController',
        //         templateUrl: 'register/register.view.html',
        //         controllerAs: 'vm'
        //     })

        //     .otherwise({ redirectTo: '/login' });

        $stateProvider
            .state('common', {
                controller: 'HomeController',
                templateUrl: 'home/home.view.html',
                controllerAs: 'vm',
                abstract: true
            })    

            .state('home', { 
                url: '/home',
                parent: 'common',
                //templateUrl: '/app/crm/crm.html',
                template: '<div><h4>Home Page</h4></div>',
                //controller: 'CrmCtrl'
            })

            .state('login', {
                url: '/login',
                controller: 'LoginController',
                templateUrl: 'login/login.view.html',
                controllerAs: 'vm'
            })

            .state('register', { 
                url: '/register',   
                parent: 'common',             
                controller: 'RegisterController',
                templateUrl: 'register/register.view.html',                                
                controllerAs: 'vm'
            })

            .state('resetPwdAgent', { 
                url: '/resetPwdAgent',   
                parent: 'common',                             
                templateUrl: 'resetFirstTimeLoginForAgentAPI/resetFirstTimeLoginForAgentAPI.view.html'                                               
            })

            .state('resetAgentPassword', { 
                url: '/resetPwdAgent/resetAgentPassword',   
                parent: 'common',    
                controller : 'ResetAgentPasswordController',
                controllerAs : 'vm',
                templateUrl: 'resetFirstTimeLoginForAgentAPI/resetAgentPassword/resetAgentPassword.view.html'                                               
            })

            .state('firstTimeLogin', { 
                url: '/resetPwdAgent/firstTimeLogin',   
                parent: 'common',    
                controller : 'FirstTimeLoginController',
                controllerAs : 'vm',
                templateUrl: 'resetFirstTimeLoginForAgentAPI/firstTimeLogin/firstTimeLogin.view.html'                                               
            })

            .state('extendSession', { 
                url: '/extendSession',   
                parent: 'common',    
                controller : 'ExtendSessionController',
                controllerAs : 'vm',
                templateUrl: 'extendSession/extendSession.view.html'                                               
            })

            .state('checkAccountBalance', { 
                url: '/checkAccountBalance',   
                parent: 'common',    
                controller : 'CheckAccountBalanceController',
                controllerAs : 'vm',
                templateUrl: 'checkAccountBalance/checkAccountBalance.view.html'                                               
            })

            .state('updateUserGeneralProfile', { 
                url: '/updateUserGeneralProfile',   
                parent: 'common',    
                controller : 'UpdateProfileController',
                controllerAs : 'vm',
                templateUrl: 'updateUserGeneralProfile/update.view.html'                                               
            })

            .state('depositTopUp', { 
                url: '/depositTopUp',   
                parent: 'common',                    
                templateUrl: 'depositTopUp/deposit.view.html'                                               
            })

            .state('agentDeposit', { 
                url: '/deposit/agent',   
                parent: 'common',   
                controller : 'AgentDepositController',
                controllerAs : 'vm',                 
                templateUrl: 'depositTopUp/agentDeposit/agent.view.html'                                               
            })

            .state('userDeposit', { 
                url: '/deposit/user',   
                parent: 'common',   
                controller : 'UserDepositController',
                controllerAs : 'vm',                 
                templateUrl: 'depositTopUp/userDeposit/user.view.html'                                               
            })

            .state('cancelDeposit', { 
                url: '/cancelDeposit',   
                parent: 'common',   
                controller : 'CancelDepositController',
                controllerAs : 'vm',                 
                templateUrl: 'cancelDeposit/cancel.view.html'                                               
            })

            .state('withdrawal', { 
                url: '/withdrawal',   
                parent: 'common',                                   
                templateUrl: 'withdrawal/withdrawal.view.html'                                               
            })

            .state('withdrawalAgent', { 
                url: '/withdrawal/agent',   
                parent: 'common',    
                controller: 'AgentWithdrawalController',
                controllerAs : 'vm',                               
                templateUrl: 'withdrawal/agent/withdrawal.view.html'                                               
            })

            .state('withdrawalUser', { 
                url: '/withdrawal/user',   
                parent: 'common',    
                controller: 'UserWithdrawalController',
                controllerAs : 'vm',                               
                templateUrl: 'withdrawal/user/withdrawal.view.html'                                               
            })

            .state('drawResult', { 
                url: '/drawResult',   
                parent: 'common',    
                controller: 'DrawController',
                controllerAs : 'vm',                               
                templateUrl: 'drawResultAPI/draw.view.html'                                               
            })

            .state('drawOpen', { 
                url: '/drawOpen',   
                parent: 'common',    
                controller: 'DrawOpenController',
                controllerAs : 'vm',                               
                templateUrl: 'drawOpenAPI/draw.view.html'                                               
            })

            .state('viewWinning', { 
                url: '/viewWinning',   
                parent: 'common',    
                controller: 'ViewWinningController',
                controllerAs : 'vm',                               
                templateUrl: 'viewWinning/viewWinning.view.html'                                               
            })

            .state('transactionHistory', { 
                url: '/transactionHistory',   
                parent: 'common',                                                  
                templateUrl: 'transactionHistory/menu.view.html'                                               
            })

            .state('transactionHistoryAgent', { 
                url: '/transactionHistory/agent',   
                parent: 'common',              
                controller: 'TransactionHistoryAgentController',
                controllerAs : 'vm',   
                templateUrl: 'transactionHistory/agent/history.view.html'                                               
            })

            .state('transactionHistoryUser', { 
                url: '/transactionHistory/user',   
                parent: 'common',              
                controller: 'TransactionHistoryUserController',
                controllerAs : 'vm',   
                templateUrl: 'transactionHistory/user/history.view.html'                                               
            })

            .state('getGames', { 
                url: '/getGames',   
                parent: 'common',              
                controller: 'GetGamesController',
                controllerAs : 'vm',   
                templateUrl: 'getGames/games.view.html'                                               
            })

            .state('validateSession', { 
                url: '/validateSession',   
                parent: 'common',              
                controller: 'ValidateSessionController',
                controllerAs : 'vm',   
                templateUrl: 'validateSession/validate.view.html'                                               
            })

            .state('betting', { 
                url: '/betting',   
                parent: 'common',              
                controller: 'BettingController',
                controllerAs : 'vm',   
                templateUrl: 'betting/betting.view.html'                                               
            })

            .state('upload', { 
                url: '/upload',   
                parent: 'common',              
                controller: 'UploadController',
                controllerAs : 'vm',   
                templateUrl: 'uploadFile/uploadFile.view.html'                                               
            })
            ;

            $urlRouterProvider.otherwise('/home');
    }

    run.$inject = ['$rootScope', '$location', '$cookies', '$http'];
    function run($rootScope, $location, $cookies, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }

})();