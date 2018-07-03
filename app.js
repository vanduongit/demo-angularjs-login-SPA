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
            .state('menu1', { 
                url: '/menu1',
                parent: 'common',
                //templateUrl: '/app/crm/crm.html',
                template: '<div><h4>Menu1</h4></div>',
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