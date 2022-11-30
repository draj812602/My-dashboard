import { gql } from '@apollo/client';

export const DEVICEWSDATA = gql`
	subscription isDeviceActivated($topic: topic_name) {
		isDeviceActivated(topic: $topic) {
			device_id
			device_name
			location
			is_activated
		}
	}
`;

export const CHARTWSDATA = gql`
	subscription sensordata($topic: topic_name) {
		sensordata(topic: $topic) {
			widget_id
			widget_id
			device_id
			sensorName
			component_id
			rule_id
			multi_line_chart_data {
				component_id
				sensorName
				rule_id
				rule_name
				comp_color_code
			}
			data_time_interval
			data {
				sensorValue
				sensorValueAddedTime
				condition
				color_code
				component_name
			}
		}
	}
`;

export const D2CMESSAGE = gql`
	subscription d2cMessage($topic: topic_name) {
		d2cMessage(topic: $topic) {
			data_type
			component_id
			component_name
			init_value
			in_out
			updated_at
		}
	}
`;

export const WIDGETSSUBSCRIPTION = gql`
	subscription UpdateLiveDataOnWidget($topic: topic) {
		UpdateLiveDataOnWidget(topic: $topic) {
			dashboard_id
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

export const UPDATE_DEVICE_CONNECTION = gql`
	subscription UpdateDeviceConnectionStatus($topic: topic) {
		UpdateDeviceConnectionStatus(topic: $topic) {
			user_id
			device_id
			device_identifier
			device_conn_status
			device_status
			timestamp
		}
	}
`;

export const UPDATENUMBEROFTELEMETRYUSED = gql`
subscription
  UpdateNumberOfTelemetryUsed($topic:topic) {
    UpdateNumberOfTelemetryUsed(topic:$topic) {
    user_id
    device_id
    device_name
    numberOfTelemetryUsed
    maxTelemetry
  }
}
`;

