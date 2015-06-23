app.factory('commonService', function () {
    function CDataWrap(value) {
        return "<![CDATA[" + value + "]]>";
    }

    function replaceAll(find, replace, str) {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    return {
        CDataWrap: CDataWrap,
        replaceAll: replaceAll
    };


});

