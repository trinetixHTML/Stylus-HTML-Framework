$(document).ready(function () {

	// навешиваем классы с именами браузеров и версией
	if (bowser.firefox) {     $('html').addClass('firefox'); }
	else if (bowser.chrome) { $('html').addClass('chrome'); }
	else if (bowser.safari) { $('html').addClass('safari');}
	else if (bowser.opera) {  $('html').addClass('opera');}
	else if (bowser.msie) {   $('html').addClass('ie');}
	$('html').addClass('v' + bowser.version);


});
