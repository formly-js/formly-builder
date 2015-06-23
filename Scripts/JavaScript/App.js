'use strict';

var Settings = {
   
    siteAssetURL: "/Scripts/",
    siteRelativeRoot: "..",
    siteURL: "../Scripts/",
    PublicScriptURL: "https://spengineeringltd-public.sharepoint.com/SiteAsset/User/Scripts/"
};
    
var app = angular.module('formlyExample', ['formly', 'formlyBootstrap', 'angularFileUpload', 'builder', 'builder.components', 'validator.rules', 'ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
       //when('/FormPublish', {
       //    templateUrl: Settings.siteURL + 'View/FormPublish.html',
       //    controller: 'PublishCtrl',
       //    controllerAs: 'vm'

       //}).
       when('/FormDesign', {
           templateUrl: Settings.siteURL + 'View/FormDesign.html',
           controller: 'FormCtrl',
           controllerAs:'vm'

       }).
       otherwise({
           redirectTo: '/FormDesign'
       });
}]);
 
 app.filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);

	
app.filter('getByKey', function() {
  return function(input, key) {
    var i=0, len=input.length;
    for (; i<len; i++) {
      if (input[i].key == key) {
		  var returnObj=input[i];
		  var j=i+1;
        return {obj:returnObj,index:j};
      }
    }
    return null;
  }
});

app.filter('getByProperty', function () {
    return function (input, propertyName,propertyValue) {
        var i = 0, len = input.length;
        for (; i < len; i++) {
            if (input[i].hasOwnProperty(propertyName) && input[i][propertyName] == propertyValue) {
                var returnObj = input[i];
               
                return { obj: returnObj, index: i };
            }
        }
        return null;
    }
});
app.filter('getByHasProperty', function () {
    return function (input, propertyName) {
        var foundObjs = new Array();
        var i = 0, len = input.length;
        for (; i < len; i++) {
            if (input[i].hasOwnProperty(propertyName)) {
                foundObjs.push(input[i]);
            }
        }
        return foundObjs;
    }
});


