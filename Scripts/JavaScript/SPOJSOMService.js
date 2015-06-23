app.factory('SPOJSOMService', ['$q', '$http', 'SPUtility', function ($q, $http, SPUtility) {
    var hostweburl, appweburl, executor, sPUtility;
    var SPOJSOMService = function () {
        //First we must call the EnsureSetup method
        JSRequest.EnsureSetup();
        hostweburl = decodeURIComponent(JSRequest.QueryString["SPHostUrl"]);
        appweburl = decodeURIComponent(JSRequest.QueryString["SPAppWebUrl"]);
        try {
        executor = new SP.RequestExecutor(appweburl);
        }
        catch(e) {
            console.log("cross domain library is no loaded");
        };
        loadCrossDomainLibrary();
        sPUtility = new SPUtility();
        };

     function loadCrossDomainLibrary() {
          return $q(function (resolve, reject) {
         // resources are in URLs in the form:
         // web_url/_layouts/15/resource
             var scriptbase = hostweburl + "/_layouts/15/";

                 // Load the js files and continue to the successHandler
             $.getScript(scriptbase + "SP.RequestExecutor.js", function () {
                 executor = new SP.RequestExecutor(appweburl);
                 console.log("cross domain library loaded");
                 resolve("cross domain library loaded");
             });
             });
             };

    getFormlyFormREST = function (listTitle, itemTitle) {
        return $q(function (resolve, reject) {



            var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getByTitle('" + listTitle + "')/items?$select=Title,ID,formlyCode&$filter=Title eq '" +itemTitle + "'&@target='" +hostweburl + "'";


            executor.executeAsync({
                    url: restQueryUrl,
                method: "GET",
                    headers: {
"Accept": "application/json; odata=verbose"
                    },
                    success: function (data, textStatus, xhr) {
                        resolve(angular.fromJson(data.body));
                },
                        error: function (xhr, textStatus, errorThrown) {
                    reject(angular.toJson(xhr));
                    }
                    });

                    });
                    };

                    saveFormlyForm = function (ListTitle, listItemType, formlyFormCode, formlyModelCode) {
                        return $q(function (resolve, reject) {
                            var itemTitle = "Default";
                            getFormlyFormREST(ListTitle, itemTitle).then(function (result) {
                                if (result.d.results.length > 0)
                        {
                    var itemToUpdate = result.d.results[0];
                    var metadata = {
                                "formlyCode": sPUtility.CDataWrap(formlyFormCode), "formlyModelCode": sPUtility.CDataWrap(formlyModelCode)
                                };
                    // Prepping our update
                                var item = angular.extend({
                                    "__metadata": { "type" : itemToUpdate["__metadata"].type }
                                    }, metadata);
                                var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getByTitle('" +ListTitle + "')/items(" +itemToUpdate.ID + ")?@target='" +hostweburl + "'";

                                executor.executeAsync({
                                    url: restQueryUrl,
                        method: "POST",
                        body: angular.toJson(item),
                            headers: {
                            "IF-MATCH": "*",
                            "content-type": "application/json;odata=verbose",
                            "X-HTTP-Method": "MERGE"
                    },
                                    success: function (data, textStatus, xhr) {
                                        resolve(data);
                    },
                                        error: function (xhr, textStatus, errorThrown) {
                                        reject(angular.toJson(xhr));
                            }
                            });
                            }
                            else
                {
                    //ListTitle item doesn't exist yet, create it
                    var body = {
                        '__metadata': { 'type': listItemType
                },
                        'Title': itemTitle,
                                        "formlyCode": formlyFormCode,
                        "formlyModelCode" : formlyModelCode
                        };
                    var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getByTitle('" +ListTitle + "')/items?@target='" +hostweburl + "'";

                    executor.executeAsync({
                            url: restQueryUrl,
                            method: "POST",
                                body: angular.toJson(body),
                            headers: {
                            "content-type": "application/json;odata=verbose",
                            "accept": "application/json;odata=verbose",
                            "X-RequestDigest": $("#__REQUESTDIGEST").val()
                        },
                            success: function (data, textStatus, xhr) {
                            resolve(angular.fromJson(data.body).d);
                            },
                                error: function (xhr, textStatus, errorThrown) {
                                            reject(angular.toJson(xhr));
                    }
});
                }
                });



            });

            };
                createSPList = function (body) {

                    return $q(function (resolve, reject) {
            var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists?@target='" +hostweburl + "'";

            executor.executeAsync({
                url: restQueryUrl,
                    method: "POST",
                        body: angular.toJson(body),
                    headers: {
                        "accept": "application/json;odata=verbose",
                    "content-type": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                    },
                        success: function (data, textStatus, xhr) {
                            resolve(angular.fromJson(data.body).d);
                },
                                error: function (xhr, textStatus, errorThrown) {
                                    reject(angular.toJson(xhr));
                }
                });
                });
                };
    checkListExist = function (listTitle) {
        return $q(function (resolve, reject) {
            var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists?$filter=Title eq '" +listTitle + "'&@target='" +hostweburl + "'";
            executor.executeAsync({
                    url: restQueryUrl,
                type: "GET",
                headers: {
                    "accept": "application/json;odata=verbose"
                    },
                        success: function (data, textStatus, xhr) {
                            resolve(angular.fromJson(data.body).d);
                },
                                error: function (xhr, textStatus, errorThrown) {
                    reject(angular.toJson(xhr));
                    }
            });
        });
        };
    checkListFieldExist = function (listTitle, listFieldName) {
        return $q(function (resolve, reject) {
            //var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/GetByTitle('" + listTitle + "')/fields/GetByInternalNameOrTitle('" + listFieldName + "')?@target='" + hostweburl + "'";
            var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/GetByTitle('" +listTitle + "')/fields?$filter=InternalName eq '" +listFieldName + "'&@target='" +hostweburl + "'";
            executor.executeAsync({
                    url: restQueryUrl,
                type: "GET",
                headers: {
                    "accept": "application/json;odata=verbose"
                    },
                        success: function (data, textStatus, xhr) {
                            resolve(angular.fromJson(data.body).d);
                },
                                error: function (xhr, textStatus, errorThrown) {
                    reject(angular.toJson(xhr));
                }
                });
                });
                };
    getFormlyList = function (listTitle) {

        return $q(function (resolve, reject) {
            var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/GetByTitle('"+listTitle+"')?@target='" +hostweburl + "'";

            executor.executeAsync({
                    url: restQueryUrl,
                type: "GET",
                headers: {
                    "accept": "application/json;odata=verbose"
                    },
                        success: function (data, textStatus, xhr) {
                            resolve(angular.fromJson(data.body).d);
                },
                                error: function (xhr, textStatus, errorThrown) {
                    reject(angular.toJson(xhr));
                    }
                    });
        });
        };
    addListCustomField = function (hostTargetListName, formly2SPFactory, field) {
        return $q(function (resolve, reject) {
            var listFieldName = field.templateOptions.listFieldName;
            //check if this field already exist
            checkListFieldExist(hostTargetListName, listFieldName)
            .then(function (data) {
                //if not exist
                if (data.results.length === 0) {
                    var body = formly2SPFactory.createRESTBody(field);
                    return createFormlyListField(hostTargetListName, body)
                    .then(function (data) {
                        return addListFieldToDefaultView(hostTargetListName, listFieldName);
            });
            }
                else {
                    resolve(data);
            }
            })
            .then(function (data) {
                resolve(data);
                    })
            .catch(function (error) {
                reject(error);
            });
        });
        }
    addListFieldToDefaultView = function (listTitle, listFieldName) {
        return $q(function (resolve, reject) {
            var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/GetByTitle('" +listTitle + "')/DefaultView/viewfields/addviewfield('" +listFieldName + "')?@target='" +hostweburl + "'";

            executor.executeAsync({
                    url: restQueryUrl,
                        method: "POST",
                success: function (data, textStatus, xhr) {
                    resolve(data);
                },
                    error: function (xhr, textStatus, errorThrown) {
                    reject(angular.toJson(xhr));
                    }
                    });

                    });
                    }
    addListCustomFieldsLoop = function (hostTargetListName, formly2SPFactory, updatingFormFields, i, count) {
        return $q(function(resolve, reject) {
            if (i < count)
        {
                addListCustomField(hostTargetListName, formly2SPFactory, updatingFormFields[i])
                .then(function(data) {
                    i++;
                    return addListCustomFieldsLoop(hostTargetListName, formly2SPFactory, updatingFormFields, i, count)
        })
                .then(function (data) {
                    resolve(data);
    })
                .catch(function (error) {
                    reject(error);
    })
    }
else {
    resolve("reached the end");
    }

    });
    };
    addListCustomFields = function (hostTargetListName, formly2SPFactory, updatingFormFields) {
        return $q(function (resolve, reject) {
            var i = 0;
            var fieldCount = updatingFormFields.length;
            addListCustomFieldsLoop(hostTargetListName, formly2SPFactory, updatingFormFields, i, fieldCount)
            .then(function (data) {
                resolve(data);
    })
            .catch(function (error) {
                reject(error);
            });
        });
        };
    createFormlyListField = function (listTitle, body) {

        return $q(function (resolve, reject) {

            var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/GetByTitle('"+listTitle+"')/fields?@target='" +hostweburl + "'";

            executor.executeAsync({
                url: restQueryUrl,
                    method: "POST",
                        body: angular.toJson(body),
                        headers: {
                            "accept": "application/json;odata=verbose",
                    "content-type": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                    },
                        success: function (data, textStatus, xhr) {
                            resolve(angular.fromJson(data.body).d);
                },
                                error: function (xhr, textStatus, errorThrown) {
                    reject(angular.toJson(xhr));
                }
            });
            });
            };
                getListForms = function (listTitle)
                {
                    return $q(function (resolve, reject) {
                        var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getByTitle('" +listTitle + "')/Forms?&@target='" +hostweburl + "'";
                        executor.executeAsync({
                                url: restQueryUrl,
                            method: "GET",
                                headers: {
                            "Accept": "application/json; odata=verbose"
                            },
                                success: function (data, textStatus, xhr) {
                                    resolve(angular.fromJson(data.body).d);
                },
                                        error: function (xhr, textStatus, errorThrown) {
                    reject(angular.toJson(xhr));
                }
            });

            });
            };
            getCurrentUserDisplayName = function () {
                return $q(function (resolve, reject) {
                var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/SP.UserProfiles.PeopleManager/GetMyProperties?$select=DisplayName&@target='" +hostweburl + "'";
        executor.executeAsync({
                url: restQueryUrl,
                        method: "GET",
                            headers: {
                        "Accept": "application/json; odata=verbose"
                        },
                            success: function (data, textStatus, xhr) {
                                resolve(angular.fromJson(data.body).d);
                                },
                                error: function(xhr, textStatus, errorThrown) {
                                    reject(angular.toJson(xhr));
}
        });
        });
        };
    SPOJSOMService.prototype.getFormlyFormREST = getFormlyFormREST;
    SPOJSOMService.prototype.saveFormlyForm = saveFormlyForm;
    SPOJSOMService.prototype.getFormlyList = getFormlyList;
    SPOJSOMService.prototype.createSPList = createSPList;
    SPOJSOMService.prototype.createFormlyListField = createFormlyListField;
    SPOJSOMService.prototype.checkListExist = checkListExist;
    SPOJSOMService.prototype.getListForms = getListForms;
    SPOJSOMService.prototype.addListCustomFields = addListCustomFields;
    SPOJSOMService.prototype.getCurrentUserDisplayName = getCurrentUserDisplayName;
    return SPOJSOMService;

}]);
