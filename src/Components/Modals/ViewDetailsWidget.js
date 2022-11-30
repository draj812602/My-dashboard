import React, { useState, useEffect } from 'react';

import { Modal } from 'react-bootstrap';

import Loaders from '../Loader/Loader';

const ViewDetailsWidget = ({
	CloseViewWidget,
	showViewDetailsModal,
	getwidgtDetailsLoading,
	getwidgtDetailsData,
}) => {
	const [details, setdetails] = useState(null);
	useEffect(() => {
		if (!getwidgtDetailsLoading && getwidgtDetailsData) {
			setdetails(getwidgtDetailsData.getWidgetDetails);
		}
	}, [getwidgtDetailsData, getwidgtDetailsLoading]);

	return (
		<div>
			<Modal
				show={showViewDetailsModal}
				dialogClassName="device_modal_class"
				onHide={CloseViewWidget}
				backdrop="static"
				keyboard={true}>
				<div className="d-flex">
					<span className="modal_header">Details</span>
					<i
						className="ri-close-line ri-lg ml-auto fs-4"
						onClick={CloseViewWidget}></i>
				</div>
				{getwidgtDetailsLoading ? (
					<Loaders
						height={180}
						width={350}
						margin_main={-120}
						margin_top={-20}
					/>
				) : (
					details && (
						<div className="mt-3">
							<div className="fs-5 text-muted">Widget Tittle</div>
							<div className="fs-4  mb-2">{details.widget_title}</div>
							<div className="fs-5 text-muted">Device Identifier</div>
							<div className="fs-4  mb-2">{details.device_identifier}</div>
							<div className="fs-5 text-muted">Device Name</div>
							<div className="fs-4  mb-2">{details.device_name}</div>
							<div className="fs-5 text-muted">Component Name</div>
							<div className="fs-4  mb-2">{details.component_name}</div>

							<div className="fs-5 text-muted">Capability</div>
							<div className="fs-4  mb-2">
								{details.capability_display_name}
							</div>
						</div>
					)
				)}
			</Modal>
		</div>
	);
};

export default ViewDetailsWidget;
