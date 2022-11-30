/** @format */

import gql from 'graphql-tag';

export const DASHBOARDDATA = gql`
	query {
		get_user_dahboard_data {
			dashboard_id
			dashboard_name
			widget_data {
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
				}
				sensor_power_data {
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

export const GETDEVICES = gql`
	query {
		get_user_devices {
			mac_address
			location
			is_activated
			device_type
		}
	}
`;

export const GETDEVICEDATASET = gql`
	query {
		get_device_dataset_name {
			device_name
			device_id
			device_dataset {
				dataset_name
				component_id
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
	}
`;

export const GETCHARTDATA = gql`
	query getInitialWidgetData($datasetName: String!, $deviceId: String!) {
		getInitialWidgetData(datasetName: $datasetName, deviceId: $deviceId) {
			sensorName
			sensorValue
			sensorValueAddedTime
		}
	}
`;

export const GETCOMBRULEDATA = gql`
	query getCombinationalRuleData($mac_address: String!, $comb_rule_id: Int!) {
		getCombinationalRuleData(
			mac_address: $mac_address
			comb_rule_id: $comb_rule_id
		) {
			device_id
			mac_address
			comb_rule_id
			comb_rule_name
			trigger_operator
			comb_rule_conditions {
				component_id
				component_name
				comb_rule_condition_id
				rule_id
				rule_name
				condition_id
				condition_name
			}
			emailCheckbox
			emailDat {
				recipient
				message
				subject
			}
		}
	}
`;

export const GETCOMBRULENAME = gql`
	query getCombinationalRuleNames($mac_address: String!) {
		getCombinationalRuleNames(mac_address: $mac_address) {
			comb_rule_id
			comb_rule_name
		}
	}
`;

export const DASHBOARDLIST = gql`
	query {
		getUserDashboardNames {
			dashboard_id
			dashboard_name
		}
	}
`;

export const DASHBOARDDATABYID = gql`
	query getUserDashboardWidgetInfo($dashboard_id: Int!) {
		getUserDashboardWidgetInfo(dashboard_id: $dashboard_id) {
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
`;

export const GETCOMPONENTSRULES = gql`
	query getDevCompsRules($mac_address: String!) {
		getDevCompsRules(mac_address: $mac_address) {
			device_info {
				device_id
				mac_address
				device_type
				location
			}
			device_components {
				component_id
				component_name
				rules {
					rule_id
					rule_name
					conditions {
						condition_id
						condition_name
					}
				}
			}
		}
	}
`;

export const GETRULESANDCONDITIONS = gql`
	query getRuleConditions(
		$mac_address: String!
		$component_id: String!
		$rule_id: String!
	) {
		getRuleConditions(
			mac_address: $mac_address
			component_id: $component_id
			rule_id: $rule_id
		) {
			rule_data {
				mac_address
				devic_id
				rule_id
				component_id
				rule_name
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

// new development

export const GETTEMPLATES = gql`
	query {
		getTemplate {
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
export const GETDEVICE = gql`
	query {
		getDevice {
			column {
				dataField
				text
				sort
			}
			data {
				device_id
				device_name
				device_identifier
				device_status
				template_id
				device_template
			}
		}
	}
`;

export const GETTEMPLATESLIST = gql`
	query {
		getTemplateNames {
			template_id
			template_name
		}
	}
`;

export const GETCONNECTIONINFOPERDEVICE = gql`
	query getDeviceConnectionInfo($device_id: Int!) {
		getDeviceConnectionInfo(device_id: $device_id) {
			device_id
			connection_string
			mqtt_broker_address
			mqtt_user_name
			mqtt_password
			mqtt_pass_expiry_time
			is_mqtt_pass_expired
		}
	}
`;

//GETCAPABILITIES

export const GETCAPABILITIES = gql`
	query getCapabilities($component_id: Int!) {
		getCapabilities(component_id: $component_id) {
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

//get publish status of device

export const GETTEMPLATEPUBLISHSTATUS = gql`
	query getTemplatedPublishedStatus($template_id: Int!) {
		getTemplatedPublishedStatus(template_id: $template_id)
	}
`;

// get device data by id
export const GETDEVICEDATABYID = gql`
	query getdeviceById($device_id: Int!) {
		getdeviceById(device_id: $device_id) {
			device_name
			device_identifier
			device_status
			template_id
			template_name
			device_block_status
			device_conn_status
			has_command
		}
	}
`;

// Get device raw data

export const GETDEVICERAWDATA = gql`
	query getDeviceRawData($device_id: Int!) {
		getDeviceRawData(device_id: $device_id) {
			columns {
				dataField
				text
				sort
			}
			data
		}
	}
`;

export const DASHBOARDSLIST = gql`
	query {
		getDashboardName {
			dashboard_id
			dashboard_name
		}
	}
`;

// get device and there capabilities to create widget

export const GETDEVICE_CAPABILITIES = gql`
	query {
		getDeviceCapability {
			device_id
			device_identifier
			device_name
			components {
				component_id
				component_name
				capabilities {
					component_cap_id
					capability_display_name
					capability_name
				}
			}
		}
	}
`;

// get Widget

export const GET_WIDGET_DATA = gql`
	query getWidget($dashboard_id: Int!) {
		getWidget(dashboard_id: $dashboard_id) {
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

// command widgets data
export const GET_COMMAND_WIDGETS = gql`
	query getDeviceCommandWidgets($device_id: Int!) {
		getDeviceCommandWidgets(device_id: $device_id) {
			command_widget_id
			widget_title
			widget_name
			device_id
			component_id
			component_cap_id
			command_data_type
			responsepayload
		}
	}
`;

// Get subs token

export const GET_SUBSCRIPTION_TOKEN = gql`
	{
		getSubscriptionJwtToken
	}
`;

export const GET_WIDGETS_DETAILS = gql`
	query getWidgetDetails($dashboard_id: Int!, $widget_id: Int!) {
		getWidgetDetails(dashboard_id: $dashboard_id, widget_id: $widget_id) {
			widget_id
			widget_title
			device_id
			device_name
			device_identifier
			component_id
			component_name
			component_cap_id
			capability_display_name
		}
	}
`;

// GET COMPONENTS OF SPECIFIC TEMPLATES

export const GET_COMPONENTS_OF_TEMPLATES = gql`
	query getComponents($template_id: Int!) {
		getComponents(template_id: $template_id) {
			template_id
			component_id
			component_name
		}
	}
`;

// GET HISTORY

export const GET_HISTORY = gql`
	query getCapabilityhistory($command_widget_id: Int!) {
		getCapabilityhistory(command_widget_id: $command_widget_id) {
			history {
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

// export const GET_TELEMETRYCOUNT = gql`
// query getDeviceTelemetryCount() {
// 	getDeviceTelemetryCount(user_id: $user_id) {
// 	  user_id
// 	  device_id
// 	  device_name
// 	  numberOfTelemetryUsed
// 	  maxTelemetry
// 	}
// }`
// export const GET_TELEMETRYCOUNT = gql`
// {
// 	query  getDeviceTelemetryCount(user_id: 43) {
// 	  user_id
// 	  device_id
// 	  device_name
// 	  numberOfTelemetryUsed
// 	  maxTelemetry
// 	}
//   }`
export const GET_TELEMETRYCOUNT = gql`
	query {
		getDeviceTelemetryCount {
			
	  device_id
	  device_name
	  numberOfTelemetryUsed
	  maxTelemetry
		}
	}
`;

//test Device Stats

export const GET_Device_Stats = gql`

query {

  getUserDeviceCount{

    user_id

    numberOfDevicesUsed

    maxDevices

  }

}

`;



//test Dashboard Stats

export const GET_Dashboard_Stats = gql`

query {

  getUserDashboardCount {

    user_id

    numberOfDashboardsUsed

    maxDashboards

  }

}

`;
