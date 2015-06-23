app.config(['formlyConfigProvider', 'formlyApiCheck', function (formlyConfigProvider, formlyApiCheck) {
    formlyConfigProvider.setType({
        name: 'multiField',
       
        template: "<div class=\"row\"> <div formly-field ng-repeat=\"field in to.fields track by $index\" ng-if=\"!field.hide\" class=\"{{::colClass[$index]}}formly-field{{field.type ? 'formly-field-' + field.type : ''}}\" options=\"field\" model=\"model\" fields=\"fields\" form=\"form\" form-id=\"formId\" form-state=\"options.formState\" index=\"$index\"> </div></div>",
        defaultOptions: {
            noFormControl: true
        }/*,
      apiCheck: {
        templateOptions: apiCheck.shape({
          fields: apiCheck.arrayOf(formlyApiCheck.formlyFieldOptions)
        })
      }*/,
        controller: function ($scope) {
            if ($scope.to.fields.length > 0) {
                var averageWidth = Math.floor(12 / $scope.to.fields.length);
                $scope.colClass = [];
                var width;
                angular.forEach($scope.to.fields, function (field, index) {
                    var width;
                    if (field.templateOptions == undefined)
                        width = averageWidth;
                    else
                        width = field.templateOptions.width || averageWidth;
                    $scope.colClass[index] = 'col-md-' + width + ' col-sm-' + width + ' col-xs-' + width;
                });
            }

            // this is what formly-form does, but because we're not using formly-form, we have to do this ourselves.
            //$scope.$watch('model', function() {
            //  angular.forEach($scope.to.fields, function(field) {
            //    field.runExpressions && field.runExpressions();
            //  });
            //}, true);


        }
    });
    formlyConfigProvider.setType({
        name: 'radioFlat',
       
        template: "<div class=\"radio-group\"> <label class=\"radio-inline\" ng-repeat=\"option in to.options track by $index\"> <input type=\"radio\" id=\"{{id + '_'+ $index}}\" value=\"{{option[to.valueProp || 'value']}}\" ng-model=\"model[options.key]\">{{option[to.keyProp || 'name']}}</label></div>",
        controller: function ($scope) {
            if (!$scope.model[$scope.options.key])
            $scope.model[$scope.options.key] = "";
        }
    });

  
    formlyConfigProvider.setType({
        name: 'repeatSection',
       
        template: '<div> <div class="repeatsection" ng-repeat="element in model[options.key] track by $index"> <formly-form fields="to.fields" model="element" form-state="formOptions"> </formly-form> <div style="margin-bottom:20px;"> <button type="button" class="btn btn-sm btn-danger" ng-click="model[options.key].splice($index, 1)"> Remove </button> </div><hr> </div><p class="AddNewButton"> <button type="button" class="btn btn-primary" ng-click="addNew()">{{to.btnText}}</button> </p></div>',
        controller: function ($scope) {

            $scope.formOptions = {
                formState: $scope.formState
            };

            $scope.addNew = function () {
                var repeatsection = $scope.model[$scope.options.key];

                var lastSection = repeatsection[repeatsection.length - 1];
                var newsection = {};
                if (lastSection) {

                    newsection = angular.copy(lastSection);

                    //angular.forEach(newsection, function (value, key, obj) {
                    //    obj[key] = "";
                    //});
                }

                repeatsection.push(newsection);

            };




        }

    });


    formlyConfigProvider.setType({
        name: 'date',
        template: '<input type="text" date-format="{{to.dateFormat}}" class="form-control" ng-model="model[options.key]" jqdatepicker/>',
       
        wrapper: ['bootstrapLabel', 'bootstrapHasError']
    });
    formlyConfigProvider.setType({
        name: 'linkText',
        template: '<input type="text" class="form-control" ng-model="model[options.key]" modelname="{{options.key}}" copy-value="{{to.parentMode}}" displayname={{to.displayField}} >',
        // ng-model="model.fundManager"-->
        wrapper: ['bootstrapLabel', 'bootstrapHasError']
    });
    formlyConfigProvider.setType({
        name: 'linkedSelect',
        //template: '<div class="radio-group"><div class="radio" ng-repeat="option in options"><label><input type="radio" name="{{id}}"  value="{{option}}">{{option}}</label></div></div>',
       
        template: "<div class=\"radio-group\"><div ng-repeat=\"option in optionsArray\" class=\"radio\"> <label><input type=\"radio\" id=\"{{id + '_'+ $index}}\" ng-value=\"option\" ng-model=\"model[options.key]\">{{option}}</label></div></div>",
        controller: function ($scope) {
            $scope.$watch('to.options', function (newValue, oldValue) {
                if (newValue) {
                    $scope.optionsArray = angular.fromJson($scope.to.options);
                    $scope.optionsArray = $scope.optionsArray[$scope.to.displayFieldName];

                }
            }

        )
        },
        wrapper: ['bootstrapLabel', 'bootstrapHasError']
    });
    formlyConfigProvider.setType({
        name: 'checkBoxList',
        template: '<div class="checkbox" ng-repeat="option in to.options"><label><input type="checkbox" checkbox-group value="{{option}}" ng-click="tickCheckBox($event,model[options.key])" ng-checked="model[options.key].indexOf(option)>=0" />{{option}}</label></div>',
        
        controller: function ($scope) {
            $scope.$watch('to.options', function (newValue, oldValue) {
                if (newValue) {
                    $scope.optionsArray = $scope.to.options;
                    //$scope.optionsArray=$scope.optionsArray[$scope.to.displayFieldName];

                }
            }

        )
        },
        wrapper: ['bootstrapLabel', 'bootstrapHasError']
    });
    formlyConfigProvider.setType({
        name: 'file',
        template: '<upload-attachment/>',
        
        /*
        controller:function($scope,formService)
        {
            
           $scope.$watch('files', function () {
              $scope.upload($scope.files);
              });
  
          $scope.upload = function (files) {
              if (files && files.length) {
                  
                  for (var i = 0; i < files.length; i++) {
                      var file = files[i];
                      // upload the files
                      promise=formService.uploadAttachment(file);
                      
                  }
              }
          };
        },*/
        wrapper: ['bootstrapLabel', 'bootstrapHasError']
    });
    formlyConfigProvider.setType({
        name: 'formButton',
        template: '<add-button/>',
        //template: '<button type="button" class="btn btn-primary" ng-click="to.btnAction" >{{to.btnText}}</button>',
        /*  controller:function($scope,ICApprovalForm) {
              
              $scope.saveComment=function(){
                  formService.saveFormData(JSON.stringify(model));
          }
          },*/
        wrapper: ['bootstrapLabel', 'bootstrapHasError']
    });
    formlyConfigProvider.setType({
        name: 'linkDropDown',
       
        template: "<div class=\"radio-group\"><div ng-repeat=\"option in to.options\" class=\"radio\"> <label><input type=\"radio\" id=\"{{id + '_'+ $index}}\" value=\"{{option}}\" ng-model=\"model[options.key]\" ng-click=\"tickRadioBtn(model,$event,options.key)\" >{{option[to.displayFieldName]}}</label> </div></div>",
        controller: function ($scope) {
            $scope.currentValue = $scope.model[$scope.options.key][$scope.to.displayFieldName];
        },
        wrapper: ['bootstrapLabel', 'bootstrapHasError']
    });

    formlyConfigProvider.setType({
        name: "textareaReadonly",
        template: '<textarea class="form-control" rows="5" ng-model="model[options.key]" readonly></textarea>',
        wrapper: ["bootstrapLabel", "bootstrapHasError"],
    });

}]);