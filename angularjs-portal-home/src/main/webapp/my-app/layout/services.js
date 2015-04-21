'use strict';

define(['angular', 'jquery'], function(angular, $) {
    var app = angular.module('my-app.layout.services', []);

    app.factory('sharedPortletService', function () {
        var property = {};

        return {
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            }
        };
    });

    app.factory('layoutService', ['$http', 'miscService', 'mainService', '$sessionStorage', '$q', function($http, miscService, mainService, $sessionStorage, $q) {
        var addToHome = function addToHomeFunction(portlet) {
            var fname = portlet.fname;
            var tabName = "UW Bucky Home";
            return $.ajax({
                url: "/portal/web/layout?action=addPortlet&fname=" + fname + "&tabName=" + tabName,
                type: "POST",
                data: null,
                dataType: "json",
                async: true,
                success: function (request, text) {
                    console.log('Added ' + portlet.fname + ' successfully');
                    miscService.pushGAEvent('Layout Modification', 'Add', portlet.name);
                    return true;
                },
                error: function (request, text, error) {
                    console.warn('failed to add app to home.');
                    return false;
                }
            });
        };

        var checkLayoutCache = function() {
            var userPromise = mainService.getUser();
            return userPromise.then(function(user) {
                if ($sessionStorage.sessionKey === user.sessionKey && $sessionStorage.layout) {
                    return $sessionStorage.layout;
                }

                return null;
            });
        };

        var storeLayoutInCache = function(data) {
            var userPromise = mainService.getUser();
            userPromise.then(function(user) {
                $sessionStorage.sessionKey = user.sessionKey;
                $sessionStorage.layout = data;
            });
        };


        var getLayout = function() {
            return checkLayoutCache().then(function(data) {
                var successFn, errorFn, defer;

                // first, check the local storage...
                if (data) {
                    defer = $q.defer();
                    defer.resolve(data);
                    return defer.promise;
                }

                successFn = function(result) {
                    var data =  result.data;
                    storeLayoutInCache(data);
                    return data;
                };

                errorFn = function(reason) {
                    miscService.redirectUser(reason.status, 'layoutDoc call');
                };

                // no caching...  request from the server
                return $http.get('/portal/web/layoutDoc?tab=UW Bucky Home').then(successFn, errorFn);
            });
        };

        var getApp = function(fname) {
            return $http.get('/portal/api/portlet/' +fname + '.json').then(
                function(result) {
                    return  result.data;
                } ,
                function(reason){
                    miscService.redirectUser(reason.status, 'getApp call');
                    return reason.data;
                }
            );
        };
        var moveStuff = function moveStuffFunction(index, length, sourceId, previousNodeId, nextNodeId) {
            var insertNode = function(sourceId, previousNodeId, nextNodeId){
                var saveOrderURL = "/portal/api/layout?action=movePortletAjax"
                    + "&sourceId=" + sourceId
                    + "&previousNodeId=" + previousNodeId
                    + "&nextNodeId=" + nextNodeId;
                console.log(saveOrderURL);
                $.ajax({
                    url: saveOrderURL,
                    type: "POST",
                    data: null,
                    dataType: "json",
                    async: true,
                    success: function (){
                        console.log("layout move successful.");
                    },
                    error: function(request, text, error) {
                        console.error("Error persisting move " + saveOrderURL);
                    }
                });
            };

            insertNode(sourceId, previousNodeId, nextNodeId);
        };

        var getNewStuffFeed = function() {
            return $http.get('/web/samples/new-stuff.json', {cache : true}).then(
                function(result) {
                    return  result.data.stuff;
                } ,
                function(reason){
                    miscService.redirectUser(reason.status, 'new stuff json feed call');
                }
            );
        };

        var getWidgetJson = function(portlet) {
            return $http.get(portlet.widgetURL,{ cache : true}).then(
                function(result) {
                    var data = result.data;
                    if(data) {
                        if(data.result) {
                            portlet.widgetData = data.result;
                        }
                        if(data.content) {
                            portlet.widgetContent = data.content;
                        }
                        console.log(portlet.fname + "'s widget data came back with data");
                    }
                    return data;
                },
                function(reason) {
                    miscService.redirectUser(reason.status, 'widget json for ' + portlet.fname + " failed.");
                }
            );
        };

        return {
            getLayout : getLayout,
            getApp : getApp,
            moveStuff : moveStuff,
            getNewStuffFeed : getNewStuffFeed,
            addToHome : addToHome,
            getWidgetJson : getWidgetJson
        }

    }]);

    return app;

});