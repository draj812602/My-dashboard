/** @format */

import gql from 'graphql-tag';

export const REGISTERDEVICE = gql`
	mutation register_user_device($input: user_device_data) {
		register_user_device(input: $input) {
			mac_address
			location
			is_activated
		}
	}
`;

export const SAVEUSERDASHBOARD = gql`
	mutation save_user_dashboard($input: user_dashboard_data) {
		save_user_dashboard(input: $input) {
			dashboard_id
			dashboard_name
			widget_data {
				duplicate_count
				original_widget
				original_widget_id
				widget_id
				widget_name
				widget_title
				sensorName
				device_name
				device_id
				device_location
				component_id
				rule_id
				rule_name
				data_time_interval
				multi_line_chart_data {
					component_id
					sensorName
					rule_id
					rule_name
					comp_color_code
				}
				data {
					sensorValue
					sensorValueAddedTime
					color_code
					condition
					component_name
				}
				user_device_datasetname {
					device_name
					device_id
					device_dataset {
						component_id
						dataset_name
						rules {
							rule_id
							rule_name
						}
					}
					dev_component_names {
						component_id
						component_name
					}
				}
				sensor_power_data {
					dashboard_id
					widget_id
					data_type
					component_id
					component_name
					init_value
					in_out
					updated_at
					response
					responseType
				}
			}
		}
	}
`;

// export const DELETEDASHBOARD = gql`
// 	mutation delete_user_dashboard($dashboard_id: Int!) {
// 		delete_user_dashboard(dashboard_id: $dashboard_id)
// 	}
// `;

export const DATAONTIMEINTERVEL = gql`
	mutation getSensorDataOnTimeInterval($input: chartInfo) {
		getSensorDataOnTimeInterval(input: $input) {
			widget_id
			device_id
			sensorName
			component_id
			rule_id
			data_time_interval
			multi_line_chart_data {
				component_id
				sensorName
				rule_id
				rule_name
				comp_color_code
			}

			data {
				sensorValue
				sensorValueAddedTime
				color_code
				condition
				component_name
			}
		}
	}
`;

export const ADDUSER = gql`
	mutation {
		add_user_info
	}
`;

export const SAVEDASHBOARDNAME = gql`
	mutation save_dashboard_name($dashboard_name: String) {
		save_dashboard_name(dashboard_name: $dashboard_name) {
			dashboard_id
			dashboard_name
		}
	}
`;

export const UPDATECOMPONENTS = gql`
	mutation update_user_components($input: controll_dev_comp) {
		update_user_components(input: $input) {
			dashboard_id
			widget_id
			data_type
			component_id
			component_name
			init_value
			in_out
			updated_at
			response
			responseType
		}
	}
`;

export const DELETECOMPONENT = gql`
	mutation deleteWidgetComp(
		$dashboard_id: Int!
		$widget_id: Int!
		$component_id: Int!
	) {
		deleteWidgetComp(
			dashboard_id: $dashboard_id
			widget_id: $widget_id
			component_id: $component_id
		)
	}
`;

export const CREATERULESPERDEVCOMP = gql`
	mutation createRulesPerDevComp($data: Component_Rules) {
		createRulesPerDevComp(data: $data)
	}
`;

export const DELETECOMRULECONDITION = gql`
	mutation deleteCombRuleCondition(
		$mac_address: String!
		$comb_rule_id: Int!
		$comb_rule_condition_id: Int!
	) {
		deleteCombRuleCondition(
			mac_address: $mac_address
			comb_rule_id: $comb_rule_id
			comb_rule_condition_id: $comb_rule_condition_id
		)
	}
`;

export const DELETECOMBINATIONRULE = gql`
	mutation deleteCombinationalRule($mac_address: String!, $comb_rule_id: Int!) {
		deleteCombinationalRule(
			mac_address: $mac_address
			comb_rule_id: $comb_rule_id
		)
	}
`;

export const DELETERULE = gql`
	mutation deleteDeviceCompRule(
		$mac_address: String!
		$component_id: String!
		$rule_id: String!
	) {
		deleteDeviceCompRule(
			mac_address: $mac_address
			component_id: $component_id
			rule_id: $rule_id
		)
	}
`;

