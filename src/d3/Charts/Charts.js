import React from 'react';
import LineChart from './LineChart/LineChart';
import BarChart from './BarChart/BarChart';
import PieChart from './PieChart/PieChart';
import GaugeChart from './GaugeChart/GaugeChart';

let chartDataValue;

//const Charts = memo(
function Charts(props) {
	//console.log("Chart Main Re-renders")

	const { chartType, chartData } = props;
	// console.log('Chart values: ', chartData);

	if (chartData !== null && chartType !== null) {
		chartDataValue = chartData;
	}
	// else return (<div> Data or Data Type is not specified</div>)

	if (chartType === 'LineChart' && chartData !== null)
		return (
			<LineChart
				//lineColour='#FA4D56'
				//lineColour='#ACE3E2'
				lineColour="#2B2B2B"
			/>
		);
	else if (chartType === 'ColumnChart' && chartData !== null)
		return <BarChart />;
	else if (chartType === 'PieChart' && chartData !== null)
		return (
			// <svg viewBox="-4 0 100 50">

			<PieChart x={20} y={30} />
		);
	else if (chartType === 'GaugeChart' && chartData !== null)
		return <GaugeChart x={1.25} y={1} />;
}
//);

export { Charts, chartDataValue };
