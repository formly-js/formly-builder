(function() {
    var builderapp=app.run([
      '$builder', function ($builder) { 
		  $builder.registerComponent('radioFlat', {
              group: 'Default',
              label: 'radio inline',
              required: false,
              options: ['value one', 'value two'],
              
              template: "<div>\r\n    <label for=\"{{formName+index}}\" class=\"control-label\">\r\n        {{label}}\r\n        {{fb-required ? \'*\' : \'\'}}\r\n    <\/label>\r\n    <div class=\"radio-group\">\r\n        <label class=\"radio-inline\" ng-repeat=\"item in options track by $index\">\r\n            <input type=\"radio\"\r\n                   id=\"{{id + \'_\'+ $index}}\"\r\n                   value=\"{{item}}\"\r\n                   ng-model=\"$parent.inputText\">\r\n            {{item}}\r\n        <\/label>\r\n\r\n    <\/div>\r\n<\/div>\r\n",
              
              popoverTemplate: "<form>\r\n    <div class=\"form-group\">\r\n        <label class=\'control-label\'>Label<\/label>\r\n        <input type=\'text\' ng-model=\"label\"  class=\'form-control\' \/>\r\n    <\/div>\r\n   \r\n    <div class=\"form-group\">\r\n        <label class=\'control-label\'>Options<\/label>\r\n        <textarea class=\"form-control\" rows=\"3\" ng-model=\"optionsText\" \/>\r\n    <\/div>\r\n\r\n    \r\n<\/form>"
		  });

		  $builder.registerComponent('multiField', {
		      group: 'Layout',
		      label: 'horizontal layout',
		   
		      template: "<div class=\"panel panel-default\" >\r\n    <div class=\"panel-heading\">\r\n        <h3 class=\"panel-title\">{{label}}<\/h3>\r\n    <\/div>\r\n    <div class=\"DropableDesign form-inline\" fb-builder=\"{{id}}\" \/>\r\n\r\n\r\n<\/div>",
		
		      popoverTemplate: "<form>\r\n    <div class=\"form-group\">\r\n        <label class=\'control-label\'>Label<\/label>\r\n        <input type=\'text\' ng-model=\"label\"  class=\'form-control\' \/>\r\n    <\/div>\r\n   \r\n    <div class=\"form-group\">\r\n        <label class=\'control-label\'>Options<\/label>\r\n        <textarea class=\"form-control\" rows=\"3\" ng-model=\"optionsText\" \/>\r\n    <\/div>\r\n\r\n    \r\n<\/form>",
		      isContainer: true
		     
		  });

		  $builder.registerComponent('repeatSection', {
		      group: 'Advance',
		      label: 'repeat section',
		     
		      template: "<div class=\"panel panel-default\" >\r\n    <div class=\"panel-heading\">\r\n        <h3 class=\"panel-title\">{{label}}<\/h3>\r\n    <\/div>\r\n    <div class=\"DropableDesign\" fb-builder=\"{{id}}\" \/>\r\n\r\n  \r\n    <p>\r\n        <button type=\"button\" class=\"btn btn-primary\">{{templateOptions.btnText}}<\/button>\r\n    <\/p>\r\n\r\n<\/div>",
		    
		      popoverTemplate: "<form>\r\n    <div class=\"form-group\">\r\n        <label class=\'control-label\'>Label<\/label>\r\n        <input type=\'text\' ng-model=\"label\" validator=\"[required]\" class=\'form-control\'\/>\r\n    <\/div>\r\n    <div class=\"form-group\">\r\n        <label class=\'control-label\'>Description<\/label>\r\n        <input type=\'text\' ng-model=\"description\" class=\'form-control\'\/>\r\n    <\/div>\r\n    <div class=\"form-group\">\r\n        <label class=\'control-label\'>Placeholder<\/label>\r\n        <input type=\'text\' ng-model=\"placeholder\" class=\'form-control\'\/>\r\n    <\/div>\r\n    <div class=\"checkbox\">\r\n        <label>\r\n            <input type=\'checkbox\' ng-model=\"required\" \/>\r\n            Required<\/label>\r\n    <\/div>\r\n    <div class=\"form-group\" ng-if=\"validationOptions.length > 0\">\r\n        <label class=\'control-label\'>Validation<\/label>\r\n        <select ng-model=\"$parent.validation\" class=\'form-control\' ng-options=\"option.rule as option.label for option in validationOptions\"><\/select>\r\n    <\/div>\r\n\r\n    <hr\/>\r\n    <div class=\'form-group\'>\r\n        <input type=\'submit\' ng-click=\"popover.save($event)\" class=\'btn btn-primary\' value=\'Save\'\/>\r\n        <input type=\'button\' ng-click=\"popover.cancel($event)\" class=\'btn btn-default\' value=\'Cancel\'\/>\r\n        <input type=\'button\' ng-click=\"popover.remove($event)\" class=\'btn btn-danger\' value=\'Delete\'\/>\r\n    <\/div>\r\n<\/form>",
		      isContainer: true,
		      templateOptions:{btnText:"Add Another Section"}
		  });
		  $builder.registerComponent('datePicker', {
		      group: 'Advance',		    
		      template: "<div>\r\n    <label for=\"0\" class=\"control-label\">{{templateOptions.label}} {{fb-required ? \'*\' : \'\'}}<\/label>\r\n\r\n    <input type=\"text\" date-format=\"{{templateOptions.dateFormat}}\" id=\"{{id}}\" ng-model=\"date\" class=\"form-control\" placeholder=\"{{placeholder}}\" \/>\r\n\r\n<\/div>",
		      
		      popoverTemplate: "<form>\r\n    <div class=\"form-group\">\r\n        <label class=\'control-label\'>Label<\/label>\r\n        <input type=\'text\' ng-model=\"templateOptions.label\" class=\'form-control\' \/>\r\n    <\/div>\r\n    <div class=\"form-group\">\r\n        <label class=\'control-label\'>Date Format<\/label>\r\n        <input type=\'text\' ng-model=\"templateOptions.dateFormat\" class=\'form-control\' \/>\r\n    <\/div>\r\n    <div class=\"form-group\">\r\n        <label class=\'control-label\'>Placeholder<\/label>\r\n        <input type=\'text\' ng-model=\"placeholder\" class=\'form-control\' \/>\r\n    <\/div>\r\n    <div class=\"checkbox\">\r\n        <label>\r\n            <input type=\'checkbox\' ng-model=\"required\" \/>\r\n            Required\r\n        <\/label>\r\n    <\/div>\r\n    \r\n<\/form>",
		      templateOptions: {
		          label: 'Date Picker',
		          dateFormat: "yy-mm-dd"
		         
		      }
		  });
		  $builder.registerComponent('htmlContent', {
		      group: 'Default',
		      template: '<label for="0" class="control-label">   HTML Content </label><br/><div>{{templateOptions.htmlContent}}</div>',
		
		      popoverTemplate:"<form>\r\n    <div class=\"form-group\">\r\n        <label class=\'control-label\'>HTML Content<\/label>\r\n        <textarea ng-model=\"templateOptions.htmlContent\" class=\'form-control\' \/>\r\n    <\/div>\r\n\r\n    \r\n<\/form>",
		      noFormControl:false
		  });
		 
      }
    ]);
    
}).call(this);
