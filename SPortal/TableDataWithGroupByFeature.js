//HTML

<div class="panel panel-{{options.color}} b" ng-class="{'data-table-high-contrast': accessibilityModeEnabled}">
  <div class="panel-heading form-inline" ng-hide="options.hide_header">
    <span class="dropdown m-r-xs">
      <button aria-label="{{data.title || data.table_plural}} ${Context Menu}" class="btn dropdown-toggle glyphicon glyphicon-menu-hamburger" style="line-height: 1.4em" id="optionsMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
      <ul class="dropdown-menu" aria-labelledby="optionsMenu">
        <li ng-repeat="t in ::exportTypes">
          <a ng-if="!tinyUrlEnabled" ng-href="/{{data.table}}_list.do?{{::t.value}}&sysparm_query={{data.exportQueryEncoded}}&sysparm_view={{data.view}}&sysparm_fields={{data.fields}}" target="_new" tabindex="-1">${Export as} {{::t.label}}</a>
          <a ng-if="tinyUrlEnabled" ng-href="/{{data.table}}_list.do?{{::t.value}}&sysparm_tiny={{tinyUrl}}" target="_new" tabindex="-1">${Export as} {{::t.label}}</a>
        </li>
      </ul>
    </span>
    <h2 class="panel-title" style="display:inline"><i ng-if="options.glyph" class="fa fa-{{options.glyph}} m-r"></i>{{data.title || data.table_plural}}<span class="sr-only">${table} - ${page} {{data.p}}</span></h2>
    <!-- new button will show here if the the breadcrumbs is not showing -->
    <button name="new" role="button" class="btn btn-primary btn-sm m-l-xs" ng-click="newRecord()" ng-if="options.show_new && data.canCreate && !data.newButtonUnsupported && !(options.show_breadcrumbs && (data.filter || data.enable_filter))" aria-label="${Create new record}">${New}</button>
    <div class="pull-right" ng-if="options.show_keywords">
      <form ng-if="data.hasTextIndex" ng-submit="setSearch(true)">
        <div class="input-group" role="presentation">
          <input type="text" name="datatable-search" ng-model="data.keywords" ng-model-options="{debounce:250}" class="form-control" placeholder="${Keyword Search}" aria-label="${Keyword Search}">
          <span class="input-group-btn">
            <button name="search" class="btn btn-default" type="submit" aria-label="${Search}" data-original-title="{{::c.data.searchMsg}}" data-toggle="tooltip" data-placement="bottom"><span class="glyphicon glyphicon-search"></span></button>
          </span>
        </div>
      </form>
    </div>
    <div class="clearfix"></div>
  </div>
  <!-- body -->
  <div class="panel-body">
    <div ng-if="options.show_breadcrumbs && (data.filter || data.enable_filter)" class="filter-breadcrumbs">
      <!-- Adding the new button here for styling and saving space when hiding header -->
      <button name="new" role="button" class="btn btn-primary btn-sm m-l-xs m-r pull-right m-t-xs" ng-click="newRecord()" ng-if="options.show_new && data.canCreate && !data.newButtonUnsupported" aria-label="${Create new record}">${New}</button>
      <sp-widget widget="data.filterBreadcrumbs"></sp-widget> 
    </div>
    <div class="clearfix"></div>
    <div class="alert alert-info" ng-if="!data.list.length && !data.num_pages && !data.invalid_table && !loadingData">
      ${No records in {{data.table_label}} <span ng-if="data.filter">using that filter</span>}
    </div>
    <div class="alert alert-info" ng-if="loadingData">
      <fa name="spinner" spin="true"></fa> ${Loading data}...
    </div>
    <table class="table table-striped table-responsive" ng-if="data.list.length" >
      <caption class="sr-only">{{data.title || data.table_plural}}</caption>
      <thead>
        <tr>
          <th ng-repeat="field in data.fields_array track by $index" class="text-nowrap" ng-click="setOrderBy(field)"
              scope="col" role="columnheader" aria-sort="{{field == data.o ? (data.d == 'asc'? 'ascending': 'descending') : 'none'}}">
            <div class="th-title" title="${Sort by} {{field == data.o ? (data.d == 'asc' ?  '${Descending}': '${Ascending}') : '${Ascending}'}}" role="button" tabindex="0" aria-label="{{data.column_labels[field]}}">{{data.column_labels[field]}}</div>
            <i class="fa" ng-if="field == data.o" ng-class="{'asc': 'fa-chevron-up', 'desc': 'fa-chevron-down'}[data.d]"></i>
          </th>
        </tr>
      </thead>
      <div>
        <tbody class="groupByRow" ng-if="data.listGrouped" ng-repeat-start="(listKey, list) in c.sortObjectKeys(c.data.listGrouped) track by $index">
        <tr>
          <td class="toggleCollapse" colspan="{{::data.fields_array.length}}">
            <button class="groupLabel unstyled btn btn-block" type="button" data-target="#collapse_{{$index}}" data-toggle="collapse"  aria-expanded="false" aria-controls="#collapse_{{$index}}">
              {{listKey}} ({{list.length}})
            </button>
          </td>
        </tr>
      </tbody>
      <tbody ng-repeat-end class="collapse" id="collapse_{{$index}}">
        <tr ng-repeat="item in list track by item.sys_id">
          <td role="{{$first ? 'rowheader' : 'cell'}}" class="pointer sp-list-cell" ng-class="{selected: item.selected}" ng-repeat="field in ::data.fields_array" data-field="{{::field}}" data-th="{{::data.column_labels[field]}}">
            <span ng-click="go(item.targetTable, item)" ng-if="$first"><a href="javascript:void(0)" aria-label="${Open record}: {{::item[field].display_value}}">{{::item[field].display_value | limitTo : item[field].limit}}{{::item[field].display_value.length > item[field].limit ? '...' : ''}}</a></span>
            <span ng-if="!$first && field != 'actions' && item[field].type != 'url'" title="{{item[field].display_value}}">{{item[field].display_value | limitTo : item[field].limit}}{{item[field].display_value.length > item[field].limit ? '...' : ''}}</span>
            <span ng-if="!$first && field != 'actions' && item[field].type == 'url'"><a ng-href="{{item[field].display_value}}" target="_blank" title="${External link}">{{item[field].display_value | limitTo : item[field].limit}}{{item[field].display_value.length > item[field].limit ? '...' : ''}}</a></span>
          </td>
        </tr>
      </tbody>
      </div>
      
      <tbody ng-if="!data.listGrouped">
        <tr ng-repeat="item in data.list track by item.sys_id">
          <td role="{{$first ? 'rowheader' : 'cell'}}" class="pointer sp-list-cell" ng-class="{selected: item.selected}" ng-repeat="field in ::data.fields_array" data-field="{{::field}}" data-th="{{::data.column_labels[field]}}">
            <span ng-click="go(item.targetTable, item)" ng-if="$first"><a href="javascript:void(0)" aria-label="${Open record}: {{::item[field].display_value}}">{{::item[field].display_value | limitTo : item[field].limit}}{{::item[field].display_value.length > item[field].limit ? '...' : ''}}</a></span>
            <span ng-if="!$first && field != 'actions' && item[field].type != 'url'" title="{{item[field].display_value}}">{{item[field].display_value | limitTo : item[field].limit}}{{item[field].display_value.length > item[field].limit ? '...' : ''}}</span>
            <span ng-if="!$first && field != 'actions' && item[field].type == 'url'"><a ng-href="{{item[field].display_value}}" target="_blank" title="${External link}">{{item[field].display_value | limitTo : item[field].limit}}{{item[field].display_value.length > item[field].limit ? '...' : ''}}</a></span>
          </td>
        </tr>
      </tbody>
    </table>
    <div ng-class="{'pruned-msg-filter-pad': (!options.show_breadcrumbs || !data.filter) && !data.list.length}" class="pruned-msg" ng-if="rowsWerePruned()">
      <span ng-if="rowsPruned == 1">${{{rowsPruned}} row removed by security constraints}</span>
      <span ng-if="rowsPruned > 1">${{{rowsPruned}} rows removed by security constraints}</span>
    </div>
  </div>
  <!-- footer -->
  <div class="panel-footer" ng-hide="options.hide_footer" ng-if="data.row_count" role="navigation" aria-label="${Pagination}">
    <div class="btn-toolbar m-r pull-left">
      <div class="btn-group">
        <a href="javascript:void(0)" ng-click="setPageNum(data.p - 1)" ng-class="{'disabled': data.p == 1}" class="btn btn-default" aria-label="${Previous page} {{data.p == 1 ? '${disabled}' : ''}}" tabindex="{{(data.p == 1) ? -1 : 0}}"><i class="fa fa-chevron-left"></i></a>
      </div>
      <div ng-if="data.num_pages > 1 && data.num_pages < 20" class="btn-group">
        <a ng-repeat="i in getNumber(data.num_pages) track by $index" ng-click="setPageNum($index + 1)" href="javascript:void(0)" ng-class="{active: ($index + 1) == data.p}" type="button" class="btn btn-default" aria-label="${Page} {{$index + 1}}" ng-attr-aria-current="{{($index + 1) == data.p ? 'page' : undefined}}">{{$index + 1}}</a>
      </div>
      <div class="btn-group">
        <a href="javascript:void(0)" ng-click="setPageNum(data.p + 1)" ng-class="{'disabled': data.p == data.num_pages}" class="btn btn-default" aria-label="${Next page} {{data.p == data.num_pages ? '${disabled}' : ''}}" tabindex="{{(data.p == data.num_pages) ? -1 : 0}}"><i class="fa fa-chevron-right"></i></a>
      </div>
    </div>
    <div class="m-t-xs panel-title">${Rows {{data.window_start + 1}} - {{ mathMin(data.window_end,data.row_count) }} of {{data.row_count}}}</div>

    <span class="clearfix"></span>
  </div>
