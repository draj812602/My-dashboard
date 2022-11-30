import React from 'react';

const WidgetsIcon = ({ widget_name }) => {
	return (
		<div>
			{widget_name === 'C2DMessage' && <i className="ri-cloud-line"></i>}
			{widget_name === 'ColumnChart' && <i className="ri-bar-chart-line"></i>}
			{widget_name === 'LineChart' && <i className="ri-line-chart-line"></i>}
			{/* {widget_name === 'GaugeChart' && <i className="ri-dashboard-2-line"></i>} */}
			{widget_name === 'GaugeChart' && <i className="ri-text"></i>}
			{widget_name === 'sensorpower' && <i className="ri-terminal-line"></i>}
		</div>
	);
};

export default WidgetsIcon;
