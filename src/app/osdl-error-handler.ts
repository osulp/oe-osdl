import { ErrorHandler } from '@angular/core';

declare var toastr: any;

toastr.options = {
    'closeButton': true,
    'debug': false,
    'newestOnTop': false,
    'progressBar': false,
    'positionClass': 'toast-bottom-full-width',
    'preventDuplicates': false,
    'onclick': null,
    'showDuration': '300',
    'hideDuration': '1000',
    'timeOut': 0,
    'extendedTimeOut': 0,
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut'
};

export class OsdlErrorHandler extends ErrorHandler {
    constructor() {
        super(true);
    }
    handleError(error) {
        console.log('what up?', error);
        toastr.clear();
        toastr['warning']('Error!<br /><br />'
            , error.name
            + error.message !== undefined ? error.message.substring(0, 200) : ''
            + ' Sorry, there was a problem.  We are working through the glitches in this new tool, so you may need to refresh page.'
            + ' If the problem continues, let us know so we can look into fixing it.');
        // super.handleError(error);
    }
}

// export default class MyErrorHandler extends ErrorHandler {

//   constructor() {
//     // We rethrow exceptions, so operations like 'bootstrap' will result in an error
//     // when an error happens. If we do not rethrow, bootstrap will always succeed.
//     super(true);
//   }

//   handleError(error) {
//     alert
//     console.log('error', error);
//     super.handleError(error);
//   }
// }
