app.factory('SPUtility', [function () {

    var SPUtility = function () {
        function CDataWrap(value) {
            return "<![CDATA[" + value + "]]>";
        }
        function RemoveCDataWrap(value) {
            return value.replace("<![CDATA[", "").replace("]]>", "");
        }
        getCurrentListTitle = function () {
            var currentURL = window.location.href;
            return currentURL.substring(currentURL.indexOf("/Lists/")).split('/')[2];
        }
        return {
            CDataWrap: CDataWrap,
            RemoveCDataWrap: RemoveCDataWrap,
            getCurrentListTitle: getCurrentListTitle
        }
    };

    return SPUtility;
}]);