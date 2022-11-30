import React, { useEffect } from 'react';
import { scaleLinear, max, line, select, curveCatmullRom } from 'd3';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { chartDataValue } from '../Charts';
// import chartDataValue from '../BarChart/data'

const scaleTextStyle = {
	class: 'fs1',
	// fontSize: "1.702px",
	fontSize: '1.882px',
};

const amimateLine = (xScale, yScale, currentLine, lineColour, selectedData) => {
	const lineDefinition = line()
		//.curve(curveCardinal)  // LINE CURVE
		.curve(curveCatmullRom.alpha(0.7)) // CURVE LINE

		// .x((_, i) => xScale(i) * 0.1)
		.x((_, i) => xScale(i) * 0.4 + 4)
		// .y(d => yScale(d.sensorValue) * 0.1 );
		.y((d) => yScale(d.sensorValue) * 0.1 + 0.5);

	const newLinePath = lineDefinition(selectedData);

	currentLine
		.transition()
		.duration(650)
		.attr('class', 'lineAnimation')
		.attr('d', newLinePath)
		.attr('stroke', lineColour);
};

const animateDots = (
	xScale,
	yScale,
	dotsContainer,
	dotsColour,
	selectedData,
	colour
) => {
	const dotsCoords = selectedData.map((item, index) => {
		return {
			x: xScale(index) * 0.4 + 4,
			y: yScale(item.sensorValue) * 0.1 + 0.5,
		};
		// { x: xScale(index) * 0.4 + 4, y: yScale(item.sensorValue) * 0.1 }
		// { x: xScale(index) * 0.1, y: yScale(item.sensorValue) * 0.1 }
	});

	const dots = dotsContainer.selectAll('circle');

	const getDotColour = (index) => {
		return selectedData[index].color_code;
	};

	dots.each(function (_, i) {
		select(this)
			// .transition()
			// .duration(650)
			// //.duration(1000)                                                 // DOT ANIMATION OLD
			.attr('class', 'dotAnimation') // DOT ANIMATION NEW
			.attr('cx', dotsCoords[i].x)
			.attr('cy', dotsCoords[i].y)
			.attr('fill', getDotColour(i))
			.attr('stroke', dotsColour)
			.attr('stroke-width', 0.15);
	});
};

const Dots = (props) => {
	const { xScale, yScale, dotsColour, selectedData } = props;
	const dotsRef = React.createRef();

	useEffect(() => {
		const dotsContainer = select(dotsRef.current);
		animateDots(xScale, yScale, dotsContainer, dotsColour, selectedData);
	});

	const dots = selectedData.map((item, index) => (
		<OverlayTrigger
			placement="top"
			delay={{ show: 100 }}
			overlay={(props) => (
				<Tooltip id="button-tooltip" {...props}>
					{selectedData[index].sensorValue} {selectedData[index].condition};{' '}
					{selectedData[index].sensorValueAddedTime}
				</Tooltip>
			)}>
			<circle
				key={index}
				cursor="pointer"
				ref={dotsRef}
				r={0.7}
				cx={20}
				cy={48.5}
				//colour={selectedData[index].color_code}
			/>
		</OverlayTrigger>
	));
	//console.log("Line-Re-Renders")
	return <g ref={dotsRef}>{dots}</g>;
};

const Line = (props) => {
	//console.log(chartDataValue)
	const { xScale, yScale, lineColour, selectedData } = props;
	const lineRef = React.createRef();

	//let lineColor = selectedData.map(item => item.color_code);
	// const sensorValues = chartDataValue.map(item => item.sensorValue);

	useEffect(() => {
		const currentLine = select(lineRef.current);
		amimateLine(xScale, yScale, currentLine, lineColour, selectedData);
	});

	return (
		<g>
			<path
				ref={lineRef}
				//strokeWidth="0.4"
				//strokeWidth="0.1"
				strokeWidth="0.4"
				fill="none"
			/>
		</g>
	);
};

//offset
let positionX = 17;
let positionY = 23.4;

const LineChart = (props) => {
	//console.log("Line Re-renders")

	const selectedData = chartDataValue;

	const { lineColour } = props;

	const margin = { top: 20, right: 10, bottom: 0, left: 50 };

	const width = 500 - margin.left - margin.right;
	const height = 360 - margin.top - margin.bottom; // length of line chart

	const xScale = scaleLinear()
		.domain([0, selectedData.length - 1])
		.range([0, width]);

	const yScale = scaleLinear()
		.domain([0, max(selectedData, (d) => d.sensorValue)])
		.range([height, 0]);

	//console.log(yScale.ticks())

	//labels that will appear under the bars (Oranges, Apples, etc.)
	const categoriesLabel = selectedData.map((datum, index) => (
		<text
			key={index}
			//x={xScale(index) * 0.1 + -1.8} // -1.6?
			// x={xScale(index) * 0.1 + -3.8} // -1.6?
			// x={xScale(index) * 0.403 + -3.8} // -1.6?
			x={xScale(index) * 0.404} // -1.6?
			// x={xScale(index) * 168 + 4.22 / chartDataValue.length} // -1.6?
			y={37.5} // was 15
			//textAnchor="middle"
			// transform="scale(1, -1)"
			// transform="scale(1)"
			style={scaleTextStyle}
			fill="grey">
			{selectedData[index].sensorValueAddedTime.split(' ')[2]}
		</text>
	));

	const ticksValues = yScale.ticks(5);

	return (
		// <svg viewBox="10 22 55 25">
		// <svg viewBox="10 22 55 45">
		<svg
			// preserveAspectRatio="none"
			className="chart_heights svgimg"
			//viewBox="10 21.5 55 41"
			// viewBox="2 21.5 55 44.5"
			viewBox=" 78 21.5 55 44.5">
			{ticksValues.map((tickValue) => (
				<g
				// transform={`translate(${1}, ${29.3}) scale(1, -0.254)`}
				>
					<line
						x1={0}
						y1={yScale(tickValue)}
						x2={width}
						y2={yScale(tickValue)}
						stroke="lightgrey"
						//stroke="rgba(244, 244, 244, 1)"
						strokeWidth={0.7}
						// transform={`translate(${15}, ${24}) scale(0.1101, 0.10)`}
						// transform={`translate(${15}, ${24}) scale(0.419, 0.10)`}
						transform={`translate(${15}, ${24}) scale(0.6, 0.10)`}
					/>

					<text
						x={0}
						y={yScale(tickValue)}
						transform={`translate(${13}, ${24.4}) scale(0.1, 0.1)`}
						fontSize="18px"
						// style={scaleTextStyle}
						textAnchor="middle"
						fill="grey">
						{tickValue}
					</text>
				</g>
			))}

			<g transform={`translate(${positionX}, ${positionY})`}>
				<Line
					xScale={xScale}
					yScale={yScale}
					lineColour={lineColour}
					selectedData={selectedData}
				/>

				<Dots
					xScale={xScale}
					yScale={yScale}
					//dotsColour="black"
					selectedData={selectedData}
				/>
				{/* {chartDataValue.length <= 27 ? categoriesLabel : <></>} */}
				{categoriesLabel}
			</g>
		</svg>
	);
};

export default LineChart;