export const DELETECONDITION = gql`
	mutation deleteCompRuleCondition(
		$mac_address: String!
		$component_id: String!
		$rule_id: String!
		$condition_id: String!
	) {
		deleteCompRuleCondition(
			mac_address: $mac_address
			component_id: $component_id
			rule_id: $rule_id
			condition_id: $condition_id
		)
	}
`;

export const COMBRULENAMECHECK = gql`
	mutation checkCombRuleName($mac_address: String!, $comb_rule_name: String!) {
		checkCombRuleName(
			mac_address: $mac_address
			comb_rule_name: $comb_rule_name
		)
	}
`;

export const RULENAMECHECK = gql`
	mutation checkRuleName(
		$mac_address: String!
		$component_id: String!
		$rule_name: String!
	) {
		checkRuleName(
			mac_address: $mac_address
			component_id: $component_id
			rule_name: $rule_name
		)
	}
`;

export const CREATECOMBINATIONRULE = gql`
	mutation createCombinationalRule($input: comb_rule) {
		createCombinationalRule(input: $input)
	}
`;

export const EDITCOMBINATIONRULE = gql`
	mutation editCombinationalRule($input: comb_rule) {
		editCombinationalRule(input: $input)
	}
`;

export const EDITCONDITIONS = gql`
	mutation($input: Comp_Rule_Conditions) {
		updateRuleConditions(input: $input) {
			rule_data {
				mac_address
				devic_id
				rule_id
				rule_name
				component_id
			}
			conditions {
				condition_id
				condition_name
				color
				Minimum_Condition
				Maximum_Condition
			}
		}
	}
`;

export const EDITWIDGET = gql`
	mutation edit_sensor_widget($input: edit_input_widget_info) {
		edit_sensor_widget(input: $input) {
			dashboard_id
			widget_id
			widget_title
			device_id
			component_id
			rule_id
			rule_name
			timeInterval
			multi_line_chart_data {
				component_id
				sensorName
				rule_id
				rule_name
				comp_color_code
			}
			data {
				sensorValue
				sensorValueAddedTime
				color_code
				condition
				component_name
			}
		}
	}
`;

export const DUPLICATEWIDGET = gql`
	mutation createDuplicateWidget($widgetId: Int!, $widget_titl: String!) {
		createDuplicateWidget(widgetId: $widgetId, widget_titl: $widget_titl) {
			dashboard_id
			dashboard_name
			widget_data {
				duplicate_count
				original_widget
				original_widget_id
				widget_id
				widget_name
				widget_title
				sensorName
				device_name
				device_id
				device_location
				multi_line_chart_data {
					component_id
					sensorName
					rule_id
					rule_name
					comp_color_code
				}
				component_id
				rule_id
				rule_name
				data_time_interval
				data {
					sensorValue
					sensorValueAddedTime
					condition
					color_code
					component_name
				}
				user_device_datasetname {
					device_name
					device_id
					device_dataset {
						component_id
						dataset_name
						rules {
							rule_id
							rule_name
						}
					}
					dev_component_names {
						component_id
						component_name
					}
				}
				sensor_power_data {
					component_id
					component_name
					init_value
					data_type
					in_out
					updated_at
				}
			}
		}
	}
`;

//device add

export const ADDDEVICE = gql`
	mutation addDevice($input: Device) {
		addDevice(input: $input) {
			column {
				dataField
				text
				sort
			}
			data {
				device_id
				device_identifier
				device_name
				device_status
				template_id
				device_template
			}
		}
	}
`;

export const CREATETEMPLATES = gql`
	mutation addTemplate($templateName: String!) {
		addTemplate(templateName: $templateName) {
			column {
				dataField
				text
				sort
			}
			data {
				template_id
				template_name
				creation_date
				status
				published_status
			}
		}
	}
`;

export const DELETEDEVICE = gql`
	mutation deleteDevice($device_id: Int!) {
		deleteDevice(device_id: $device_id)
	}
`;
export const DELETETEMPLATE = gql`
	mutation deleteTemplate($template_id: Int!) {
		deleteTemplate(template_id: $template_id)
	}
`;

export const ASSIGNTEMPLATETODEVICE = gql`
	mutation assignTemplate($device_id: Int!, $template_id: Int!) {
		assignTemplate(device_id: $device_id, template_id: $template_id) {
			columns {
				dataField
				text
				sort
			}
			data
		}
	}
`;

