import React from 'react';

function DeviceInfo({ device_info }) {
	return (
		<div className="row box_style no-gutters pl-3 py-3">
			<>
				<div
					key={device_info.mac_address}
					className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-3">
					<div className="fs-6 pb-1 text-secondary">MAC Address</div>
					<div className="fs-5">{device_info.mac_address}</div>
				</div>
				<div
					key={device_info.device_type}
					className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-3">
					<div className="fs-6 pb-1 text-secondary">Device Type</div>
					<div className="fs-5">{device_info.device_type}</div>
				</div>
				<div
					key={device_info.location}
					className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-3">
					<div className="fs-6 pb-1 text-secondary">Location</div>
					<div className="fs-5">{device_info.location}</div>
				</div>
			</>
		</div>
	);
}

export default DeviceInfo;
