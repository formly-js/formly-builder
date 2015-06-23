app.controller('FormCtrl', ['formlyVersion', 'getOIMConfig', '$scope', '$builder', '$validator', '$timeout','$location', 'constantData', function MainCtrl(formlyVersion, getOIMConfig, $scope,  $builder, $validator, $timeout, $location, constantData) {
    var listName = constantData.appFormDesignListName;
  

    var vm = this;


    vm.exampleTitle = 'Formly Form Live!'; // add this

    vm.RawFieldCode = function () {
        $scope.isFormlyShowScope = true;
        $scope.rawFieldCode=getOIMConfig.getOIMConfig($scope.forms["default"], $builder.forms);
    }
    
    vm.CopyForm = function () {
       
        vm.fields = getOIMConfig.getOIMConfig($scope.forms["default"], $builder.forms);
        vm.model = getModel($scope.forms["default"]);
   
    };
    saveForm = function (FormsValuePairs,successFunc)
    {
       
    }
    vm.PublishForm = function () {
        
          
    }
    vm.SaveForm = function () {

    }
    function getModel(form) {
        var obj_model = {};
        var modelName;
        
        angular.forEach(form, function (field) {
            //check if it is not field 
            if (field.noFormControl)
            {

            if (field.key)
                modelName = field.key;
            else 
                modelName = field.id;
            if (field.hasOwnProperty("isContainer") && field["isContainer"])
                //this is an container field
            {
                if (field.hasOwnProperty("component") && field["component"] === "multiField")
                    //this is layout container
                {
                    var containerId = field.id;                 
                   // obj_model[modelName]=getModel($scope.forms[containerId]);
                }
                else
                    {
                var containerId = field.id;
                obj_model[modelName] = [];
                obj_model[modelName].push(getModel($scope.forms[containerId]));
                }
            }
            else if (field.component === "checkbox") {
                obj_model[modelName] = [];
            }
            else {
                obj_model[modelName] = '';
            }
            }
        });
        return obj_model;

    }
   

  
   
    getDesignForm=function()
    {
      
       
    }
    loadFormData = function (itemData) {
        var forms;
       
            //no design found, load default form design
             forms = constantData.defaultFormDesign;
        
        angular.forEach(forms, function (form, formName, obj) {
            //clear out existing form components
            clearForm(formName);
                angular.forEach(form, function (component) {
                    $builder.insertFormObject(formName, component.index, component);
                });
            });
           
        
       
       
    }
    clearForm = function (formName) {
        if ($builder.forms[formName])
        $builder.forms[formName].length=0;
       // existForm.length = 0;
        //angular.forEach(existForm, function (component) {
        //    $builder.removeFormObject(formName, 0);
        //});
      
    };
    var inProcess = false;
    init = function () {
        //clear all forms first for back navigation button
        //$builder.forms = {};
        $scope.forms = $builder.forms;
      
        itemData = new Array();
               loadFormData(itemData);
               $scope.$watch('forms', function (newValue, oldValue) {

                   if (!inProcess) {
                       inProcess = true;
                       $timeout(function () {
                           try {
                               vm.CopyForm();
                           }
                           catch (e) {
                               console.log(e);
                           }
                           inProcess = false;
                       }, 1000);
                   }

               }, true);
      
        
        
    }




    init();

}]);

