/* Check if the element passed as an argument is an object 
@param: any
@output: Boolean
*/
	_isObject: function(el){
		return typeof el === 'object' && el !== null && !Array.isArray(el);
	}
