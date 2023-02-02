/* Centralized Handler for complexes ACLs */

/* This can be called in ACLs with a one liner (1 ACL can handle multiple scenarios, roles,...):

answer = new securityAccess().canEdit(current);

or in Before Query BR:

var encodedQuery = new securityAccess().getBRQuery(current);
	if(encodedQuery)
		current.addEncodedQuery(encodedQuery);

*/


var securityAccess = Class.create();
securityAccess.prototype = {

initialize: function() {
this.TABLES = "map of table JSON object" ;
  this.ROLES = "map of roles JSON object" ;

this.ACL_CONDITION = {};
this.ACL_CONDITION[this.TABLES] = {canRead: {}, canEdit: {}}; // define the handler require for the table
this.ACL_CONDITION[this.TABLES].canEdit[this.ROLES] = ["array of encodedQuery that will be join with an OR operator"].join('^NQ'); // for each handler define the roles targeted;

/* repeat as necessary */

/*  This is used for query business rules this could replace a canRead ACL */
getBRQuery: function(current){
		var user = userId ? gs.getUserByID(userId) : gs.getUser(),
			table = record.getTableName(),
			encodedQuery = '';

		if(!this.ACL_CONDITION[table])
			return encodedQuery;

/* Role based condition to handle the different scenarios */
		switch(true){
			case user.hasRole(this.ROLES):
				break;
			case user.hasRole(this.ROLES):
				if(this.ACL_CONDITION[table].canRead[this.ROLES])
					encodedQuery = this.ACL_CONDITION[table].canRead[this.ROLES];
				break;
			case user.hasRole(this.ROLES):
				if( this.ACL_CONDITION[table].canRead[this.ROLES])
					encodedQuery = this.ACL_CONDITION[table].canRead[this.ROLES];
				break;
			default:
				break;
		}

		return encodedQuery;		
	},


/* CRUD Handler */
canEdit: function(record,userId){
		var user = userId ? gs.getUserByID(userId) : gs.getUser(),
			table = record.getTableName(),
			canEdit = false;

		if(!this.ACL_CONDITION[table])
			return canEdit;

		switch(true){
			case user.hasRole(this.ROLES.ADMIN):
				canEdit = true;
				break;
			case user.hasRole(this.ROLES.ROLE_1):
				if(this.ACL_CONDITION[table].canEdit[this.ROLES.ROLE_1])
					canEdit = GlideFilter.checkRecord(record, this.ACL_CONDITION[table].canEdit[this.ROLES.ROLE_1]);
				break;
			case user.hasRole(this.ROLES.ROLE_2):
				if(this.ACL_CONDITION[table].canEdit[this.ROLES.SOLUTION_CONSULTANT])
					canEdit = GlideFilter.checkRecord(record, this.ACL_CONDITION[table].canEdit[this.ROLES.ROLE_2]);
				break;
			default:
				break;
		}

		return canEdit;	
	}
  
  type: "securityAccess"
}
