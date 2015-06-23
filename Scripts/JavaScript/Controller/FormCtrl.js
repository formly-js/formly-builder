app.controller('FormCtrl', ['formlyVersion', 'getOIMConfig', '$scope', 'ListService', '$builder', '$validator', '$timeout', 'DesignFormService', '$location', 'constantData', function MainCtrl(formlyVersion, getOIMConfig, $scope, ListService, $builder, $validator, $timeout, DesignFormService, $location, constantData) {
    var listName = constantData.appFormDesignListName;
    var listService = new ListService(listName);

    var vm = this;


    vm.exampleTitle = 'Formly Form Live!'; // add this

   
    
    vm.CopyForm = function () {
       
        vm.fields = getOIMConfig.getOIMConfig($scope.forms["default"], $builder.forms);
        vm.model = getModel($scope.forms["default"]);
   
    };
    saveForm = function (FormsValuePairs,successFunc)
    {
        var itemID = listService.getItemId();

        if (!itemID)
            listService.pushFieldUpdate(FormsValuePairs, "Title", "Default");

        var promise = listService.updateFormItem(itemID, FormsValuePairs);
        promise.then(function (newID) {
            listService.setItemId(newID);
            if (successFunc)
            successFunc();
           
        });
    }
    vm.PublishForm = function () {
        //save form 
        //and publish
        var FormsValuePairs = new Array();
        listService.pushFieldUpdate(FormsValuePairs, "DesignCode", listService.CDataWrap(angular.toJson($builder.forms)));
        listService.pushFieldUpdate(FormsValuePairs, "formlyCode", listService.CDataWrap(angular.toJson(getOIMConfig.getOIMConfig($scope.forms["default"], $builder.forms))));
        listService.pushFieldUpdate(FormsValuePairs, "formlyModelCode", listService.CDataWrap(angular.toJson(vm.model)));
        

        saveForm(FormsValuePairs, function () { $location.path("/FormPublish"); });
          
    }
    vm.SaveForm = function () {
        //save design form first
        var FormsValuePairs = new Array();
        listService.pushFieldUpdate(FormsValuePairs, "DesignCode", listService.CDataWrap(angular.toJson($builder.forms)));
        
        saveForm(FormsValuePairs, function () { alert("save successful") });
   


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
        var fieldNames = new Array();
        fieldNames.push("ID");
        fieldNames.push("DesignCode");
        var designFormService = new DesignFormService(listService);
        var promise = designFormService.getDesignForm(fieldNames);
        return promise;
       
    }
    loadFormData = function (itemData) {
        var forms;
        if (itemData.length > 0) {
            forms = angular.fromJson(itemData[0].DesignCode);
            listService.setItemId(itemData[0].ID);
        }
        else {
            //no design found, load default form design
             forms = constantData.defaultFormDesign;
        }
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
        //getDesignForm().          
        //   then(function (itemData) {
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
           //});
        
        
    }




    init();

}]);

