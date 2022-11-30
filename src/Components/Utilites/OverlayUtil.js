import React from 'react';
import { Popover, Overlay, OverlayTrigger, Tooltip } from 'react-bootstrap';

const renderZoomTooltip = (props) => (
	<Tooltip id="button-tooltip-TEST" {...props}>
		Expand to full screen
	</Tooltip>
);

export default renderZoomTooltip;
