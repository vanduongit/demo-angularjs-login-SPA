(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies','ui.router','angular-md5'])
        .constant("host",function getUrl(url){
            return `http://172.17.4.171:8080/${url}`
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