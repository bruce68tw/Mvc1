/**
 * American English translation for bootstrap-datepicker
 */
;(function($){
	$.fn.datepicker.dates['en-US'] = {
		days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
		months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		today: "Today",
		monthsTitle: "Months",
		clear: "Clear",
		weekStart: 0,
		format: "M-d-yyyy"
	};
}(jQuery));

export default class _BR {
    //=== moment.js ymd format ===
    static MmUiDateFmt = 'MMM-D-YYYY'; //match datepicker format
    static MmUiDtFmt = 'MMM-D-YYYY HH:mm:ss';
    static MmUiDt2Fmt = 'MMM-D-YYYY HH:mm'; //no second
    //row status
    static StatusYes = 'Active';
    static StatusNo = 'Off';
    static Yes = 'Yes';
    //check input
    static InputWrong = 'Input Wrong.';
    //for crud form
    static Create = 'Create';
    static Update = 'Update';
    static View = 'View';
    static UpdateOk = 'Update Ok.';
    static DeleteOk = 'Delete Ok.';
    static SaveOk = 'Save Ok.';
    static SaveNone = 'No row changed !';
    static Done = 'Done.';
    //find form
    static FindOk = 'Find Ok.';
    static FindNone = 'Find None !';
    //form tip
    static TipUpdate = 'Update this Row.';
    static TipDelete = 'Delete this Row.';
    static TipView = 'View this Row.';
    static TipCopy = 'Copy this data and enter new mode';
    //message-upload file
    static UploadFileNotBig = 'Upload File Size Should Less Than {0}M !';
    static UploadFileNotMatch = 'Upload File Type Not Match !';
    static NewFileNotView = 'Save First Then View !';
    //message-others
    static PlsSelect = '-Select-';
    static PlsSelectDeleted = 'Please Select Deleted Rows.';
    static PlsSelectRows = 'Please Select Rows First.';
    static SureDeleteRow = 'Sure to Delete Row ?';
    static SureDeleteSelected = 'Sure to Delete Selected ?';
    //authority
    static NoAuthUser = 'No right for this user; Please connect Admin.';
    static NoAuthDept = 'No right for this department; Please connect Admin.';
    static NoAuthProg = 'You have not access right; Please connect Admin.';
    static NoFile = 'No File Existed.';
    static NotLogin = 'Please Login First.';
    //others
    static Working = 'Working...';
    static TimeOut = 'Standby too long; or not Login.';
    static UniqueError = 'Record Exists no Repeated.';
}
