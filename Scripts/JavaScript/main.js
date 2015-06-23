requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '/InvestmentCommittee/SiteAsset/JavaScript',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    /*paths: {
        app: '../app'
    }*/
});

// Start the main app logic.
requirejs(['Vendor/jquery-1.10.2', 'Vendor/jquery-ui.js', 'Vendor/jquery.SPServices.js', 'Vendor/apiCheck.min.js', 'Vendor/angular.min.js', 'Vendor/placeholders.min.js', 'Vendor/formly.js', 'Vendor/angular-formly-templates-bootstrap.js', 'app.js', 'Vendor/angular-file-upload-shim', 'Vendor/angular-file-upload', 'ICFormConstant', 'ICFactory', 'formService', 'Directive', 'ICFormCtrl'],
function () {
    
});