/* 
	Update a target record with values from the current record.

	@param recordGr current GlideRecord
	@param targetTable Table to update
	@param targetSys_id record on the target table to update
	@param fieldMap schema { currentTableField: targetTableField  } 
	*/
	syncTargetRecord: function(recordGr,targetTable,targetSys_id, fieldMap /* object */){
		if(!(recordGr || targetTable || targetSys_id || fieldMap))
			return false; // Error with required parameters

		var targetGr = new GlideRecord(targetTable);
		targetGr.get(targetSys_id);
		if(targetGr.isValidRecord()){
			Object.keys(fieldMap).map(function(key){
				if(targetGr.isValidField(fieldMap[key]) && recordGr.isValidField(key))
					targetGr.setValue(fieldMap[key],recordGr.getValue(key));
			});
			return targetGr.update();
		}
	}
