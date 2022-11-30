import React, { useEffect } from "react";
import { scaleLinear, max, select } from "d3";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { chartDataValue } from "../Charts";
// import chartDataValue from "./data";


const animateRect = (rectRef, height, colour, countTextRef) => {
	// console.log(chartDataValue);

	const rect = select(rectRef.current);
	rect
		.transition()
		.duration(650)
		.attr("height", height + 0.5)
		// .attr("rx", 0.6)								// how much to round corners - to be transitioned below
		// .attr("ry", 0.6)								// how much to  round corners - to be transitioned below

		.attr("rx", 0.4)								// how much to round corners - to be transitioned below
		//.attr("ry", 0.4)								// how much to  round corners - to be transitioned below

		//.attr("width", 3)             //try
		//.attr("width", 22 / chartDataValue.length) ///BACKUP
		//.attr("width", 22 / chartDataValue.length)

		.attr("width", 1)
		//.attr("width", 3 / 4 + 5)
		.attr("fill", colour);

	const text = select(countTextRef.current);
	text
		// .transition()
		// .duration(650)    
		.attr("y", (4 + height) * -1);
};

const barTextStyle = {
	class: 'fs1',
	fontSize: "1.702px",
	//color: "rgba(142, 142, 142, 1)"

	//fontFamily: "Open Sans"
};

const Bar = props => {
	const rectRef = React.createRef();
	const countTextRef = React.createRef();
	const { x, y, height, colour, count, condition_name, sensorValueAddedTime } = props;

	useEffect(() => {
		(animateRect(rectRef, height, colour, countTextRef));
	});

	const renderTooltip = (props) => (
		<Tooltip id="button-tooltip" {...props}>
			<text style={{ class: "fs-1", fontSize: "12px" }}>	{(count)} {condition_name}; {sensorValueAddedTime} </text>
		</Tooltip>
	);


	return (
		<g>
			<OverlayTrigger
				placement="top"
				delay={{ show: 100 }}
				overlay={renderTooltip}>
				{/* <rect x={x + 1} y={y + 3.8} width={22 / chartDataValue.length} ref={rectRef} cursor="pointer" */}
				<rect
					// x={x + 1}
					// x={x + 2.2}
					// x={x + 2.2}
					x={x + 2.2}
					//	width={22 / chartDataValue.length}
					// y={y + 3.8}
					y={y + 3.8}
					width={1}
					ref={rectRef} cursor="pointer" /* animation width of bar */
				/>
			</OverlayTrigger>

		</g>
	);
};

