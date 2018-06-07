(function(){

  var app = angular.module("AMChatter", ["ngRoute"]);

  app.config(function($routeProvider){

    $routeProvider
      .when('/main', {
        templateUrl: "main.html",
        controller: "MainController"
      })
      .when('/login', {
        templateUrl: "login.html",
        controller: "MainController"
      })
      .when('/chat', {
        templateUrl: "chat.html",
        controller: "ChatController"
      })
      .when('/register', {
        templateUrl: "register.html",
        controller: "MainController"
      })
      .when('/login', {
        templateUrl: "login.html",
        controller: "MainController"
      })
      .when('/settings', {
        templateUrl: "settings.html",
        controller: "ChatController"
      })
      .otherwise({redirectTo:"/main"});
  });
}());
