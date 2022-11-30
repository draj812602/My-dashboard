import React from 'react';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function TopBar(props) {
	return (
		<div
			className={
				props.sidebarToggle === true || props.sidebarToggle === 'true'
					? 'row dashboard_menu_container_shrink'
					: 'row dashboard_menu_container'
			}>
			<div className="col-12 12 col-md-12 col-lg-12 col-xl-12 text-white fs-1 mb-2 mt-2">
				{props.name}
			</div>
		</div>
	);
}
