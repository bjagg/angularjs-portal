define([
    'angular',
    'require',
    './marketplace/routes',
    './layout/list/route',
    'portal/notifications/route',
    'portal/settings/route',
    'portal/features/route',
    'portal/about/route',
    './layout/route',
    './layout/static/routes',
    './layout/widget/route',
    './search/routes',
    'portal',
    'app-config',
    'ngRoute',
    'ngSanitize',
    'ngStorage',
    './layout/controllers',
    './layout/directives',
    './layout/services',
    './layout/static/controllers',
    './layout/static/directives',
    './layout/widget/controllers',
    './layout/widget/directives',
    './marketplace/controllers',
    './marketplace/directives',
    './marketplace/services',
    './search/controllers',
    './search/services'
], function(angular, require, marketplaceRoutes, listRoute, notificationsRoute, portalSettingsRoute, featuresRoute, aboutRoute, layoutRoute, staticRoutes, widgetRoute, searchRoutes) {

    var app = angular.module('my-app', [
        'app-config',
        'my-app.layout.controllers',
        'my-app.layout.directives',
        'my-app.layout.services',
        'my-app.layout.static.controllers',
        'my-app.layout.static.directives',
        'my-app.layout.widget.controllers',
        'my-app.layout.widget.directives',
        'my-app.marketplace.controllers',
        'my-app.marketplace.directives',
        'my-app.marketplace.services',
        'my-app.search.controllers',
        'my-app.search.services',
        'ngRoute',
        'ngSanitize',
        'ngStorage',
        'portal'
    ]);

    // TODO: Think of a more extensible approach such that frame and app can each manage their own routing without conflict
    app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider.
            when('/apps', marketplaceRoutes.main).
            when('/apps/details/:fname', marketplaceRoutes.details).
            when('/apps/search/:initFilter', searchRoutes.search).
            when('/compact', listRoute).
            when('/expanded', widgetRoute.widgetView).
            when('/notifications', notificationsRoute).
            when('/settings', portalSettingsRoute).
            when('/features', featuresRoute).
            when('/static/:fname', staticRoutes.staticMax).
            when('/static/:fname/widget', widgetRoute.widgetFocus).
            when('/exclusive/:fname', staticRoutes.exclusiveMax).
            when('/about', aboutRoute).
            otherwise(layoutRoute);
    }]);


    return app;

});