</div>
//END HTML


//CSS
.panel-heading {
  padding-left: 8px;
}

thead {
  border-bottom: 1px solid #ddd;
}

table {
  margin-bottom: 0;
}

.table > thead > tr > th {
  border: 1px solid #ddd;
  cursor: pointer;
  vertical-align: middle;

  &:nth-child(2) {
    border-left: none;
  }



  &:last-child {
    border-right: none;
  }
}

th i {
  display: inline-block;
  margin-left: 5px;
  color: #A0A0A0;
}

div.data-table-high-contrast th i {
  color: $gray; 
}

th .disabled{
  color:#ddd;
}

.th-title {
  display: inline-block;
  color: $primary;
}

.panel-body {
  overflow: auto;
  padding: 0px;
}


.selected {
  color: #fff;
  background-color: $data-table-selected;
  border-color: 1px solid #fff;
}

tbody tr:last-child {
  border-bottom: none;
}

.pruned-msg {
  padding-bottom: 10px;
  padding-left: 4px;
  text-align: center;
}

.pruned-msg-filter-pad {
  padding-top:8px;
}

.filter-breadcrumbs {
  padding-top: 3px;
}

.filter-breadcrumbs ~ .table {
  border-top: 1px solid #ddd;
}

.dropdown-toggle {
  background: none;
  padding: 0 0 4px 0;
}

