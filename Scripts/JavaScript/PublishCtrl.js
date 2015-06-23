app.controller("PublishCtrl", ['$scope', 'DesignFormService', 'ListService', 'SPOJSOMService', '$location', 'SPOJSOMFactory', '$q', 'constantData', 'Formly2SPFactory','getOIMConfig', function ($scope, DesignFormService, ListService, SPOJSOMService, $location, SPOJSOMFactory, $q, constantData, Formly2SPFactory,getOIMConfig) {
    var listName = constantData.appFormDesignListName;
    var vm = this;
    var listService = new ListService(listName);
    var sPOJSOMService = new SPOJSOMService();
    var sPOJSOMFactory = new SPOJSOMFactory();
    var designFormService = new DesignFormService(listService);
    var hostDesignListName = "FormlyForms";
    var formly2SPFactory = new Formly2SPFactory();
    vm.published = true;
    vm.publishForm = function () {

        var listItemType;


        //get the FormlyForms list from host web, if not found, create it
        var listPromise = sPOJSOMService.checkListExist(hostDesignListName);
        listPromise.then(function (data) {
            if (data.results.length === 0) {
                var body = {
                    '__metadata': { 'type': 'SP.List' },
                    'AllowContentTypes': true,
                    'BaseTemplate': 100,
                    'ContentTypesEnabled': true,
                    'Description': 'formly custom forms',
                    'Title': hostDesignListName
                };
                sPOJSOMService.createSPList(body)
                .then(function (data) {
                    listItemType = data.ListItemEntityTypeFullName;
                    var body = {
                        '__metadata': { 'type': 'SP.FieldMultiLineText' },
                        'Title': 'formlyCode',
                        'FieldTypeKind': 3,
                        'NumberOfLines': 8
                    };
                    return sPOJSOMService.createFormlyListField(hostDesignListName, body);
                })
                .then(function (data) {

                    var body = {
                        '__metadata': { 'type': 'SP.FieldMultiLineText' }, 'Title': 'formlyModelCode', 'FieldTypeKind': 3, 'NumberOfLines': 8
                    };
                    return sPOJSOMService.createFormlyListField(hostDesignListName, body);
                })
                .then(function (data) {
                    //insert the desing code into the newly created design list
                    publishToHost(listItemType);
                })
                .catch(function (error) {
                    alert("error:" + error);
                })
            }
            else // app design form list found
            {
                listItemType = data.results[0].ListItemEntityTypeFullName;
                publishToHost(listItemType);
            }
        });





    };

    publishToHost = function (listItemType) {
        //update/insert
        updateFormlyList(hostDesignListName, listItemType, vm.rawfieldsCode, angular.toJson(vm.model))
        .then(function (data) {
            //check if target form list exists, if not, creates it
            return vm.createTargetList();
        })
        .then(function (data) {
            alert("form published successfully");
            vm.published = false;
        })
        .catch(function (error) {
            if (error.indexOf("web part failed") > -1) {
                    vm.published = false;
                    $scope.showInstruction = true;
                    vm.newFormUrl = sPOJSOMFactory.getListFullUrl(vm.publishModel.TargetListName);
                alert("Because an permission limitation, an SharePoint Store App can't change a list's defaults forms by itself. Please follow the instructions below to do it manually");
            }
            else {
                alert("publish failed:" +error);
    };
});

    };
    vm.redirectPublishedForm=function()
    {
        //redirect to host target list new form
        window.location.href = vm.newFormUrl;
    }
    vm.createTargetList = function () {
        return $q(function (resolve, reject) {
            var hostTargetListName = vm.publishModel.TargetListName;
            var listItemType, webUrl;
            var formUrl = {};

            //first save TargetListName
            var FormsValuePairs = new Array();
            listService.pushFieldUpdate(FormsValuePairs, "TargetListName", hostTargetListName);
            var itemID = listService.getItemId();
            var updateTargetListName = listService.updateFormItem(itemID, FormsValuePairs);

            //get the FormlyForms list from host web, if not found, create it
            updateTargetListName.then(function () {
                return sPOJSOMService.checkListExist(hostTargetListName);
            })
            .then(function (data) {
                if (data.results.length === 0) {
                    var body = {
                        '__metadata': { 'type': 'SP.List' },
                        'AllowContentTypes': true,
                        'BaseTemplate': 100,
                        'ContentTypesEnabled': true,
                        'Description': 'list to hold filled forms',
                        'Title': hostTargetListName
                    };
                    sPOJSOMService.createSPList(body) //create the target list
                    .then(function (data) { //add formlyData to the target list
                        listItemType = data.ListItemEntityTypeFullName;
                        webUrl = data.ParentWebUrl;
                        var body = {
                            '__metadata': { 'type': 'SP.FieldMultiLineText' },
                            'Title': 'formlyData',
                            'FieldTypeKind': 3,
                            'NumberOfLines': 8
                        };
                        return sPOJSOMService.createFormlyListField(hostTargetListName, body);
                    })
                    .then(function (data) { //add other list fields if not exist
                        //find all fields which need to be added
                        var updatingFormFields = new Array();
                        listService.findAllUpdateFields(vm.fields, updatingFormFields);
              
                        return sPOJSOMService.addListCustomFields(hostTargetListName,formly2SPFactory, updatingFormFields);
                    })
                    .then(function (data) { //get list form urls
                        return sPOJSOMService.getListForms(hostTargetListName);
                    })
                    .then(function (data) { //change default list forms
                        if (data.results.length === 0)
                            alert("no forms found for the target list");
                        angular.forEach(data.results, function (element, index, obj) {
                            var fromType = element.FormType;
                            var formURL = element.ServerRelativeUrl;
                            switch (fromType) {
                                case 4: //displayForm
                                    formUrl.DisplayFormUrl = formURL;
                                    break;
                                case 6://edit form
                                    formUrl.EditFormUrl = formURL;
                                    break;
                                case 8://new form
                                    formUrl.NewFormUrl = formURL;
                                    break;
                                default:

                            }
                        });

                        var zoneId = "Main";
                        var zoneIndex = 1;
                        var viewNewPath = Settings.PublicScriptURL + 'View/FormNew.html';
                        var viewDisplayPath = Settings.PublicScriptURL + 'View/FormDisplay.html';
                        var newFormUrlFull=sPOJSOMFactory.getFormFullUrl(formUrl.NewFormUrl);
                                //record this 
                                vm.newFormUrl = newFormUrlFull;
                                var FormsValuePairs = new Array();
                                listService.pushFieldUpdate(FormsValuePairs, "newFormUrl", newFormUrlFull);
                                var itemID = listService.getItemId();
                                return listService.updateFormItem(itemID, FormsValuePairs)
                                .then(function (data) {
                                    return sPOJSOMFactory.addWebPart(formUrl.NewFormUrl, zoneId, zoneIndex, viewNewPath);
                                })                              
                                .then(function (data) {
                                    return sPOJSOMFactory.addWebPart(formUrl.EditFormUrl, zoneId, zoneIndex, viewNewPath);
                                })
                                .then(function (data) {
                                    return sPOJSOMFactory.addWebPart(formUrl.DisplayFormUrl, zoneId, zoneIndex, viewDisplayPath);
                                })
                                .catch(function (error) {
                                    reject(error);
                                   // console.log("change list default forms failed:" + error);
                                })



                    })
                    .then(function (data) //list creation completed
                    {
                        resolve("target list creation successful");
                    })
                    .catch(function (error) {
                        reject(error);
                        console.log("error:" +error);
                    })
                }
                else //target list found
                {
                    //find all fields which need to be added
                    var updatingFormFields = new Array();
                    listService.findAllUpdateFields(vm.fields, updatingFormFields);
              
                    sPOJSOMService.addListCustomFields(hostTargetListName, formly2SPFactory, updatingFormFields)
                    .then(function (data) {
                        //set redirect url if not defined
                        if (vm.newFormUrl == undefined)
                        {
                            sPOJSOMService.getListForms(hostTargetListName)
                            .then(function (data){ 
                                if (data.results.length === 0)
                                    alert("no forms found for the target list");
                                var formUrl={};
                                angular.forEach(data.results, function (element, index, obj) {
                                    var fromType = element.FormType;
                                    var formURL = element.ServerRelativeUrl;
                                    switch (fromType) {
                                        case 4: //displayForm
                                            formUrl.DisplayFormUrl = formURL;
                                            break;
                                        case 6://edit form
                                            formUrl.EditFormUrl = formURL;
                                            break;
                                        case 8://new form
                                            formUrl.NewFormUrl = formURL;
                                            break;
                                        default:
                                    };
                                });
                              
                                //record this 
                                vm.newFormUrl = sPOJSOMFactory.getListNewFormUrl(formUrl.NewFormUrl);
                                var FormsValuePairs = new Array();
                                listService.pushFieldUpdate(FormsValuePairs, "newFormUrl", vm.newFormUrl);
                                var itemID = listService.getItemId();
                                listService.updateFormItem(itemID, FormsValuePairs)
                                .then(function (data) {
                                    resolve("target list already exist");
                                }
                                );
                                
                            })
                            
                        }
                        else
                            resolve("target list already exist");
                            })
                    .catch(function (error) {
                        reject(error);
                        alert("error:" + error);
                    })
                }
            });
        });
    };
    function updateFormlyList(listTitle, listItemType, fieldsCode, modelCode) {
        //push this formlyCode to destination list in host web
        var savePromise = sPOJSOMService.saveFormlyForm(listTitle, listItemType, fieldsCode, modelCode);
        return savePromise;
        //savePromise.then(function (result) {

        //    //redirect to host target list new form
        //    window.location.href = vm.newFormUrl;
        //}, function (fail) {
        //    alert("failed:" + fail);
        //});
    }

    loadFormData = function (itemData) {
        if (itemData.length > 0) {
            listService.setItemId(itemData[0].ID);
            var formlyFormCode = itemData[0].formlyCode;
            var formlyModelCode = itemData[0].formlyModelCode;
            var TargetListName = itemData[0].TargetListName;
            var newFormUrl = itemData[0].newFormUrl;
            vm.rawmodelCode = formlyModelCode;
            vm.model = angular.fromJson(formlyModelCode);
           
            vm.rawfieldsCode = formlyFormCode;
            vm.fields = angular.fromJson(formlyFormCode);     

            vm.publishModel = { "TargetListName": TargetListName == !'' ? TargetListName : "MyForm" };
            vm.publishFields = constantData.publishFields;
            vm.newFormUrl = newFormUrl;
        }
        else {
            alert("no design found, please create a form first");
        }

    };
    init = function () {

        var fieldNames = new Array();
        fieldNames.push("ID");
        fieldNames.push("formlyCode");
        fieldNames.push("formlyModelCode");
        fieldNames.push("TargetListName");
        fieldNames.push("newFormUrl");

        var promise = designFormService.getDesignForm(fieldNames);
        promise.then(loadFormData);
    }
    init();
    vm.go = function (path) {
        //$location.path(path);
        var currentURL = window.location.href;
        var newURL = currentURL.replace("FormPublish", "FormDesign");
        window.location.href = newURL;
    };
    
}]);
