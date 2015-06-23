app.controller("ApprovalFormController", ['$scope', 'formService', function ($scope, formService) {
    $scope.emptyFormID;
    $scope.hideControls = false;
    $scope.init = function () {
        $scope.WorkflowStage;

        loadFormData = function (emptyFormID) {
            $scope.emptyFormID = emptyFormID;
            //load dynamic form
            formService.LoadFormData($(formSettings.dynamicFormID), emptyFormID, formSettings.dynamicFormListName);

            //load data to form

            formService.loadForm7Data(formSettings.targetFormID);

            formService.radioButtonBehavior();
        }

        formService.getActiveFormID(loadFormData);
    }


    $scope.setWorkflowStage = function (stage) {
        if ($scope.WorkflowStage == undefined) {
            $scope.WorkflowStage = new Array();
            $scope.WorkflowStage.push(["WorkflowStage", stage]);
        }
        else {
            $scope.WorkflowStage[0][1] = stage;
        }
        return $scope.WorkflowStage;
    }
    $scope.ApproveForm = function () {
        $scope.ApprovalCommentNotRequired();

        succfunction = function (id) {
            $scope.setWorkflowStage("approved");

            formService.updateCertificateList($scope.WorkflowStage, id);
            alert("This form has been approved.");
        }
        //save the form first, then update WorkflowStage
        formService.SubmitFormData(succfunction);
    }

    $scope.ApprovalCommentRequired = function () {
        //if (!ApprovalCommentNoEmpty())
        $("#ApproverComment").addClass("required");
    }
    $scope.ApprovalCommentNotRequired = function () {

        $("#ApproverComment").removeClass("required");
    }
    $scope.RejectForm = function () {
        //check approval comment is not empty
        $scope.ApprovalCommentRequired();
        succfunction = function (id) {
            $scope.setWorkflowStage("rejected");

            formService.updateCertificateList($scope.WorkflowStage, id);
            alert("This form has been rejected.The submitter will be notified with outcome.");
        }
        formService.SubmitFormData(succfunction);
    }
    $scope.RequireInfo = function () {
        $scope.ApprovalCommentRequired();
        succfunction = function (id) {
            $scope.setWorkflowStage("requireMoreInfo");

            formService.updateCertificateList($scope.WorkflowStage, id);
            alert("The submitter will be contacted to submit more information.");
        }
        formService.SubmitFormData(succfunction);
    }


    $scope.init();


}]);