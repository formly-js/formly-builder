app.factory('DesignFormService', [function () {
    var _listService;
    var DesignFormService = function (listService) {
        _listService = listService;
    };


    DesignFormService.prototype.getDesignForm = function (fieldNames) {


        var filters = new Array();
        var filter1 = {
            "Name": "Title",
            "Type": "Text",
            "Value": "Default"
        }
        filters.push(filter1);

        var promise = _listService.getListFieldValues(fieldNames, filters, 1);
        return promise;

    };

    return DesignFormService;
}]);