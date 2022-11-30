/** @format */

import React from 'react';

function emptyDevice(props) {
	return (
		<div>
			<div align="center" className="empty_content_header">
				<p className="fs-3 text-primary empty_content">
					You currently don’t have any devices. All your devices will be here.
				</p>
				<div className="btn_create">
					<button className="btn btn-primary" onClick={props.Register_device_}>
						Register Devices
					</button>
				</div>
			</div>
		</div>
	);
}

export default emptyDevice;
