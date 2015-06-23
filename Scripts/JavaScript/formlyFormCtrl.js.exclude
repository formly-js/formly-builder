

app.controller("FormNewCtrl", ['$scope', 'ListService', 'SPUtility', function ($scope, ListService, SPUtility) {
    var vm = this;
    var formlyFormsListService = new ListService("FormlyForms", "FormlyData");
    var myFormsDataFieldName = "formlyData";
    var sPUtility = new SPUtility();
    //get current form name
    var currentTargetListName = sPUtility.getCurrentListTitle();
    var myFormsListService = new ListService(currentTargetListName, myFormsDataFieldName);
    vm.options = {
        formState: {
            readOnly: true
        }
    };

    loadFormData = function (itemData) {
        if (itemData.length > 0) {
            formlyFormsListService.setItemId(itemData[0].ID);
            var formlyFormCode = itemData[0].formlyCode;


            JSRequest.EnsureSetup();
            var itemID = decodeURIComponent(JSRequest.QueryString["ID"]);
            if (itemID == 'undefined') {
                var formlyModelCode = itemData[0].formlyModelCode;
                vm.model = angular.fromJson(sPUtility.RemoveCDataWrap(formlyModelCode));
                vm.fields = angular.fromJson(sPUtility.RemoveCDataWrap(formlyFormCode));
            }
            else {
                myFormsListService.setItemId(itemID);
                var filter = new Array();
                var obj = {
                    "Name": "ID",
                    "Type": "Integer",
                    "Value": itemID
                };
                filter.push(obj);
                var fieldNames = new Array();
                fieldNames.push(myFormsDataFieldName);
                //myFormsListService.getListItemByIdREST(itemID)
                myFormsListService.getListFieldValues(fieldNames, filter, 1)
               .then(function (itemData) {
                   var myFormlyData = itemData[0][myFormsDataFieldName];
                   vm.model = angular.fromJson(sPUtility.RemoveCDataWrap(deEscapeColumnValue(myFormlyData)));
                   vm.fields = angular.fromJson(sPUtility.RemoveCDataWrap(formlyFormCode));
               });
            }


        }
        else {
            alert("no design found, please create a form first");
        }

    };
    overrideDefaultButtons = function () {
        var saveBtn = jQuery("a[id^='Ribbon\\.ListForm\\.Edit\\.Commit\\.Publish-']");
        if (saveBtn.length) {
            newBtn = $(saveBtn[0].outerHTML);
            newBtn.attr("id", "SPformlySaveBtn");
            newBtn.on('mousedown', function (e) {
                e.preventDefault();
                e.stopPropagation();
                vm.submitForm();
            });
            saveBtn.parent().prepend(newBtn);
            saveBtn.hide();
        };
    }
    init = function () {
        overrideDefaultButtons();
        var fieldNames = new Array();
        fieldNames.push("ID");
        fieldNames.push("formlyCode");
        fieldNames.push("formlyModelCode");

        var filters = new Array();
        var filter1 = {
            "Name": "Title",
            "Type": "Text",
            "Value": "Default"
        }
        filters.push(filter1);

        var promise = formlyFormsListService.getListFieldValues(fieldNames, filters, 1);
        promise.then(loadFormData);

    }
    init();
    showErrorInForm = function (form) {
        angular.forEach(form.$error, function (errorType) {
            angular.forEach(errorType, function (formField) {
                if (formField.$setTouched == undefined) {
                    //this is an form
                    showErrorInForm(formField);
                }
                else
                    formField.$setTouched();
            });
        });
    };
    vm.submitForm = function () {
        if (!vm.form1.$invalid) {
            promise = myFormsListService.saveFormData(vm.model, vm.fields);
            promise.then(
            function (newID) {
                //get the new id 
                myFormsListService.setItemId(newID);
                alert("save successful");
                window.location.href = "allitems.aspx";
            });
        }
        else {
            showErrorInForm(vm.form1);
            alert("There is invalid input on your form, please correct them first");
        }
    };
    function deEscapeColumnValue(s) {
        return s.replace(/&amp;(?![a-zA-Z]{1,8};)/g, "&");
    }
}]);


