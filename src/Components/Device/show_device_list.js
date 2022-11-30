/** @format */

import React from 'react';

function Show_device_list(props) {
	return (
		<div>
			<div className="d-flex">
				<div className="mac_heading fs-8">MAC Address</div>
				<i
					className="ri-settings-3-line ri-lg ml-auto text-muted"
					onClick={() => props.DeviceSettingClick(props.li)}></i>
			</div>
			<div className="mac_add mb-3 fs-5">{props.li.mac_address}</div>
			<div className="loc_heading fs-8">Location</div>
			<div className="location fs-5">{props.li.location}</div>
		</div>
	);
}

export default Show_device_list;
