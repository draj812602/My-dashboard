import React from 'react';
import { pie } from 'd3-shape';
import { chartDataValue } from '../Charts';
import PieSliceComponent from './PieSliceComponent';


const PieChart = (props) => {

	//console.log("Pie Main Re-renders")

	const selectedData = chartDataValue

	const { x, y } = props;

	//wrapper function for the pie chart to render slices as ReactJs components
	const renderSlice = (sensorValue) => {
		const index = sensorValue.index;
		return (
			<PieSliceComponent
				key={index}
				index={index}
				value={sensorValue}
				label={selectedData[index].sensorValue}
				sensorCondition={selectedData[index].condition}
				sensorTime={selectedData[index].sensorValueAddedTime}
				fill={selectedData[index].color_code}
			/>
		);
	};

	//creation of the pie
	let pieChart = pie().sort(null);

	//creation of the data array from data
	const sensorValues = selectedData.map((item) => item.sensorValue);

	return (
		<svg
			//preserveAspectRatio="none"
			className="chart_heights svgimg"
			viewBox="2 13 45 37">
			<g transform={`translate(${x}, ${y})`}>
				{pieChart(sensorValues).map(renderSlice)}
			</g>
		</svg>
	);
};

export default PieChart;