/** @format */

import React from 'react';
//import Bulk_upload from '../../Components/Device/bulk_upload_device';

function add_device_bulk() {
	return (
		<div>
			<div className="row">
				<div className="top_device_info col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
					<div className="inactive_breadcum">
						DEVICE CATALOG / <span className="active_breadcum">ADD DEVICE</span>
					</div>
					<div className="upload_format_text mb-2">
						Upload the devices in the below format
					</div>

					<a
						href="/images/myw3schoolsimage.jpg"
						download
						className="download_templete">
						bulk_add_device.xls
					</a>
					<div></div>
				</div>
			</div>
			{/*<Bulk_upload />*/}
		</div>
	);
}

export default add_device_bulk;
