app.controller("FormController", ['$scope', 'formService', function ($scope, formService) {
    $scope.afterInit = false;
    $scope.init = function () {

        $scope.approvalComment = "";
        $scope.emptyFormID;

        afterFormLoaded = function () {
            formService.radioButtonBehavior();
            var e = $("#ApproverComment");
            var $e = angular.element(e);
            $e.triggerHandler("change");
        }
        loadUserFormData = function () {
            loadForm7DataOnID = function (certificateID) {

                formService.loadForm7Data(formSettings.targetFormID, afterFormLoaded, certificateID);


            };

            formID = formService.getUrlParameter("formID");
            //check if the current for the current dynamic form already has an record
            if (!($.isNumeric(formID))) {

                var fieldNames = new Array();
                fieldNames.push("ID");
                var filter = new Array();
                var obj = {
                    "Name": "DynamicFormID",
                    "Type": "Integer",
                    "Value": $scope.emptyFormID

                };
                filter.push(obj);
                var thisUserID = $().SPServices.SPGetCurrentUser({
                    fieldName: "ID",
                    debug: false
                });

                var obj2 = {
                    "Name": "Author",
                    "Lookup": "LookupId='True'",
                    "Type": "Lookup",
                    "Value": thisUserID

                };
                filter.push(obj2);
                CAMLRowLimit = 1;
                callbackFunction = function (certificateID) {

                    if (certificateID.length > 0 && $.isNumeric(certificateID[0].ID)) {
                        loadForm7DataOnID(certificateID[0].ID);
                    }
                    else {
                        //if no user data found for this quarter, just call 
                        //this to add the red stars
                        formService.loadForm7Data(formSettings.targetFormID, null, null);
                        //this to register comment box behavior
                        afterFormLoaded();
                        //get current managment report id
                        formService.GetManagmentReportID(GetReportID, $scope.emptyFormID);
                    }
                }
                formService.getListFieldValues(formSettings.userCertificateList, fieldNames, filter, CAMLRowLimit, callbackFunction)

            }
            else {
                loadForm7DataOnID(formID);
            }
        };
        loadFormData = function (emptyFormID) {
            $scope.emptyFormID = emptyFormID;
            formService.LoadFormData($(formSettings.dynamicFormID), emptyFormID, formSettings.dynamicFormListName, loadUserFormData);

        };
        formService.getActiveFormID(loadFormData);


    }
    $scope.ReportItemID = 0;
    function GetReportID(itemData) {
        if (itemData.length > 0 && $.isNumeric(itemData[0].ID)) {
            ReportItemID = itemData[0].ID;
        }
        else {
            alert("Management report can't be found, please contact system administrator");
            return;
        }
        $scope.ReportItemID = ReportItemID;
    }

    $scope.testBind = function () { alert($scope.approvalComment); }
    $scope.init();
    $scope.SubmitForm = function () {

        formService.SubmitForm($scope.emptyFormID, $scope.ReportItemID);

    };

    function getAllYes() {
        var result = true;
        $("input[type='radio']:checked").each(
     function () {
         if ($(this).val() == "No") {
             //found no answer
             result = false;
             return result;
         }

     });
        return result;
    };

}]);