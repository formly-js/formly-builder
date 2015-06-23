app.factory('Formly2SPFactory',[function () {
    var formly2SPFactory = function () {
        createRESTBody = function (field) {
            var body;
            var fieldType = field.type;
            var fieldTitle = field.templateOptions.listFieldName;
            switch (fieldType) {
                case 'date':
                    body = {
                        '__metadata': { 'type': 'SP.FieldDateTime' },
                        'Title': fieldTitle,
                        'FieldTypeKind': 4,
                        'DisplayFormat': 0
                    };
                    break;
                case 'textarea':
                    body = {
                        '__metadata': { 'type': 'SP.FieldMultiLineText' },
                        'Title': fieldTitle,
                        'FieldTypeKind': 3,
                        'NumberOfLines': 8
                    };
                    break;
                default:
                    body = {
                        '__metadata': { 'type': 'SP.FieldText' },
                        'Title': fieldTitle,
                        'FieldTypeKind': 2
                    };

            };
            return body;
        };
        return {
            createRESTBody: createRESTBody
        }
    }
    return formly2SPFactory;

    
}]);