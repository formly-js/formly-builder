app.factory('ListService', ['$q', '$filter', 'SPUtility', function ($q, $filter, SPUtility) {

    var ListService = function (thisListName) {
        var itemId, formlyDataFieldName, listName;
        setListName(thisListName);
        formlyDataFieldName = "formlyData";
        var sPUtility=new SPUtility()
        function setItemId(value) {
            itemId = value;
        }
        function getItemId() {
            return itemId;
        }
        function setListName(value) {
            listName = value;
        }
        function getListName() {
            return listName;
        }

        function getUrlParameter(sParam) {
            var sPageURL = window.location.search.substring(1);
            var sURLVariables = sPageURL.split('&');
            for (var i = 0; i < sURLVariables.length; i++) {
                var sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] == sParam) {
                    return sParameterName[1];
                }
            }
        }
        function uploadFile(file, itemId) {
            return $q(function (resolve, reject) {

                getFileBuffer(file).then(function (buffer) {
                    $().SPServices({
                        operation: "AddAttachment",
                        listName: listName,
                        //asynch: false,
                        listItemID: itemId,
                        fileName: file.name,
                        attachment: buffer,//content.toBase64String()
                        completefunc: function (xData, Status) {
                            result = xData.responseXML.documentElement.textContent;
                            if (Status != "error") {

                                //linkold='<a target="_target" href="../'+result+'">'+file.name+'</a>';
                                fileLink = { "link": result, "fileName": file.name };
                                link = result;
                                resolve(fileLink);
                                //alert('attachment upload complete',xData,status);	
                            }
                            else {
                                reject(result);
                            }
                        }
                    });
                }, showError);
            });

        }
       
        function uploadAttachment(file, icFormData) {
            return $q(function (resolve, reject) {
                /* if(!itemId)
                 itemId=getUrlParameter("itemid");*/

                if (!itemId) {
                    promise = saveFormData(icFormData);
                    promise.then(function (newId) {
                        itemId = newId;
                        uploadPromise = uploadFile(file, itemId);
                        uploadPromise.then(
                        function (link) {
                            resolve(link);
                        })

                    }
                    );
                }
                else {
                    uploadPromise = uploadFile(file, itemId);
                    uploadPromise.then(
                       function (link) {
                           resolve(link);
                       })
                }
            });
        }
        function deleteAttachment(url) {
            return $q(function (resolve, reject) {
                /*
                if(!itemId)
                itemId=getUrlParameter("itemid");*/

                $().SPServices({
                    operation: "DeleteAttachment",
                    listName: listName,
                    listItemID: itemId,
                    url: url,
                    completefunc: function (xData, Status) {
                        if (Status != "error") {
                            resolve(xData.responseXML);
                            //alert('attachment upload complete',xData,status);	
                        }
                        else {
                            reject(xData.responseText);
                        }

                    }
                });
            });
        }

        function showError(error) {
            alert("upload file failed"+error);
        }

        function getFileBuffer(file) {

            return $q(function (resolve, reject) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    var data = this.result;
                    n = data.indexOf(";base64,") + 8;
                    //removing the first part of the dataurl give us the base64 bytes we need to feed to sharepoint
                    data = data.substring(n);
                    //resolve(e.target.result);
                    resolve(data);
                }

                reader.onerror = function (e) {
                    reject(e.target.error);
                }

                reader.readAsDataURL(file);

            });

        };

        function pushFieldUpdate(FormsValuePairs, fieldname, fieldvalue) {
            FormsValuePairs.push([fieldname, fieldvalue]);
            return FormsValuePairs;
        }
        function CDataWrap(value) {
            return sPUtility.CDataWrap(value)         
        }

        function findAllUpdateFields(fields, allFields) {
            angular.forEach(fields, function (field) {
                if (field.templateOptions) {
                    if (field.templateOptions.listFieldName) {
                        allFields.push(field);
                    }
                    else if (field.templateOptions.fields) {
                        findAllUpdateFields(field.templateOptions.fields, allFields)
                    }
                }

            });
        }
        function prepareSave(model, fields) {
            var icFormDataSPFriendly = CDataWrap(angular.toJson(model));
            var FormsValuePairs = new Array();
            pushFieldUpdate(FormsValuePairs, formlyDataFieldName, icFormDataSPFriendly);
            //find all fields with listFieldName property
            var updatingFormFields = new Array();
            findAllUpdateFields(fields, updatingFormFields);

            angular.forEach(updatingFormFields, function (element) {
                var fieldValue = model[element.key];
                if (angular.isArray(fieldValue))
                    fieldValue = angular.toJson(fieldValue);

                pushFieldUpdate(this, element.templateOptions.listFieldName, fieldValue);
            }, FormsValuePairs);
            return FormsValuePairs;
        }

        function saveFormData(model, fields) {

            return $q(function (resolve, reject) {
                //if itemId is not defined, try to get it from the url
                /*
                if(!itemId)
                itemId=getUrlParameter("itemid");*/

                var IsUpdate = true;
                if (!itemId)
                    IsUpdate = false;

                var FormsValuePairs = prepareSave(model, fields);
                var promise = updateListItems(FormsValuePairs, itemId, listName);
                //if itemId is defined, it is an update, otherwise it is insert
                promise.then(function (newId) {
                    if (IsUpdate) {

                        saveSuccessful(newId);
                        resolve(newId);
                    }
                    else {

                        // saveItemId(newId);
                        saveSuccessful(newId);
                        resolve(newId);
                    }
                }, savefail);

            });
        }
        function saveSuccessful(newId) {

            itemId = newId;
            //alert("save success: "+newId);

        }
        function savefail(reason) {
            alert('Failed: ' + reason);
        }

        function updateStatus(newStatus) {
            /*
            if(!itemId)
            itemId=getUrlParameter("itemid");*/

            FormsValuePairs = new Array();
            pushFieldUpdate(FormsValuePairs, "FormStatus", newStatus);
            var promise = updateListItems(FormsValuePairs, itemId, listName);
            return promise;
        }

        function saveItemId(newId) {
            return $q(function (resolve, reject) {
                FormsValuePairs = new Array();
                pushFieldUpdate(FormsValuePairs, "itemID", newId);
                //pushFieldUpdate(FormsValuePairs, "RefNo", refNo);
                var promise = updateListItems(FormsValuePairs, newId, listName);
                promise.then(
                    function () { resolve(newId) });
            });
        }
        function updateFormItem(itemID, FormsValuePairs) {
            return $q(function (resolve, reject) {

                var promise = updateListItems(FormsValuePairs, itemID, listName);
                promise.then(
                    function (newId) { resolve(newId) }, savefail);
            });
        }


        function updateListItems(FormsValuePairs, ID, listName) {
            return $q(function (resolve, reject) {
                var batchCommand = "Update";

                if (!ID) {
                    batchCommand = "New";
                    ID = 0;
                }

                $().SPServices({
                    operation: "UpdateListItems",
                    listName: listName,
                    batchCmd: batchCommand,
                    ID: ID,
                    valuepairs: FormsValuePairs,
                    completefunc: function (xData, Status) {
                        var errorCode = $(xData.responseXML).find("ErrorCode").text();
                        if (errorCode != "0x00000000") {
                            //alert("An error occurred creating or updating your form. Please check your entries and try again.");
                            //alert(xData.responseXML.xml);
                            reject("An error occurred creating or updating your form." + $(xData.responseXML).find("ErrorText").text());
                            //return;
                        }
                        else if (Status == "Error") {
                            //alert("Unable to communicate with Sharepoint Server!");
                            reject("Unable to communicate with Sharepoint Server!");
                            //return;
                        }
                        //			alert(xData.responseXML.xml);

                        var newId = $(xData.responseXML).SPFilterNode("z:row").attr("ows_ID");
                        itemId = newId;
                        resolve(newId);

                    }
                });
            });
        }
        function getListItemByIdREST(itemID)
        {
            var hostweburl= window.location.protocol + "//" + window.location.host +_spPageContextInfo.siteServerRelativeUrl;
            var restQueryUrl = hostweburl +"/_api/web/lists/getByTitle('" + listName + "')/items(" + itemID + ")";
            executor = new SP.RequestExecutor(hostweburl);
            return $q(function (resolve, reject) {
                executor.executeAsync({
                    url: restQueryUrl,
                    method: "GET",
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
        }
        function getListFieldValues(fieldNames, filter, CAMLRowLimit) {

            //filter=new array();
            //var obj = {

            //    "Name": "FormActive",

            //    "Type": "Boolean",
            //     "Value":"True"

            //};
            //filter.push(obj);
            CAMLQuery = "";
            $.each(filter, function (index, obj) {
                filterName = obj.Name;
                filterLookup = obj.Lookup;
                filterType = obj.Type;
                filterValue = obj.Value;
                if (filterLookup == null) {
                    filterLookup = "";
                }
                switch (index) {
                    case 0:
                        CAMLQuery += "<Eq><FieldRef Name='" + filterName + "' " + filterLookup + "/><Value Type='" + filterType + "'>" + filterValue + "</Value></Eq>";
                        break;
                    case 1:
                        CAMLQuery = "<And>" + CAMLQuery + "<Eq><FieldRef Name='" + filterName + "' " + filterLookup + "/><Value Type='" + filterType + "'>" + filterValue + "</Value></Eq></And>";
                        break;
                    default:
                        CAMLQuery = "<And><Eq><FieldRef Name='" + filterName + "' " + filterLookup + "/><Value Type='" + filterType + "'>" + filterValue + "</Value></Eq>" + CAMLQuery + "</And>";
                        break;
                }

            });
            CAMLQuery = "<Query><Where>" + CAMLQuery + "</Where></Query>";

            CAMLViewFields = "<ViewFields>";
            angular.forEach(fieldNames, function (value, index) {
                CAMLViewFields += "<FieldRef Name='" + value + "' />";
            });
            CAMLViewFields += "</ViewFields>";
            return $q(function (resolve, reject) {
                var ListItemPromise = $().SPServices.SPGetListItemsJson({
                    listName: listName,
                    CAMLQuery: CAMLQuery,
                    CAMLViewFields: CAMLViewFields,
                    CAMLRowLimit: CAMLRowLimit

                });
                $.when(ListItemPromise).done(function () {
                    itemData = this.data;
                    resolve(itemData)
                    //callbackFunc(itemData);
                });

            });
        };
        return {
            setListName: setListName,
            getListName: getListName,
            setItemId: setItemId,
            getItemId: getItemId,
            getListFieldValues: getListFieldValues,
            getUrlParameter: getUrlParameter,
            saveFormData: saveFormData,
            uploadAttachment: uploadAttachment,
            updateStatus: updateStatus,
            updateFormItem: updateFormItem,
            pushFieldUpdate: pushFieldUpdate,
            deleteAttachment: deleteAttachment,
            getListItemByIdREST: getListItemByIdREST,
            findAllUpdateFields:findAllUpdateFields,
            CDataWrap:CDataWrap
        }



    };



    return ListService;


}]);
