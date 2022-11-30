import React, { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { useWidgetDispatch } from '../../Context/WidgetContext';

import '../../Styles/right_sidebar.css';
let widget_data = [
	{ name: 'Bar chart', icon: 'ri-bar-chart-line', chart: 'ColumnChart' },
	{ name: 'Line chart', icon: 'ri-line-chart-line', chart: 'LineChart' },
	// {
	// 	name: 'Multi axis Line chart',
	// 	icon: 'ri-exchange-funds-fill',
	// 	chart: 'MultiLineChart',
	// },
	// { name: 'Pie chart', icon: 'ri-pie-chart-line', chart: 'PieChart' },
	// { name: 'Gauge Chart', icon: 'ri-dashboard-2-line', chart: 'GaugeChart' },
	{ name: 'Text Chart', icon: 'ri-text', chart: 'GaugeChart' }
];

function Rightbar(props) {
	const dispatch = useWidgetDispatch();
	const [hover_icon, sethover_icon] = useState(null);
	const [openRightBar, setopenRightBar] = useState(false);

	const renderTooltip = (props) => (
		<Tooltip id="toolTipRightBar" {...props}>
			{hover_icon}
		</Tooltip>
	);

	const handleRightBar = () => {
		setopenRightBar(!openRightBar);
	};

	const mouse_enter = (val) => {
		sethover_icon(val);
	};

	return (
		<div>
			<div className="common_widgets_containerCancel" align="center">
				<OverlayTrigger
					placement="left"
					delay={{ show: 100 }}
					overlay={renderTooltip}>
					<i
						className={
							openRightBar === false
								? 'ri-add-line circle-iconCancel'
								: 'ri-close-line circle-iconCancel'
						}
						onMouseEnter={() =>
							mouse_enter(openRightBar === false ? 'Create widget' : 'Close')
						}
						onClick={handleRightBar}></i>
				</OverlayTrigger>
			</div>

			<div
				className={openRightBar === false ? 'hidden' : 'right_sidebar'}
				align="center">
				{widget_data.map((li, index) => (
					<div
						className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 mt-3 common_widgets_container "
						key={index}>
						<OverlayTrigger
							placement="left"
							delay={{ show: 100 }}
							overlay={renderTooltip}>
							<i
								className={li.icon + ' circle-icon ri-lg'}
								onMouseEnter={() => mouse_enter(li.name)}
								onClick={() => {
									props.showWidgetList(li.chart, li.name);
									setopenRightBar(false);
								}}></i>
						</OverlayTrigger>
					</div>
				))}

				{/*<div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-4 common_widgets_container">
					<OverlayTrigger
						placement="left"
						delay={{ show: 100 }}
						overlay={renderTooltip}>
						<i
							className="ri-text icon_widgets"
							onMouseEnter={() => mouse_enter('Text')}></i>
					</OverlayTrigger>
						</div>*/}
			</div>
		</div>
	);
}

export default Rightbar;
