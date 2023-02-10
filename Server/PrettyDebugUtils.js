// in Script include

DEBUG: gs.getProperty("any debug property") == 'true' ? true : false,

  /** 
  msg - any - Debug message
  f - string - function this debug is called from (optional);
  **/
_debug: function(msg, f){
if(this.DEBUG){
var msg = "[{0}] {1} - {2}";
var params = [new GlideDateTime().getNumericValue(), f, msg];
gs.info(gs.getMessage(msg,params));
}
}
