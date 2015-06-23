app.directive('jqdatepicker', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.datepicker({
                dateFormat: attrs.dateFormat
            });
        }
    };
});

app.directive("checkboxGroup", function () {
    return {
        restrict: "A",
        //scope : {
        //    model: "=",
        //    options:"="
        //    },
        controller: function ($scope) {
            if (!$scope.model[$scope.options.key])
                $scope.model[$scope.options.key] = [];
            var currentSelection = $scope.model[$scope.options.key];
            $scope.tickCheckBox = function ($event) {
                var elem = $event.currentTarget;
                if (!currentSelection)
                    currentSelection = [];
                var index = currentSelection.indexOf(elem.value);
                // Add if checked
                if (elem.checked) {
                    if (index === -1) currentSelection.push(elem.value);
                }
                    // Remove if unchecked
                else {
                    if (index !== -1) currentSelection.splice(index, 1);
                }
            }
        }
    };
});
app.directive("copyValue", function () {
    return {
        restrict: "A",
        link: function (scope, elem, attrs) {

            // Determine initial checked boxes
            scope.$watch(attrs.copyValue, function (newValue, oldValue) {
                if (newValue) {
                    if (newValue[attrs.displayname])
                        scope.model[attrs.modelname] = newValue[attrs.displayname][0];
                    else if (newValue.indexOf("{") == 0) {
                        value = angular.fromJson(newValue);
                        scope.model[attrs.modelname] = value[attrs.displayname][0];
                    }


                }

            });



        }
    }
});
app.directive("fileUpload", function ($upload) {
    return {
        restrict: "A",
        link: function (scope, elem, attrs) {

            // Determine initial checked boxes
            scope.$watch(attrs.copyValue, function (newValue, oldValue) {
                if (newValue && newValue[attrs.displayname])
                    scope.model[attrs.modelname] = newValue[attrs.displayname][0];
            });



        }
    }
});

app.directive("radioChecked", function () {
    return {
        restrict: "A",
        link: function (scope, elem, attrs) {
            if (attrs.radioChecked)
                elem[0].click();
            scope.tickRadioBtn = function (model, $event, key) {
                var elem = $event.currentTarget;

                model[key] = elem.value;
            };

        }
    }
});

app.directive("addButton", function (formService) {
    return {
        restrict: 'AE',
        replace: true,
        template: '<button type="button" class="btn btn-primary" ng-click="addNewInvestment()" >{{to.btnText}}</button>',

        link: function (scope, iElement, iAttrs) {

            scope.addNewInvestment = function () {
                var repeatsection = scope.model["investments"];
                //remove the bits which is added in by angular
                lastSection = repeatsection[repeatsection.length - 1];
                lastSectionJSON = angular.toJson(lastSection);
                newsectionJSON = lastSectionJSON.substring(0, lastSectionJSON.lastIndexOf(',')) + "}";
                newsection = angular.fromJson(newsectionJSON);

                repeatsection.push(newsection);

            }
        }

    }

});
app.directive("uploadAttachment", function (formService) {
    return {
        restrict: 'AE',
        //replace:true,
        //template:'<div ng-file-drop ng-file-select ng-model="files" class="drop-box"drag-over-class="dragover" ng-multiple="true" allow-dir="true"accept="image/*,application/pdf">Drop files here or click to upload</div><div ng-no-file-drop>File Drag/Drop is not supported for this browser</div><ul><li ng-repeat="f in files" style="font:smaller">{{f.name}}</li></ul>'
        templateUrl: Settings.siteURL + 'SiteAsset/JavaScript/templates/fileUpload.html',
        controller: function ($scope) {

            $scope.$watch('files', function () {
                $scope.upload($scope.files);
            });

            $scope.upload = function (files) {
                if (files && files.length) {
                    var i = 0;
                    var file = files[i];
                    uploadoneFile(file, files, i)

                }
            };
            function getfileLink(url, fileName) {

                return "<a target='_blank' href='" + url + "'>" + fileName + "</a>&nbsp;&nbsp;&nbsp;&nbsp;<input type='button' ng-click='deleteFile(&quot;" + url + "&quot;,&quot;" + fileName + "&quot;)' value='delete'/>";
            }
            function uploadoneFile(file, files, i) {
                // upload the files
                promise = formService.uploadAttachment(file, JSON.stringify($scope.model));
                promise.then(function (fileLink) {
                    var filelinkHtml = getfileLink(Settings.siteFullURL + fileLink.link, fileLink.fileName);
                    $scope.model.supportingDocuments.push(filelinkHtml);
                    i++;
                    if (i < files.length) {
                        file = files[i];
                        uploadoneFile(file, files, i);
                    }
                });

            }
            $scope.deleteFile = function (url, fileName) {
                promise = formService.deleteAttachment(url);
                promise.then(function () {
                    //remove from from
                    var itemIndex = $scope.model.supportingDocuments.indexOf(getfileLink(url, fileName));
                    $scope.model.supportingDocuments.splice(itemIndex, 1);
                }, function (error) { });
            }
        }

    }

});
app.directive('dynamic', function ($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, ele, attrs) {
            scope.$watch(attrs.dynamic, function (html) {
                ele.html(html);
                $compile(ele.contents())(scope);
            });
        }
    };
});

app.directive('kcdRecompile', function ($compile, $parse) {
    'use strict';
    return {
        scope: true, // required to be able to clear watchers safely
        compile: function (el) {
            var template = getElementAsHtml(el);
            return function link(scope, $el, attrs) {
                var stopWatching = scope.$parent.$watch(attrs.kcdRecompile, function (_new, _old) {
                    var useBoolean = attrs.hasOwnProperty('useBoolean');
                    if ((useBoolean && (!_new || _new === 'false')) || (!useBoolean && (!_new || _new === _old))) {
                        return;
                    }
                    // reset kcdRecompile to false if we're using a boolean
                    if (useBoolean) {
                        $parse(attrs.kcdRecompile).assign(scope.$parent, false);
                    }

                    // recompile
                    var newEl = $compile(template)(scope.$parent);
                    $el.replaceWith(newEl);

                    // Destroy old scope, reassign new scope.
                    stopWatching();
                    scope.$destroy();
                });
            };
        }
    };

    function getElementAsHtml(el) {
        return angular.element('<a></a>').append(el.clone()).html();
    }
});

app.directive('clickAndDisable', function () {
    return {
        link: function (scope, iElement, iAttrs) {
            iElement.bind('click', function () {
                iElement.prop('disabled', true);
            });
        }
    };
});
app.directive('manualInstruction', function () {
    return {
        link: function (scope, iElement, iAttrs) {
            scope.$watch("showInstruction", function () {
                if (scope.showInstruction) {
                    var el = angular.element('<span/>');
                    el.append('<strong>Please follow <a target="_blank" href="https://spengineeringltd-public.sharepoint.com/SitePages/ChangeListDefaultForms.aspx">this instruction<a/> before you click</strong> ');
                    iElement.prepend(el);
                }
            });
            
           
        }
    };
});

try {
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date(); a = s.createElement(o),
        m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

    ga('create', 'UA-63734510-1', 'auto');
    ga('send', 'pageview');
}
catch (e)
{ console.log(e);};

