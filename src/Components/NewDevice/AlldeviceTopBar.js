import React from 'react';

function AlldeviceTopBar({ props, information, mainHeading, testing }) {
	return (
		<div className="">
			{information.length === 0 ||
			information[0]?.device_block_status === 'true' ||
			information[0]?.device_block_status === true ? (
				<div className="d-flex mb-3">
					<i className="ri-mac-line  ri-lg"></i>
					<div className="d-flex ml-2">
						<div className="fs-4 heading_text">{mainHeading}</div>
					</div>
				</div>
			) : (
				<div className="d-flex">
					<i className="ri-mac-line  ri-lg"></i>
					<div className="ml-1">
						<div className="fs-4">{mainHeading}</div>
					</div>
				</div>
			)}

			{/* </div> */}
			<div className="d-flex ml-5">
				{information.map((li, index) => (
					<div className="mr-3 textclass fs-6 ml-1">
						{information.map((li, ind) => {
							return li.device_block_status === 'true' ||
								li.device_block_status === true ? (
								''
							) : li.device_conn_status ? (
								<span className="conected_text">Connected</span>
							) : (
								<span className=" disconected_text">Disconnected</span>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
}

export default AlldeviceTopBar;
