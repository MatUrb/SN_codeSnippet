// HTML
<section>
  <div ng-if="!data.isValid" class="alert alert-danger">
    <strong>Error!</strong> {{::data.m.error}}
  </div>
  <div ng-if="::data.isValid"> 
    <div class="panel panel-default b"> 
      <div class="panel-heading"> 
        <!-- Navigation Tabs -->
        <div>
          <ul class="nav nav-tabs" role="tablist"> 
            <li ng-repeat="tab in c.data.tabs | orderBy: 'order' track by $index" role="presentation" ng-class="{'active': c.selectedTab == tab.name}">
              <a data-toggle="tab" ng-click="c.selectTab(tab.name)" href role="tab">
                {{tab.label}}
              </a>
            </li>
          </ul>
        </div>
      </div> 
      <div class="body padder-xs">
        <div ng-repeat="tab in c.data.tabs track by $index" role="tabpanel" ng-if="c.selectedTab == tab.name" id="{{tab.name}}-tab" class="tab-pane" ng-class="{'active': c.selectedTab == tab.name}">
          <div class="table-container table-responsive">
            <sp-widget widget="tab.widget" ng-if="tab.widget"></sp-widget>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
// END HTML

// CSS
.nav {
  padding-left: 0;
  margin-bottom: 0;
  list-style: none;
}

.nav-tabs > li > a {
  margin-right: 2px;
  line-height: 1.42857143;
  border: 1px solid transparent;
  border-radius: 4px;
}

.nav > li > a {
  position: relative;
  display: block;
  padding: 10px 15px;
}

/* nav-tabs */
.nav-tabs {
  border-bottom: transparent;
  & > li {
    > a {
      color: $text-color;
      border-bottom-width: 1px !important;
      &:hover {
        border-color: $border-secondary!important;
        color: $link-color!important;
        background: none;
      }
    }
    &.active {
      a {
        border-color: $link-color!important;
        color: $link-color!important;
        font-weight: bold;
        background-color: transparent;
        &:hover, &:focus {
          border-color: $link-color!important;
          color: $link-color!important;
          background: none;
        }
      }
    }
  }
}
// END CSS


// Client
api.controller=function() {
	/* widget controller */
	var c = this;

	c.selectedTab = c.data.selectedTab; // set Default selected tab

	c.showTab = function(tab){
		return tab.count && tab.count > 0;
	};

	c.selectTab = function(t){
		c.selectedTab = t;
	};

};
//END CLIENT

//SERVER
(function() {

	data.sysUserID = $sp.getParameter("sys_id");
	msg = {};
	msg.error = gs.getMessage("No valid options provided");
	data.m = msg;

	if (!data.sysUserID)
		data.sysUserID = gs.getUser().getID();

	var sysUserGR = new GlideRecord("sys_user");
	data.userExists = sysUserGR.get(data.sysUserID) && sysUserGR.canRead();

	if(!data.userExists)
		return;

	function userCanRead(table){
		var tableGR = new GlideRecord(table);
		if(tableGR.isValid() && tableGR.canRead())
			return true;
		else{
			return false;
		}	
	}

	data.tabsOptions = input.tabsOptions || options.tabsOptions || [];
	data.isValid = true;
	
	if(!data.tabsOptions){
		data.isValid = false;
		return;
	}

	/* set the queries that will allow to fetch the data for the different tabs 
	this will be used as options for the table widget */
	var tabsDetails = [];

	if(data.tabsOptions){
		data.tabsOptions.forEach(function(tabOptions){
			tabOptions.count = getRowCount(tabOptions.table,tabOptions.query);
			tabOptions.widget = getTableWidget(tabOptions.table,tabOptions.query,tabOptions.options);
			tabsDetails.push(tabOptions);
		});
	}
	/* Experience Tab Data */
	/* ie...
	var experience = {
		label: "Experience",
		name: "experience",
		order: '100',
		table: profileUtils.TABLES.PROJECT,
		query:  gs.getMessage("active=true^u_user={0}", empProfileSys_id), // using gs.getMessage to simplify concatenation
		options: { 
			field_list: 'u_project_title,u_project_start_date,u_project_end_date,u_project_details',
			show_new: true,
			show_breadcrumbs: false,
			window_size: 5
		}
	};
	experience.count = getRowCount(experience.table,experience.query);
	experience.widget = getTableWidget(experience.table,experience.query,experience.options);
	tabsDetails.push(experience);
	*/
	data.selectedTab = tabsDetails[0].name;
	data.tabs = tabsDetails;
	
	function getRowCount(table,qry){
		var gr = new GlideRecord(table);
		gr.addEncodedQuery(qry);
		gr.query();
		return gr.getRowCount();
	}

	function getTableWidget(table, qry, opt){
		var tableWidgetDefaultOptions = {
			hide_footer: false,
			hide_header: true,
			show_new: false,
			show_keywords: false,
			show_breadcrumbs: true,
			enable_filter: true,
			table: table,
			filter: qry,
			view: 'default'
		};

		var widgetOptions = mergeObj(tableWidgetDefaultOptions, opt);
		return $sp.getWidget('data-table-instance-wrapper', widgetOptions);
	}

	function mergeObj(o1, o2){
		var resObj = o1;
		if(o2){
			Object.keys(o2).map(function(k) {
				resObj[k] = o2[k];
			});
		}
		return resObj;
	}

})();
//END SERVER