.sp-list-cell {
  white-space: pre-wrap;
}


.groupByRow{

  .toggleCollapse{
    padding: 0;
    cursor: pointer
  }

  a.unstyled{
    color: inherit;
  }

  .groupLabel{
    padding: 1rem;
    text-align: left;
    font-weight: 500;
    background-color: #E5E5E5;
    border-radius: 0;
  }  
}
//END CSS

//SERVER
(function() {
	if (!input) // asynch load list
		return;

	data.msg = {};
	data.msg.sortingByAsc = gs.getMessage("Sorting by ascending");
	data.msg.sortingByDesc = gs.getMessage("Sorting by descending");
	data.searchMsg = gs.getMessage("Search");

	/*
	 * data.table = the table
	 * data.p = the current page starting at 1
	 * data.o = the order by column
	 * data.d = the order by direction
	 * data.keywords = the keyword search term
	 * data.list = the table data as an array
	 * data.invalid_table = true if table is invalid or if data was not succesfully fetched
	 * data.table_label = the table's display name. e.g. Incident
	 * data.table_plural = the table's plural display name. e.g. Incidents
	 * data.fields = a comma delimited list of field names to show in the data table
	 * data.column_labels = a map of field name -> display name
	 * data.window_size = the number of rows to show
	 * data.filter = the encoded query
	 */
	// copy to data[name] from input[name] || option[name]
	optCopy(['table', 'p', 'o', 'd', 'filter', 'fixed_query', 'filterACLs', 'fields', 'keywords', 'view']);
	optCopy(['relationship_id', 'apply_to', 'apply_to_sys_id', 'window_size']);
	optCopy(['groupBy']);
	if (!data.table) {
		data.invalid_table = true;
		data.table_label = "";
		return;
	}

	if (!data.fields) {
		if (data.view)
			data.fields = $sp.getListColumns(data.table, data.view);
		else
			data.fields = $sp.getListColumns(data.table);
	}

	data.view = data.view || 'mobile';
	data.table = data.table || $sp.getValue('table');
	data.filter = data.filter || $sp.getValue('filter');
	data.keywords = data.keywords || $sp.getValue('keywords');
	data.p = data.p || $sp.getValue('p') || 1;
	data.p = parseInt(data.p);
	data.o = data.groupBy || data.o || $sp.getValue('o') || $sp.getValue('order_by');
	data.d = data.d || $sp.getValue('d') || $sp.getValue('order_direction') || 'asc';
	data.groupBy = data.groupBy || $sp.getValue('groupBy') || $sp.getValue('group_by') || '';

	data.useTinyUrl = gs.getProperty('glide.use_tiny_urls') === 'true';
	data.tinyUrlMinLength = gs.getProperty('glide.tiny_url_min_length');

	var grForMetaData = new GlideRecord(data.table);

	if (input.setOrderUserPreferences) {
		// update User Preferences on a manual sort for UI consistency
		gs.getUser().savePreference(data.table + ".db.order", data.o);
		gs.getUser().savePreference(data.table + ".db.order.direction", data.d == "asc" ? "" : "DESC");
		data.setOrderUserPreferences = false;
	}
	// if no sort specified, find a default column for UI consistency
	if (!data.o)
		getOrderColumn();

	data.page_index = data.p - 1;
	data.show_new = data.show_new || options.show_new;
	var windowSize = data.window_size || $sp.getValue('maximum_entries') || 20;
	windowSize = parseInt(windowSize);
	if (isNaN(windowSize) || windowSize < 1)
		windowSize = 20;
	data.window_size = windowSize;

	var gr;
	// FilteredGlideRecord is not supported in scoped apps, so GlideRecordSecure will always be used in an application scope
	if (typeof FilteredGlideRecord != "undefined" && (gs.getProperty("glide.security.ui.filter") == "true" || grForMetaData.getAttribute("glide.security.ui.filter") != null)) {
		gr = new FilteredGlideRecord(data.table);
		gr.applyRowSecurity();
	} else
		gr = new GlideRecordSecure(data.table);

	if (!gr.isValid()) {
		data.invalid_table = true;
		data.table_label = data.table;
		return;
	}

	data.canCreate = gr.canCreate();
	data.newButtonUnsupported = data.table == "sys_attachment";
	data.table_label = gr.getLabel();
	data.table_plural = gr.getPlural();
	data.title = input.useInstanceTitle && input.headerTitle ? gs.getMessage(input.headerTitle) : data.table_plural;
	data.hasTextIndex = $sp.hasTextIndex(data.table);
	if (data.filter) {
		if (data.filterACLs)
			gr = $sp.addQueryString(gr, data.filter);
		else
			gr.addEncodedQuery(data.filter);
	}
	if (data.keywords) {
		gr.addQuery('123TEXTQUERY321', data.keywords);
		data.keywords = null;
	}

	data.filter = gr.getEncodedQuery();

	if(!gs.nil(data.fixed_query)){
		gr.addEncodedQuery(data.fixed_query);
	}

	if (data.relationship_id) {
		var rel = GlideRelationship.get(data.relationship_id);
		var target = new GlideRecord(data.table);
		var applyTo = new GlideRecord(data.apply_to);
		applyTo.get("sys_id", data.apply_to_sys_id);
		rel.queryWith(applyTo, target); // put the relationship query into target
		data.exportQuery = target.getEncodedQuery();
		gr.addEncodedQuery(data.exportQuery); // get the query the relationship made for us
	}
	if (data.exportQuery)
		data.exportQuery += '^' + data.filter;
	else
		data.exportQuery = data.filter;
	data.exportQueryEncoded = encodeURIComponent(data.exportQuery + (!gs.nil(data.fixed_query) ? ('^' + data.fixed_query) : ''));
	if (data.o){
		if (data.d == "asc")
			gr.orderBy(data.o);
		else
			gr.orderByDesc(data.o);
		if (gs.getProperty("glide.secondary.query.sysid") == "true")
			gr.orderBy("sys_id");
	}

	data.window_start = data.page_index * data.window_size;
	data.window_end = (data.page_index + 1) * data.window_size;
	gr.chooseWindow(data.window_start, data.window_end);
	gr.setCategory("service_portal_list");
	gr._query();

	data.row_count = gr.getRowCount();
	data.num_pages = Math.ceil(data.row_count / data.window_size);
	data.column_labels = {};
	data.column_types = {};
	data.fields_array = data.fields.split(',');

	// use GlideRecord to get field labels vs. GlideRecordSecure
	for (var i in data.fields_array) {
		var field = data.fields_array[i];
		var ge = grForMetaData.getElement(field);
		if (ge == null)
			continue;

		data.column_labels[field] = ge.getLabel();
		data.column_types[field] = ge.getED().getInternalType();
	}

	data.list = [];
	if(data.groupBy)
	data.listGrouped = {};
	else
		data.listGrouped = "";
	while (gr._next()) {
		var record = {};
		$sp.getRecordElements(record, gr, data.fields);
		if (typeof FilteredGlideRecord != "undefined" && gr instanceof FilteredGlideRecord) {
			// FilteredGlideRecord doesn't do field-level
			// security, so take care of that here
			for (var f in data.fields_array) {
				var fld = data.fields_array[f];
				if (!gr.isValidField(fld))
					continue;

				if (!gr[fld].canRead()) {
					record[fld].value = null;
					record[fld].display_value = null;
				}		
			}
		}
		record.sys_id = gr.getValue('sys_id');
		record.targetTable = gr.getRecordClassName();

		if(data.groupBy && data.groupBy == data.o && record.hasOwnProperty(data.groupBy)){
			var groupBy_dv = record[data.groupBy].display_value;
			if(data.listGrouped.hasOwnProperty(groupBy_dv))
				data.listGrouped[groupBy_dv].push(record);
			else{
				data.listGrouped[groupBy_dv] = [];
				data.listGrouped[groupBy_dv].push(record);
			}
		}

		data.list.push(record);
	}

	data.enable_filter = (input.enable_filter == true || input.enable_filter == "true" ||
												options.enable_filter == true || options.enable_filter == "true");
	var breadcrumbWidgetParams = {
		table: data.table,
		query: data.filter,
		enable_filter: data.enable_filter
	};
	data.filterBreadcrumbs = $sp.getWidget('widget-filter-breadcrumbs', breadcrumbWidgetParams);

	// copy to data from input or options
	function optCopy(names) {
		names.forEach(function(name) {
			data[name] = input[name] || options[name];
		})
	}

	// getOrderColumn logic mirrors that of Desktop UI when no sort column is specified
	function getOrderColumn() {
		// First check for user preference
		var pref = gs.getUser().getPreference(data.table + ".db.order");
		if (!GlideStringUtil.nil(pref)) {
			data.o = pref;
			if (gs.getUser().getPreference(data.table + ".db.order.direction") == "DESC")
				data.d = 'desc';
			return;
		}

		// If no user pref, check for table default using same logic as Desktop UI:
		// 1) if task, use number
		// 2) if any field has isOrder attribute, use that
		// 3) use order, number, name column if exists (in that priority)
		if (grForMetaData.isValidField("sys_id") && grForMetaData.getElement("sys_id").getED().getFirstTableName() == "task") {
			data.o = "number";
			return;
		}

		// Next check for isOrder attribute on any column
		var elements = grForMetaData.getElements();
		// Global and scoped GlideRecord.getElements return two different things,
		// so convert to Array if needed before looping through
		if (typeof elements.size != "undefined") {
			var elementArr = [];
			for (var i = 0; i < elements.size(); i++)
				elementArr.push(elements.get(i));
			elements = elementArr;
		}
		// Now we can loop through
		for (var j = 0; elements.length > j; j++) {
			var element = elements[j];
			if (element.getAttribute("isOrder") == "true") {
				data.o = element.getName();
				return;
			}
		}
		// As last resort, sort on Order, Number, or Name column
		if (grForMetaData.isValidField("order"))
			data.o = "order";
		else if (grForMetaData.isValidField("number"))
			data.o = "number";
		else if (grForMetaData.isValidField("name"))
			data.o = "name";
	}

})();
//END SERVER

