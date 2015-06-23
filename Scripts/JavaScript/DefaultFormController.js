

app.controller("DefaultFormController", ['$scope', 'formService', function ($scope, formService) {

    $scope.init = function () {
        $scope.approvalComment = "";

        //load data to form

        // formService.loadForm7Data(formSettings.targetFormID);


        formService.radioButtonBehavior();
        //$scope.hideApprovalComment();
       
    }

    $scope.saveForm = function () {
        loadFormData=function(dynamicFormID)
        {
            formService.saveForm(dynamicFormID);
        }
        formService.getActiveFormID(loadFormData);
    }
    $scope.testBind = function () { alert($scope.approvalComment); }
    $scope.init();
}]);