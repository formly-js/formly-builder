
app.constant('constantData', {
    appFormDesignListName: "SPDesignForms",
    publishFields: [
        {
           template:"<p>You can publish the above form to an SharePoint list in the host web site, by type an new list name/or use the default \"MyForm\", then click the \"Publish Form\" buttom </p>"
        },
        {
            type: "input",
            key: "TargetListName",

            templateOptions: {
                label: 'Publish target list name:',
                required: true
            }
        }
    ],
    publishModel: {
        TargetListName: ''
    },
    defaultFormDesign: {
        "default": [
          {
              "component": "htmlContent",
              "editable": true,
              "index": 0,
              "label": "",
              "description": "",
              "placeholder": "",
              "options": [],
              "required": false,
              "validation": "/.*/",
              "id": "default-htmlContent-1280",
              "isContainer": false,
              "templateOptions": {
                  "htmlContent": "<h3>Personal Account Dealing Form</h3><a href=\"#\">What is PA Dealing?</a>\n<hr/>"
              },
              "expressionProperties": "",
              "noFormControl": false
          },
          {
              "component": "multiField",
              "editable": true,
              "index": 1,
              "label": "horizontal layout",
              "description": "",
              "placeholder": "",
              "options": [],
              "required": false,
              "validation": "/.*/",
              "id": "default-multiField-6745",
              "isContainer": true,
              "templateOptions": {},
              "expressionProperties": "",
              "noFormControl": true
          },
          {
              "component": "multiField",
              "editable": true,
              "index": 2,
              "label": "horizontal layout",
              "description": "",
              "placeholder": "",
              "options": [
                "<span color=\"red\"><- click No to hide the repeat section</span>"
              ],
              "required": false,
              "validation": "/.*/",
              "id": "default-multiField-6076",
              "isContainer": true,
              "templateOptions": {},
              "expressionProperties": "",
              "noFormControl": true
          },
          {
              "component": "repeatSection",
              "editable": true,
              "index": 3,
              "label": "repeat section",
              "description": "",
              "placeholder": "",
              "options": [],
              "required": false,
              "validation": "/.*/",
              "id": "default-repeatSection-1867",
              "isContainer": true,
              "templateOptions": {
                  "btnText": "Add Another Section"
              },
              "expressionProperties": "\"hide\":\"model.Question1!=='Yes'\"",
              "noFormControl": true
          },
          {
              "component": "multiField",
              "editable": true,
              "index": 4,
              "label": "horizontal layout",
              "description": "",
              "placeholder": "",
              "options": [],
              "required": false,
              "validation": "/.*/",
              "id": "default-multiField-2764",
              "isContainer": true,
              "templateOptions": {},
              "expressionProperties": "",
              "noFormControl": true
          }
        ],
        "default-multiField-6745": [
          {
              "key": "RefNo",
              "component": "textInput",
              "editable": true,
              "index": 0,
              "label": "Reference No:",
              "description": "description",
              "placeholder": "placeholder",
              "options": [],
              "required": true,
              "validation": "[number]",
              "id": "default-multiField-6745-textInput-4226",
              "isContainer": false,
              "templateOptions": {
                  "listFieldName": "Title"
              },
              "expressionProperties": "",
              "noFormControl": true
          },
          {
              "key": "date",
              "component": "datePicker",
              "editable": true,
              "index": 1,
              "label": "",
              "description": "",
              "placeholder": "",
              "options": [],
              "required": true,
              "validation": "/.*/",
              "id": "default-multiField-6745-datePicker-3206",
              "isContainer": false,
              "templateOptions": {
                  "label": "Date:",
                  "dateFormat": "yy-mm-dd",
                  "listFieldName": "InvestmentData"
              },
              "expressionProperties": "",
              "noFormControl": true
          }
          
        ],
        "default-multiField-6076": [
          {
              "component": "htmlContent",
              "editable": true,
              "index": 0,
              "label": "",
              "description": "",
              "placeholder": "",
              "options": [],
              "required": false,
              "validation": "/.*/",
              "id": "default-multiField-6076-htmlContent-3214",
              "isContainer": false,
              "templateOptions": {
                  "htmlContent": "1. Any preapproval activities to declare? * <a href=\"#\">Click here for more information about preapproval activities</a>"
              },
              "expressionProperties": "",
              "noFormControl": false
          },
          {
              "key": "Question1",
              "component": "radioFlat",
              "editable": true,
              "index": 1,
              "label": "",
              "description": "",
              "placeholder": "",
              "options": [
                "Yes",
                "No"
              ],
              "required": false,
              "validation": "/.*/",
              "id": "default-multiField-6076-radioFlat-4794",
              "isContainer": false,
              "templateOptions": {},
              "expressionProperties": "",
              "noFormControl": true
          },
          {
              "component": "htmlContent",
              "editable": true,
              "index": 2,
              "label": "",
              "description": "",
              "placeholder": "",
              "options": [],
              "required": false,
              "validation": "/.*/",
              "id": "default-multiField-6076-htmlContent-2766",
              "isContainer": false,
              "templateOptions": {
                  "htmlContent": "<span style=\"color:red\"><- choose No will hide the repeat section</span>"
              },
              "expressionProperties": "",
              "noFormControl": false
          }
        ],
        "default-repeatSection-1867": [
          {
              "component": "multiField",
              "editable": true,
              "index": 0,
              "label": "horizontal layout",
              "description": "",
              "placeholder": "",
              "options": [],
              "required": false,
              "validation": "/.*/",
              "id": "default-repeatSection-1867-multiField-1632",
              "isContainer": true,
              "templateOptions": {},
              "expressionProperties": "",
              "noFormControl": true
          },
          {
              "key": "investmentValue",
              "component": "textInput",
              "editable": true,
              "index": 1,
              "label": "Value:",
              "description": "description",
              "placeholder": "placeholder",
              "options": [],
              "required": true,
              "validation": "/.*/",
              "id": "default-repeatSection-1867-textInput-1665",
              "isContainer": false,
              "templateOptions": {},
              "expressionProperties": "",
              "noFormControl": true
          },
          {
              "component": "htmlContent",
              "editable": true,
              "index": 2,
              "label": "",
              "description": "",
              "placeholder": "",
              "options": [],
              "required": false,
              "validation": "/.*/",
              "id": "default-repeatSection-1867-htmlContent-8599",
              "isContainer": false,
              "templateOptions": {
                  "htmlContent": "If not you who is executing the trade?"
              },
              "expressionProperties": "",
              "noFormControl": false
          },
          {
              "key": "name",
              "component": "textInput",
              "editable": true,
              "index": 3,
              "label": "Name:",
              "description": "description",
              "placeholder": "placeholder",
              "options": [],
              "required": true,
              "validation": "/.*/",
              "id": "default-repeatSection-1867-textInput-7969",
              "isContainer": false,
              "templateOptions": {},
              "expressionProperties": "",
              "noFormControl": true
          },
          {
              "key": "requesterComment",
              "component": "textArea",
              "editable": true,
              "index": 4,
              "label": "Requester Comment:",
              "description": "description",
              "placeholder": "placeholder",
              "options": [],
              "required": false,
              "validation": "/.*/",
              "id": "default-repeatSection-1867-textArea-1358",
              "isContainer": false,
              "templateOptions": {},
              "expressionProperties": "",
              "noFormControl": true
          }
        ],
        "default-repeatSection-1867-multiField-1632": [
          {
              "key": "investmentType",
              "component": "select",
              "editable": true,
              "index": 0,
              "label": "Type of Investment:",
              "description": "description",
              "placeholder": "placeholder",
              "options": [
                "Preapproval Activity",
                "Post-trade Notification"
              ],
              "required": true,
              "validation": "/.*/",
              "id": "default-repeatSection-1867-multiField-1632-select-8988",
              "isContainer": false,
              "templateOptions": {},
              "expressionProperties": "",
              "noFormControl": true
          },
          {
              "key": "investmentName",
              "component": "textInput",
              "editable": true,
              "index": 1,
              "label": "Name of Investment",
              "description": "description",
              "placeholder": "placeholder",
              "options": [],
              "required": true,
              "validation": "/.*/",
              "id": "default-repeatSection-1867-multiField-1632-textInput-259",
              "isContainer": false,
              "templateOptions": {},
              "expressionProperties": "",
              "noFormControl": true
          },
          {
              "key": "investmentDate",
              "component": "datePicker",
              "editable": true,
              "index": 2,
              "label": "",
              "description": "",
              "placeholder": "",
              "options": [],
              "required": true,
              "validation": "/.*/",
              "id": "default-repeatSection-1867-multiField-1632-datePicker-1161",
              "isContainer": false,
              "templateOptions": {
                  "label": "Date of Investment:",
                  "dateFormat": "yy-mm-dd"
              },
              "expressionProperties": "",
              "noFormControl": true
          }
        ],
        "default-multiField-2764": [
          {
              "component": "checkbox",
              "editable": true,
              "index": 0,
              "label": "Declaration: I confirm this request is in compliance with the Investors Personal Account Policy",
              "description": "description",
              "placeholder": "placeholder",
              "options": [
                "Yes"
              ],
              "required": true,
              "validation": "/.*/",
              "id": "default-multiField-2764-checkbox-6333",
              "isContainer": false,
              "templateOptions": {},
              "expressionProperties": "",
              "noFormControl": true
          }
        ]
    }

});