export const CREATECAPABILITIES = gql`
	mutation addOrUpdateCapability($input: CapabilityInput) {
		addOrUpdateCapability(input: $input) {
			component_id
			component_name
			capabilities {
				component_cap_id
				capability_display_name
				capability_name
				capability_type
				capability_data_type
			}
		}
	}
`;
export const PUBLISHTEMPLATE = gql`
	mutation publishTemplate($template_id: Int!) {
		publishTemplate(template_id: $template_id) {
			template_id
			status
			published_status
		}
	}
`;

export const BLOCKUNBLOCKDEVICE = gql`
	mutation blockOrUnblockDevice($device_id: Int!, $status: String!) {
		blockOrUnblockDevice(device_id: $device_id, status: $status)
	}
`;

export const DELETECAPABILITY = gql`
	mutation deleteCapability(
		$template_id: Int!
		$component_cap_id: Int!
		$component_id: Int!
	) {
		deleteCapability(
			template_id: $template_id
			component_cap_id: $component_cap_id
			component_id: $component_id
		)
	}
`;

// Dashboard mutations
export const DELETEDASHBOARD = gql`
	mutation deleteDashboardName($dashboard_id: Int!) {
		deleteDashboardName(dashboard_id: $dashboard_id)
	}
`;

export const CREATEDASHBOARD = gql`
	mutation createDashboard($dashboard_name: String) {
		createDashboard(dashboard_name: $dashboard_name) {
			dashboard_id
			dashboard_name
		}
	}
`;

export const EDITDASHBOARD = gql`
	mutation editDashboardName($dashboard_id: Int!, $dashboard_name: String!) {
		editDashboardName(
			dashboard_id: $dashboard_id
			dashboard_name: $dashboard_name
		) {
			dashboard_id
			dashboard_name
		}
	}
`;

// widget gql

export const CREATEWIDGET = gql`
	mutation createWidget($input: widgetInData) {
		createWidget(input: $input) {
			widgets {
				widget_id
				widget_name
				widget_title
				device_id
				component_id
				component_name
				component_cap_id
				capability_display_name
				data_time_interval
				telemetry {
					sensorName
					sensorValue
					timestamp
				}
			}
		}
	}
`;

export const DELETEWIDGET = gql`
	mutation deleteWidget($widget_id: Int!) {
		deleteWidget(widget_id: $widget_id)
	}
`;

export const GETDATAONTIMEINTERVAL = gql`
	mutation getSensorDataOnTimeInterval($input: chartInfoIn) {
		getSensorDataOnTimeInterval(input: $input) {
			widget_id
			device_id
			component_id
			component_cap_id
			data_time_interval
			telemetry {
				sensorName
				sensorValue
				timestamp
			}
		}
	}
`;

export const EDITWIDGETS = gql`
	mutation editWidget($input: chartInfoIn) {
		editWidget(input: $input) {
			widget_id
			widget_name
			widget_title
			device_id
			component_id
			component_name
			component_cap_id
			data_time_interval
			telemetry {
				sensorName
				sensorValue
				timestamp
			}
		}
	}
`;

export const GENERATE_NEW_MQTT_PASSWORD = gql`
	mutation reGenerateSaSToken($device_id: Int!) {
		reGenerateSaSToken(device_id: $device_id) {
			device_id
			mqtt_password
			mqtt_pass_expiry_time
			is_mqtt_pass_expired
		}
	}
`;

export const ADD_COMPONENTS_TEMPLATE = gql`
	mutation addComponent($template_id: Int!, $component_name: String!) {
		addComponent(template_id: $template_id, component_name: $component_name) {
			template_id
			component_id
			component_name
		}
	}
`;

export const DELETE_COMPONENT_TEMPLATE = gql`
	mutation deleteComponent($template_id: Int!, $component_id: Int!) {
		deleteComponent(template_id: $template_id, component_id: $component_id)
	}
`;

//SEND RECEIVE CMDS

export const SEND_COMMANDS = gql`
	mutation sendC2DMessage($input: c2dMsgInput) {
		sendC2DMessage(input: $input) {
			command_widget_id
			device_id
			component_id
			component_cap_id
			response {
				c2d_msg_id
				request_payload
				request_time
				response_payload
				response_time
				response_code
				response_type
			}
		}
	}
`;