//wrapper function for the bar chart to render bars as ReactJs components
const BarChart = props => {

	//console.log("Bar/Column Re-renders")

	//const { barColour } = props;

	//let width = 80  //LAST 04-03-2021
	// let width = 40.5
	let width = 40.5
	//	let height = 115;    // LAST
	let height = 110;

	const margin = { top: 20, right: 20, bottom: 30, left: 45 };
	const barChartHeight = height - margin.top - margin.bottom;

	const selectedData = chartDataValue

	//labels that will appear under the bars (Oranges, Apples, etc.)
	const categoriesLabel = selectedData.map((_, index) => (
		<text
			//className="float-right"
			key={index}
			//x={((index * 45.2) / chartDataValue.length) + 0.4}
			//x={index * 1 + 2}
			// x={((index * 45.2) / chartDataValue.length) + ((chartDataValue.length / 22)) + ((25 / chartDataValue.length) / (chartDataValue.length * 1))} /// TRY CATA 
			//x={((index * 45.2) / chartDataValue.length) + ((chartDataValue.length / 20)) + ((18.1 / chartDataValue.length) / (chartDataValue.length))} /// TRY CATA 
			//x={((index * 45 / chartDataValue.length) + (9 / chartDataValue.length)) + 11.2 / chartDataValue.length * 1.45 - 7}
			// x={(index + 18.25) / 2}
			// x={(index * 45 + 18.22) / chartDataValue.length}
			// x={(index * 168 + 4.22) / chartDataValue.length}
			// x={(index * 168 + 79) / chartDataValue.length}
			x={chartDataValue.length === 1 ? ((index * 168 + 83) / chartDataValue.length) : ((index * 168 + 79) / chartDataValue.length)}
			// x={(index * 168 + 83) / chartDataValue.length}
			// x={(index * 45 / chartDataValue.length) + (10 / chartDataValue.length) + (8.8 / chartDataValue.length)}   ////////////TRY TO CENTER
			// x={(index * 5.6) + 1.1}   ////////////TRY TO CENTER WITH STATIC
			//x={(index * 10.9) + 1.1}   ////////////TRY TO CENTER WITH STATIC
			y={- 1}
			//textAnchor="middle"
			transform="scale(1, -1)"
			// transform="scale(0, -0)"
			style={barTextStyle}
			fill="grey"
		>
			{/* { chartDataValue[index].sensorValueAddedTime == null ?
				chartDataValue.sensorValue = " " :
				(chartDataValue[index].sensorValueAddedTime).slice(0, 4)} */}
			{
				chartDataValue[index].sensorValueAddedTime == null ?
					chartDataValue.sensorValue = " " :
					chartDataValue[index].sensorValueAddedTime.split(" ")[2]
			}
		</text >
	));


	//d3 function that sizes the bars height according to data range
	let y = scaleLinear()
		.domain([0, max(selectedData, d => d.sensorValue)])
		.range([barChartHeight, 0]);
	//.range([0, barChartHeight]);

	// console.log(y.ticks())    // TICKS ARRAY?

	///////////////////////////////////////////////////////////////////////////////SCALE MOD////////////////////

	// let tickval = y.ticks(5)
	// for (var i = 0; i < tickval.length; i++) {

	// 	if (tickval[i] === 5) {

	// 		tickval.splice(i, 1);
	// 	}

	// }
	// const ticksValues = tickval
	// // const ticksValues = y.ticks()
	// console.log(ticksValues)
	// //ticksValues.

	/////////////////////////////////////////////////////////////////////////////////////////

	const ticksValues = y.ticks(5)

	//creation of bars components
	const bars = selectedData.map((datum, index) => (
		<Bar
			key={index}
			// x={index * 27.8 }
			//x={(index * 45 / chartDataValue.length)}  // PREV
			// x={(index * 45 + 18.22) / chartDataValue.length}
			// x={(index * 168 + 83) / chartDataValue.length}
			x={chartDataValue.length === 1 ? ((index * 168 + 83) / chartDataValue.length) : ((index * 168 + 79) / chartDataValue.length)}
			y={0}
			//width={7.8}
			height={(barChartHeight - y(datum.sensorValue)) / 1.95}
			colour={chartDataValue[index].color_code}
			count={chartDataValue[index].sensorValue}
			condition_name={chartDataValue[index].condition}
			sensorValueAddedTime={chartDataValue[index].sensorValueAddedTime}
		/>
	));


	return (

		//  <svg viewBox="2.5 18 100 50">  {/* 4rd value is 30 for perfect fit 50 for testing* FORMAT: x,y,scale,viewbox-area*/}
		// <svg viewBox="10.5 18 51.5 32">
		// <svg viewBox="10.5 18 51.5 42">
		<svg

			//width="300px" height="200px"
			// preserveAspectRatio="none"
			//className="chart_heights"
			className="chart_heights svgimg"
			//class="flot-overlay"


			//viewBox="10.5 18 53.5 37.5" /// PROPER
			// viewBox="10.5 18 53.5 40.5" /// PROPER
			viewBox="71 18 53.5 40.5" /// PROPER
		//viewBox="10.5 18 100 37.5" // FULLSIZE

		>
			{/* {y.ticks().map(tickValue => ( */}
			{ticksValues.map(tickValue => (
				<g
				// transform={`translate(${1}, ${29.3}) scale(1, -0.254)`} 
				>
					<line x1={0} y1={y(tickValue) * 2.05} x2={width} y2={y(tickValue) * 2.05}
						//stroke="lightgrey"
						stroke="#DDDDDD"
						strokeWidth={0.3}
						//transform={`translate(${15}, ${20.1}) scale(1, 0.254)`}  //previous backup 05-03-2021
						// transform={`translate(${15}, ${20.1}) scale(1.17, 0.254)`}
						// transform={`translate(${15}, ${20.1}) scale(4.15, 0.254)`}
						transform={`translate(${15}, ${20.1}) scale(4.7, 0.254)`}
					/>

					<text y={y(tickValue) * 5.2}
						transform={`translate(${13.4}, ${20.6}) scale(0.1, 0.1)`}
						textAnchor="middle"
						fill="grey"
						className="chart_text_scale"
					>
						{tickValue}</text>
				</g>
			))}
			<g
				// transform={`translate(${15}, ${57.8}) scale(1, -1)`}
				transform={`translate(${15.2}, ${55.2}) scale(1, -1)`}
			>        {/*offset*/}



				{/* {groupsLabel} */}
				{bars}
				{/* {chartDataValue.length <= 27 ? categoriesLabel : <></>} */}
				{categoriesLabel}

				{/* <line id="visualisation"></line> */}
			</g>
		</svg>
	);
};

export default BarChart;