app.factory('SPOJSOMFactory', ['$q', '$http', function ($q, $http) {
    var hostweburl, appweburl, context, web;
    var SPOJSOMService = function () {
        //First we must call the EnsureSetup method
        JSRequest.EnsureSetup();
        hostweburl = decodeURIComponent(JSRequest.QueryString["SPHostUrl"]);
        appweburl = decodeURIComponent(JSRequest.QueryString["SPAppWebUrl"]);
        // Getting Web Context that hosts your SharePoint Hosted application
        context = new SP.ClientContext(appweburl);
        var factory = new SP.ProxyWebRequestExecutorFactory(appweburl);
        context.set_webRequestExecutorFactory(factory);
        var hostWebContext = new SP.AppContextSite(context, hostweburl);
        web = hostWebContext.get_web();


    };

    function readFile(filePath) {
        return $q(function (resolve, reject) {
            $http.get(filePath)
            .success(function (data, status, headers, config) {
                if (data && status === 200) {
                    resolve(data);
                }
                else
                    reject(status);
            });
        });
    };
    getListNewFormUrl = function (formUrl) {

        var tmp = document.createElement('a');
        tmp.href = hostweburl;
        var hostUrl = tmp.protocol + "//" + tmp.hostname;
        return (hostUrl + formUrl);
    }
    function getFormFullUrl(formUrl) {

        var tmp = document.createElement('a');
        tmp.href = hostweburl;
        var hostUrl = tmp.protocol + "//" + tmp.hostname;
        return hostUrl + formUrl;
    }
    function getListFullUrl(listname) {

        //var tmp = document.createElement('a');
        //tmp.href = hostweburl;
        //var hostUrl = tmp.protocol + "//" + tmp.hostname;
        return hostweburl + "/Lists/" + listname;
    }
    function addWebPart(formUrl, zoneId, zoneIndex, viewPath) {
        return $q(function (resolve, reject) {
            //var filePath = viewPath;
            //readFile(filePath)
            //.then(function (data) {
            //var newFormHtml = data;
            var closeWPPromise = closeWebpart(formUrl);
            closeWPPromise.then(function (data) {
                var webPartXml = '<?xml version="1.0" encoding="utf-8"?>' +
    '<WebPart xmlns="http://schemas.microsoft.com/WebPart/v2">' +
        '<Assembly>Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c</Assembly>' +
        '<TypeName>Microsoft.SharePoint.WebPartPages.ContentEditorWebPart</TypeName>' +
        '<Title>$Resources:core,ContentEditorWebPartTitle;</Title>' +
        '<FrameType>None</FrameType>' +
        '<ContentLink xmlns="http://schemas.microsoft.com/WebPart/v2/ContentEditor">' + viewPath + '</ContentLink>' +
        //'<Content xmlns="http://schemas.microsoft.com/WebPart/v2/ContentEditor"><![CDATA[' + newFormHtml + ']]></Content>' +
        '<Description>$Resources:core,ContentEditorWebPartDescription;</Description>' +
        '<PartImageLarge>/_layouts/15/images/mscontl.gif</PartImageLarge>' +
    '</WebPart>';

                var file = web.getFileByServerRelativeUrl(formUrl);
                var webPartMngr = file.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared);
                var webPartDef = webPartMngr.importWebPart(webPartXml);
                var webPart = webPartDef.get_webPart();
                webPartMngr.addWebPart(webPart, zoneId, zoneIndex);
                context.load(webPart);
                context.executeQueryAsync(
                  function () {

                      var tmp = document.createElement('a');
                      tmp.href = hostweburl;
                      var hostUrl = tmp.protocol + "//" + tmp.hostname;
                      resolve(hostUrl + formUrl);
                  },
                  function (sender, args) {
                      reject("add web part failed:" + args.get_message());
                  });
            });



        });
    }



    function closeWebpart(formUrl) {
        return $q(function (resolve, reject) {
            var file = web.getFileByServerRelativeUrl(formUrl);
            var webPartMngr = file.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared);
            var collWebPart = webPartMngr.get_webParts();
            context.load(collWebPart);
            context.executeQueryAsync(function () {
                if (!collWebPart.get_count()) {
                    alert('No Web Parts on this page.');
                }
                var oWebPartDefinition = collWebPart.itemAt(0);
                var oWebPart = oWebPartDefinition.get_webPart();
                oWebPart.set_hidden(true);
                oWebPart.set_title("make it hidden");
                oWebPartDefinition.saveWebPartChanges();
                context.load(oWebPart, 'Hidden');
                context.load(oWebPart, 'TitleUrl');

                context.executeQueryAsync(function () {
                    resolve('web part close successful');
                }, function (sender, args) {
                    reject("hide list default web part failed:" + args.get_message());
                });

            }, function (sender, args) {
                reject("get list default web part failed:" + args.get_message());
            });
        });
    };
    SPOJSOMService.prototype.addWebPart = addWebPart;
    SPOJSOMService.prototype.readFile = readFile;
    SPOJSOMService.prototype.getListNewFormUrl = getListNewFormUrl;
    SPOJSOMService.prototype.getFormFullUrl = getFormFullUrl;
    SPOJSOMService.prototype.getListFullUrl=getListFullUrl;
    return SPOJSOMService;

}]);
