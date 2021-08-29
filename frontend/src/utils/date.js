var dateFormat = require('dateformat');

exports.customDate = (date) => {
	date = date ? new Date(date) : new Date();
	const diff = new Date() - date;
	const minute = 60000;
	const hour = 60 * minute;
	const day = 24 * hour;
	const year = day * 365;
	switch (true) {
		case diff < minute:
			return 'Just now';
		case diff < hour:
			return `${Math.round(diff / minute)}m ago`;
		case diff < day:
			return dateFormat(date, 'h:MM TT');
		case diff < year:
			return dateFormat(date, 'mmmm dS');
		case diff >= year:
			return dateFormat(date, 'mmmm dS yyyy');
		default:
			return date;
	}
};
