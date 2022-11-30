import React from 'react';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const TemplateComponents = ({
	compList,
	ind,
	DeleteComponent,
	createCapabilitiesClick,
}) => {
	const mqttpasstimeTooltip = (props) => (
		<Tooltip id="toolTipRightBar" {...props}>
			Click this button to Add / View capabilities to this component
		</Tooltip>
	);
	return (
		<div>
			<div className="d-flex">
				<div className="fs-6 text-muted mb-1">Component name</div>
				<div className="ml-auto">
					<i
						className="ri-delete-bin-line delete_rule mr-2"
						title="Delete"
						onClick={() => DeleteComponent(compList, ind)}></i>
					<OverlayTrigger placement="top" overlay={mqttpasstimeTooltip}>
						<i
							className="ri-add-circle-line delete_rule mr-2"
							onClick={() => createCapabilitiesClick(compList)}></i>
					</OverlayTrigger>
				</div>
			</div>
			<div className="fs-5">{compList.component_name}</div>
		</div>
	);
};

export default TemplateComponents;
