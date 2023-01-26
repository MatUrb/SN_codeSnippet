/** 
  Might not cover all scenarios but that should be close to how the condition builder is working
@param: table - table we are building the query for
@param: refRecord - gliderecord you might want to get a value From
@param: queryMap - an Array of object representing the condition to build
[{
  "field": "", 
  "operator": "",
  "value": "",
  "next": ""
}]
@output: Encoded query
  **/
_encodedQueryBuilder: function(table,queryMap,refRecord){
  var encodedQuery = '';
   var record =  new  GlideRecord(table);
  if(!record.isValid())
    return
  
  record.newRecord();

  queryMap.forEach(function(CONDITION){
    if(!record.isValidField(CONDITION.field))
      return;

    switch(CONDITION.operator)
    {
      case "SAME AS":
        encodedQuery += CONDITION.field + '=';
        if(refRecord.isValidField(CONDITION.value))
          encodedQuery += refRecord.getValue(CONDITION.value);   
        break; 
      default:
        if(!CONDITION.operator)
          encodedQuery += CONDITION.field + '=' + CONDITION.value;
        else
          encodedQuery += CONDITION.field + '' + CONDITION.operator + '' + CONDITION.value; 
        break;
    }
    if(CONDITION.next == 'AND')
      encodedQuery += "^";
    if(CONDITION.next == 'OR')
      encodedQuery += "^OR";
  });

  return encodedQuery;
}