//CLIENT
function ($scope, $location, $window, spUtil, amb, $http, spAriaUtil, $timeout, spNavStateManager, i18n) {
	var c = this;
	/*
	 * options:
	 * hide_footer (bool) = true to remove the data table footer contents
	 * hide_header (bool) = true to remove the data table header contents
	 * show_new (bool) = true to show the "New" record button
	 * show_keywords (bool) = true to show the keyword search field
	 * table (string) = the table name to query
	 * filter (string) = the encoded query
	 * o (string) = the order by column
	 * d (string) = The order by direction: asc or desc
	 * p (int) = the page to jump to
	 * fields (string) = comma separated list of fields that become the list columns
	 * view (string) = the default view to load for columns, overrides fields
	*/
	$scope.accessibilityModeEnabled = spAriaUtil.isAccessibilityEnabled();
	$scope.exportTypes = [{label:'PDF', value: 'PDF'}, {label:'Excel', value:'EXCEL'}, {label:'CSV', value:'CSV'}];
	var keys = ['table', 'filter', 'p', 'o', 'd'];

	var i18nMsgs = {
		filteredResults: i18n.getMessage('Filtered {0} list showing {1} to {2} of {3} records'),
		unFilteredResults: i18n.getMessage('Unfiltered {0} list showing {1} to {2} of {3} records'),
		filteredNoResults: i18n.getMessage('Filtered {0} list showing 0 records'),
		unFilteredNoResults: i18n.getMessage('Unfiltered {0} list showing 0 records')
	};

	var eventNames = {
		click: 'data_table.click',
		setFilter: 'data_table.setFilter',
		setKeywords: 'data_table.setKeywords'
	};

	$scope.go = function(table, item) {
		if ($window.getSelection().toString().length > 0)
			return;

		spNavStateManager.onRecordChange(table).then(function() {
			var parms = {};
			parms.table = table;
			parms.sys_id = item.sys_id;
			parms.record = item;
			$scope.ignoreLocationChange = true;
			for (var x in c.data.list) {
				c.data.list[x].selected = false;
			}
			item.selected = true;
			$scope.$emit(eventNames.click, parms);
		}, function() {
			// do nothing in case of closing the modal by clicking on x
		});	
	};

	$scope.checkAndSetTinyUrl = function() {
		var url = $scope.data.table + '_list.do?' + 'sysparm_query=' + $scope.data.exportQueryEncoded + '&sysparm_view=' + $scope.data.view + '&sysparm_fields=' + $scope.data.fields;
		$scope.tinyUrlEnabled = c.data.useTinyUrl && url.length >= c.data.tinyUrlMinLength;
		if ($scope.tinyUrlEnabled)
			$scope.getTinyUrl(url);
	};

	$scope.getTinyUrl = function(url) {
		$http.post('/api/now/tinyurl', {
			url: url
		}).then(function(response) {
			$scope.tinyUrl = new URL($window.location.origin + '/' + response.data.result).searchParams.get('sysparm_tiny');
		});
	};

	$scope.newRecord = function(){
		var parms = {
			id: 'form',
			table: $scope.data.table,
			view: $scope.data.view,
			sys_id: '-1'
		};
		if ($scope.data.exportQuery != '')
			parms.query = $scope.data.exportQuery;

		$location.search(parms);
	};

	function recoverStateFromUrl() {
		$scope.data.fields = [];
		var s = $location.search();
		for (var x in keys) {
			if (s[keys[x]]) {
				$scope.data[keys[x]] = s[keys[x]];
			}
		}
		$scope.server.update().then(function(data) {
			if (s.sys_id) {
				for (var x in data.list) {
					if (data.list[x].sys_id == s.sys_id) {
						$scope.go(s.table, data.list[x]);
					}
				}
			}
		});
	}

	if ($scope.options.fromUrl) {
		var origSearch = $location.search();
		$scope.$on('$locationChangeSuccess', function(e) {
			var s = $location.search();
			if (origSearch.id !== s.id)
				return;

			if ($scope.ignoreLocationChange){
				$scope.ignoreLocationChange = false;
				return;
			}

			// Helps to recover state when using the browser's back button
			recoverStateFromUrl();
		});
	}


	$scope.getNumber = function(num) {
		return new Array(num);
	}

	$scope.mathMin = function(v1,v2) {
		return Math.min(v1,v2);
	}

	function getData(updateUrl) {
		var f = $scope.data;
		spUtil.update($scope).then(function(data) {
			f.view = data.view;
			if ($scope.options.fromUrl && updateUrl)
				setPermalink(f.table, f.filter, f.o, f.d, f.p, f.groupBy);

			if ($scope.options.show_breadcrumbs && data.filterBreadcrumbs)
				$scope.$broadcast('widget-filter-breadcrumbs.setBreadcrumbs', data.filterBreadcrumbs.data, data.filter);

			invokeResultsLiveMessage();
			initRecordWatcher(f.table, f.filter);
			$scope.checkAndSetTinyUrl();
		});
	}

	function invokeResultsLiveMessage(){
		var data = $scope.data;
		var totalRowCount = data.row_count;
		var startIndex = data.window_start+1;
		var endIndex = Math.min(data.window_end, totalRowCount);

		if (totalRowCount > 0)
			spAriaUtil.sendLiveMessage( (data.filter ? i18nMsgs.filteredResults : i18nMsgs.unFilteredResults).withValues([data.table_plural, startIndex, endIndex, totalRowCount]));	
		else
			spAriaUtil.sendLiveMessage( (data.filter ? i18nMsgs.filteredNoResults : i18nMsgs.unFilteredNoResults).withValues([data.table_plural]));
	}

	function setPermalink(table, filter, orderBy, orderDirection, page){
		$scope.ignoreLocationChange = true;
		var search = $location.search();
		angular.extend(search, {
			spa: 1,
			table: table,
			filter: filter,
			p: page,
			o: orderBy,
			d: orderDirection
		});
		$location.search(search);
	}

	var watcher;
	function initRecordWatcher(table, filter){
		if (watcher)
			watcher.unsubscribe();

		if (table && filter) {
			var watcherChannel = amb.getChannelRW(table, filter);
			amb.connect();
			watcher = watcherChannel.subscribe(function(message) {
				if (!message.data)
					return;
				switch(message.data.action) {
					case "change":
						updateRowFromRW(message);
						break;
					case "exit":
						// A record was removed
					case "enter":
						// A record was added
					default:
						spUtil.update($scope);
						break;
				}
			});
		}
	}

	function updateRowFromRW(message) {
		if (message.data && message.data.sys_id && $scope.data.list) {
			var row, field;
			for(var i=0;i<$scope.data.list.length; i++) {
				row = $scope.data.list[i];
				if (row.sys_id == message.data.sys_id) {
					var fields = Object.getOwnPropertyNames(message.data.record);
					for(var f in fields) {
						field = fields[f];
						if(typeof row[field] !== 'undefined') {
							row[field].display_value = message.data.record[field].display_value;
						}
					}
				}
			}
		}
	}

	$scope.$on('$destroy', function() {
		if (watcher)
			watcher.unsubscribe();
	});

	$scope.setPageNum = function(num) {
		$scope.data.p = num;
		getData(true);
		$timeout(function() {
			$scope.focusOnTableHeader();
		});
	}

	$scope.setOrderBy = function(field) {
		var d = "asc";
		// descending default sort for date/time columns for UI consistency
		var fieldType = $scope.data.column_types[field];
		if (fieldType == "glide_date_time" || fieldType == "glide_date")
			d = "desc";
		if ($scope.data.o == field) {
			if ($scope.data.d == "asc")
				d = "desc";
			else
				d = "asc";
		}

		if (d === "asc") {
			spAriaUtil.sendLiveMessage($scope.data.msg.sortingByAsc);
		} else if (d === "desc") {
			spAriaUtil.sendLiveMessage($scope.data.msg.sortingByDesc);
		}

		$scope.data.o = field;
		$scope.data.d = d;
		$scope.data.groupBy = "";
		$scope.data.setOrderUserPreferences = true;
		$scope.setSearch(true);
	}

	$scope.setSearch = function(updateUrl) {
		$scope.data.p = 1;
		if ($scope.data.keywords) {
			var previousSearchTerm = $scope.previousSearchTerm;
			if (previousSearchTerm) {
				previousSearchTerm = '123TEXTQUERY321=' + previousSearchTerm;
				var previousSearchTermStartIndex = $scope.data.filter.indexOf(previousSearchTerm);
				var previousSearchTermEndIndex = previousSearchTermStartIndex + previousSearchTerm.length;
				if (previousSearchTermStartIndex >= 0)
					$scope.data.filter = $scope.data.filter.substr(0, previousSearchTermStartIndex) + $scope.data.filter.substr(previousSearchTermEndIndex + 1, $scope.data.filter.length);
			}
			$scope.previousSearchTerm = $scope.data.keywords;
		}
		getData(updateUrl);
	}

	$scope.$on(eventNames.setFilter, function(e, newFilter){
		$scope.data.filter = newFilter;
		$scope.setSearch(false);
	});

	$scope.$on(eventNames.setKeywords, function(e, keywords){
		$scope.data.keywords = keywords;
		$scope.setSearch(false);
	});

	$scope.$on('widget-filter-breadcrumbs.queryModified', function(e, newFilter){
		$scope.data.filter = newFilter;
		$scope.setSearch(true);
	});

	$scope.rowsWerePruned = function() {
		if (!$scope.data.list)
			return;

		$scope.rowsPruned = $scope.mathMin($scope.data.window_end,$scope.data.row_count) - $scope.data.window_start - $scope.data.list.length;
		return $scope.rowsPruned > 0;
	}

	$scope.showFilter = function() {
		return !$scope.data.list.length && !$scope.data.num_pages && !$scope.data.invalid_table && !$scope.loadingData;
	}

	c.appendQuery = function(query){
		if ($scope.data.filter.length > 1)
			$scope.data.filter += '^';
		$scope.data.filter += query;
		$scope.setSearch();

	}

	// Makes Widget Async
	$scope.data = $scope.options;
	$scope.loadingData = true;
	$scope.server.update().then(function() {
		if ($scope.data.newButtonUnsupported)
			console.log("Service Portal: New button not supported for sys_attachment list");
		$scope.loadingData = false;
		initRecordWatcher($scope.data.table, $scope.data.filter);
		$scope.checkAndSetTinyUrl();
	});

	function parseQuery(table, queryString){
		return $http.post('/api/now/sp/parsequery/' + table, queryString).then(function(response){
			return response.data.result;
		});
	}

		c.setGroupBy = function(field){
			var eq = $scope.data.filter;
		$scope.data.groupBy = field;
		$scope.setSearch();
		$location.search(angular.extend($location.$$search, {spa: 1, filter: eq,}));
	}

	c.unsetGroupBy = function(){
		var eq = $scope.data.filter;
		$scope.data.groupBy = '';
		$scope.setSearch();
		$location.search(angular.extend($location.$$search, {spa: 1, filter: eq,}));
	}
	
	c.sortObjectKeys = function (unsortedObj) {
		return Object.keys(unsortedObj).sort().reduce(function(obj,key){
			obj[key] = unsortedObj[key]; 
			return obj;
		},{});
	}

	c.createQueryTerm = function(table, field, sys_id, operator){
		return $http.get('/api/now/sp/getInOutQueryTerm', {
			params: {
				table: table,
				sys_id: sys_id,
				field: field,
				operator: operator
			}
		}).then(function(response){
			if (response && response.data && response.data.result)
				return response.data.result.parts;
		});
	}

	c.isMultiPart = function(terms) {
		for (var i = 0; i < terms.length; i++) {
			var term = terms[i];
			while (term.left)
				term = term.left;
			if (term.NQ)
				return true;
		}
		return false;
	}

	c.showMatching = function(field, newTerm) {	
		var queryString = $scope.data.filter;
		var eq = "";
		parseQuery($scope.data.table, queryString).then(function(oldTerms) {
			var isMultiPart = c.isMultiPart(oldTerms);
			for (var i = 0; i < oldTerms.length; i++) {
				var term = oldTerms[i];
				if (!isMultiPart && isSameField(newTerm, term))
					continue;

				if (eq.length)
					eq += '^';

				// term may be separated into nested "left" and "right" bits,
				// follow the lefts to the bottom where "NQ" might be specified
				var termNQCheck = oldTerms[i];
				while (termNQCheck.left)
					termNQCheck = termNQCheck.left;
				if (termNQCheck.NQ) {
					// query is multipart so apply new term to each part
					eq += getEncodedTerm(newTerm);
					eq += "^NQ";
				}
				eq += getEncodedTerm(term);
			}
			if (eq.length)
				eq += '^';
			eq += getEncodedTerm(newTerm);

			$scope.data.filter = eq;
			$scope.data.groupBy = "";
			$scope.setSearch();
			$location.search(angular.extend($location.$$search, {spa: 1, filter: eq,}));
		});
	};

	c.filterOut = function(field, newTerm) {
		var eq = "";
		if ($scope.data.filter.indexOf("^NQ") == -1) {
			// don't need server roundtrip to parse query,
			// can just append the new term
			eq = $scope.data.filter;
			if (eq.length)
				eq += '^';
			eq += getEncodedTerm(newTerm);
			$scope.data.filter = eq;
			$scope.data.groupBy = "";
			$scope.setSearch();
			$location.search(angular.extend($location.$$search, {spa: 1, filter: eq,}));
			return;
		}

		// query may be multipart so must apply new term to each part
		var queryString = $scope.data.filter;
		parseQuery($scope.data.table, queryString).then(function(oldTerms) {
			for (var i = 0; i < oldTerms.length; i++) {
				var term = oldTerms[i];
				if (eq.length)
					eq += '^';

				// term may be separated into nested "left" and "right" bits,
				// follow the lefts to the bottom where "NQ" might be specified
				var termNQCheck = oldTerms[i];
				while (termNQCheck.left)
					termNQCheck = termNQCheck.left;
				if (termNQCheck.NQ) {
					// query is multipart so apply new term to end of each part
					eq += getEncodedTerm(newTerm);
					eq += "^NQ";
				}
				eq += getEncodedTerm(term);
			}
			if (eq.length)
				eq += '^';
			eq += getEncodedTerm(newTerm);

			$scope.data.filter = eq;
			$scope.data.groupBy = "";
			$scope.setSearch();
			$location.search(angular.extend($location.$$search, {spa: 1, filter: eq,}));
		});
	};

	function isSameField(t1, t2) {
		if ('left' in t1 && 'left' in t2)
			return t1.left.query_term_field === t2.left.query_term_field;
		else if ('left' in t1)
			return t1.left.query_term_field === t2.query_term_field;
		else if ('left' in t2)
			return t1.query_term_field === t2.left.query_term_field;
		return t1.query_term_field === t2.query_term_field;
	}

	function getEncodedTerm(term) {
		var eq;
		if (term.left) {
			eq = getEncodedTerm(term.left);
			eq += '^OR';
			eq += getEncodedTerm(term.right);
		} else {
			eq = term.query_term_field;
			eq += term.operator;
			eq += term.value;
		}
		return eq;
	}
}
//END CLIENT
// LINK
function(scope, element, attrs, ctrl){
	var $ul, $contextMenu;

	scope.focusOnTableHeader = function() {
		element.find(".data-table-title").attr("tabindex", "-1").focus();
	}

	element.on('contextmenu', function(e){
		if (e.ctrlKey)
			return; // ctrlKey is for the debug menu, not this menu

		var rowScope = angular.element(e.target).scope();
		var field, item, fieldVal;
		
		// Context Menu for thead
		if (angular.isDefined(rowScope.field) && !angular.isDefined(rowScope.item)){
			e.preventDefault();
			
			field = rowScope.field; 

			var items = [];
			items.push(['${Group by}', function(){
					ctrl.setGroupBy(field);
				}]);

			if(scope.data.groupBy){
				items.push(['${Ungroup}', function(){
					ctrl.unsetGroupBy();
				}]);
			}

			renderContextMenu(items);
			setContextMenuPosition(e);
		}
		

		// Context Menu for tbody
		if (angular.isDefined(rowScope.field) && angular.isDefined(rowScope.item)){
			e.preventDefault();
			
			field = rowScope.field;
			item = rowScope.item;
			fieldVal = item[field].value;
			
			var items = [
				['${Show Matching}', function(){
					ctrl.createQueryTerm(scope.data.table, field, item.sys_id, '=').then(function(term){
						ctrl.showMatching(field, term);
					});
				}],
				['${Filter Out}', function(){
					ctrl.createQueryTerm(scope.data.table, field, item.sys_id, '!=').then(function(term){
						ctrl.filterOut(field, term);
					});
				}]
			];

			renderContextMenu(items);
			setContextMenuPosition(e);
		}
	});

	function renderContextMenu(items){
		var scrollHeight = $('body').get(0).scrollHeight;
		$contextMenu = angular.element('<div>', {'class': 'dropdown clearfix context-dropdown open'});

		$contextMenu.on('click', function (e) {
			if ($(e.target).hasClass('dropdown')) {
				_clearContextMenus(event);
			}
		});
		$contextMenu.on('contextmenu', function (event) {
			event.preventDefault();
			_clearContextMenus(event);
		});

		$contextMenu.css({
			position: 'absolute',
			top: 0,
			height: scrollHeight,
			left: 0,
			right: 0,
			zIndex: 9999
		});

		$('body').append($contextMenu);

		$ul = angular.element('<ul>', {
			'class': 'dropdown-menu',
			'role': 'menu'
		});
		renderItems();
		$contextMenu.append($ul);

		function renderItems(){
			angular.forEach(items, function (item) {
				var $li = angular.element('<li>');

				if (item === null) {
					$li.addClass('divider');
				} else {
					var $a = angular.element('<a>');
					$a.attr({tabindex: '-1', href:'#'});
					$a.text(item[0]);
					$li.append($a);
					$li.on('click', function (e) {
						e.preventDefault();
						scope.$apply(function () {
							_clearContextMenus(e);
							item[1].call(item, item);
						});
					});
				}

				$ul.append($li);
			});
		}
	}

	function _clearContextMenus(event){
		if (!event){
			return;
		}

		angular.element(event.currentTarget).removeClass('context');

		var els = angular.element(".context-dropdown");
		angular.forEach(els, function(el){
			angular.element(el).remove();
		});
	}

	var contextMenuItemHeight = 0;
	function setContextMenuPosition(event){
		if (contextMenuItemHeight === 0)
			contextMenuItemHeight = $ul.children(0).height();

		// Why not just call .width() and .height() on the container? Because those calculations cause browsers to reflow
		// that can cause IE10 to take 200ms to render a context menu.
		var cmWidth = 150;
		var cmHeight = contextMenuItemHeight * $ul.children().length;
		var startX = event.pageX + cmWidth >= window.innerWidth ? event.pageX - cmWidth : event.pageX;
		var startY = event.pageY + cmHeight >= window.innerHeight ? event.pageY - cmHeight : event.pageY;

		$ul.css({
			display: 'block',
			position: 'absolute',
			left: startX,
			top: startY,
			'min-width': cmWidth
		});
	}
}
//END LINK
