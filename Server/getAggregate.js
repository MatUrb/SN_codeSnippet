/* Calculate aggregate of table / field  */

	_getAggregate: function(table /*required*/, query /*required*/, field /*optional*/, aggFn /*optional*/, groupBy /*optional*/){
		var result = 0,
			aggFn = aggFn ? aggFn : "COUNT";
		if (!table)
			return;
    
		if(!field){
			field = "sys_id";
      
		else{
			var ga2 = new GlideAggregate(table);
			ga2.addEncodedQuery(query);
			if(!groupBy)
				ga2.setGroup(false);
			else
				ga2.groupBy(groupBy);
			ga2.addAggregate(aggFn, field);		
			ga2.query();
			if(!groupBy){
				if(ga2.next())
					result = Number(ga2.getAggregate(aggFn, field));
			}
			else{
				result = {};
				while(ga2.next()){
					var aggGroup = ga2.getValue(groupBy);
					result[aggGroup] = ga2.getAggregate(aggFn, field);	
				}
			}
		}

		return result;
	}
