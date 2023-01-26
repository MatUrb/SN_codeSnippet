/* This merge Objects since Object.assign is not available server-side (script include, BR,...) 
@param Takes any number of object passed in as parameter
@output object : merged object from what was passed as arguments;
*/

_mergeObj: function(){
	var resObj = {};
	for (var i = 0; i < arguments.length; i++) {
var el = arguments[i];
var isObject = (typeof el === 'object' && el !== null && !Array.isArray(el));
		if(!isObject)
			continue;
		for (var prop in arguments[i]) {
			if (arguments[i].hasOwnProperty(prop))
				resObj[prop] = arguments[i][prop];
		} 
	}
	return resObj;
}

