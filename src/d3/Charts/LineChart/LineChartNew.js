import React, { useRef, useEffect, useState } from 'react';
import {
	select,
	scaleLinear,
	line,
	max,
	curveCardinal,
	axisBottom,
	axisLeft,
	scaleBand,
	scaleTime,
	brushX,
} from 'd3';
import * as d3 from 'd3';
// import UseResizeObserver from "./UseResizeObserver";
// import usePrevious from "./usePrevious";

/**
 * Component that renders a LineChartNew
 */
const UseResizeObserver = (ref) => {
	const [dimensions, setDimensions] = useState(null);

	useEffect(() => {
		const observeTarget = ref.current;
		const resizeObserver = new ResizeObserver((entries) => {
			entries.forEach((entry) => {
				setDimensions(entry.contentRect);
			});
		});
		resizeObserver.observe(observeTarget);
		return () => {
			resizeObserver.unobserve(observeTarget);
		};
	}, [ref]);
	return dimensions;
};

function LineChartNew(props) {
	// console.log("line data",props.data);
	const svgRef = useRef();
	const wrapperRef = useRef();
	const dimensions = UseResizeObserver(wrapperRef);
	const [selection, setSelection] = useState([0, 1.5]);
	const [tiphover, setTiphover] = useState();

	// const previousSelection = usePrevious(selection);

	// will be called initially and on every data change

	useEffect(() => {
		const svg = select(svgRef.current);
		if (!dimensions) return;
		const padding = 0.8;
		const { height } = dimensions || wrapperRef.current.getBoundingClientRect();

		const xScale = scaleBand()
			// .domain(props.data.map(({ timestamp }) => timestamp.split(' ')[1]))
			.domain(props.data.map(({ timestamp }) => timestamp.substring(0, 5)+' ,'+ timestamp.split(' ')[1] ))
			.range([0, dimensions.width])
			.padding(padding);

		const tickWidth = 45;
		const width = xScale.range()[1];
		const tickN = Math.floor(width / tickWidth);
		const keepEveryNth = Math.ceil(xScale.domain().length / tickN);
		const xScaleLabelDomain = xScale
			.domain()

			.filter((_, i) => i % keepEveryNth === 0);
		xScale.domain(xScaleLabelDomain);
		d3.selectAll('.tooltiplinechart').style('opacity', 0);

		const yScale = scaleLinear()
			.domain([
				0,
				1.1 * Math.max(...props.data.map(({ sensorValue }) => sensorValue)),
			])
			.range([height, 0]);

		const xScaleLines = scaleBand()
			.domain(props.data.map(({ timestamp }) => timestamp))
			.range([0, dimensions.width])
			.padding(padding);

		const lineGenerator = line() // create line
			.x((d, index) => xScaleLines(xScaleLines.domain()[index]))
			.y((d) => yScale(d.sensorValue));
		svg
			.selectAll('.myLine')
			.data([props.data])
			.join('path')
			// .attr('class', 'lineAnimation')
			// .transition()
			// .duration(650)
			.attr('class', 'myLine')
			.attr('stroke', 'black')
			.attr('stroke-width', 1.1)
			.attr('fill', 'none')
			.attr('d', lineGenerator);

		// const tooltip = d3
		// 	.select('body')
		// 	.append('div')
		// 	.attr('class', 'tooltipmultichart')
		// 	.style('opacity', 0);

		var div = d3
			.select('body')
			.append('div')
			.attr('class', 'tooltiplinechart')
			.style('opacity', 0);

		svg
			.selectAll('.myDot')
			.data(props.data)
			.join('circle')
			.style('cursor', 'pointer')
			.attr('class', 'myDot')
			.attr('stroke', ({ color_code }) =>
				color_code === null ? 'grey' : '#516182'
			)
			.attr('stroke-width', 1)
			// .attr('fill', ({ color_code }) => color_code)
			.attr('fill', ({ color_code }) =>
				color_code === null ? 'grey' : '#516182'
			)
			.attr('r', 4)
			// .attr('r', (
			// 	value,
			// 	index // dispaly the points
			// ) => (index >= selection[0] && index <= selection[1] ? 3 : 3))

			.on('mousemove', function (event, d) {
				d3.select(this)
					.transition()
					.duration('50')
					// .style("filter", "url(#glow)")
					.style('fill-opacity', 0.6)
					.attr('r', '6');
				div.transition().duration(50).style('opacity', 1);
				div
					.html(
						`<text class="text-dark font-weight-bold"> Time : ${d.timestamp} </br><text class="text-dark font-weight-bold">${d.sensorName} :  ${d.sensorValue}</text></text>`
					)
					.style('color', d.color_code === null ? 'grey' : d.color_code)
					.style('left', event.pageX - 45 + 'px')
					.style('top', event.pageY - 35 + 'px');
			})
			.on('mouseout', function (d, i) {
				d3.select(this)
					.transition()
					.duration('50')
					.attr('r', 4)
					// .style("filter", "none")

					.style('fill-opacity', '6')
					.attr('opacity', '1');
				div.transition().duration('50').style('opacity', 0);
			})

			.attr('cx', (_, i) => xScaleLines(xScaleLines.domain()[i]))
			.attr('width', xScaleLines.bandwidth())
			.attr('cy', (d) => yScale(d.sensorValue));
		// .attr('cy', height);

		// axes
		const xAxis = axisBottom(xScale);
		svg
			.select('.x-axis')
			.attr('transform', `translate(0, ${height})`)
			.call(xAxis.tickSize(0).tickPadding([17]))
			.selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.50em")
            .attr("transform", "rotate(-30)" );

		const yAxis = axisLeft(yScale).tickSize(-width);
		svg.select('.y-axis').call(yAxis.ticks(5).tickPadding([12]));
	}, [props, dimensions, selection]);

	return (
		<React.Fragment>
			<div ref={wrapperRef} style={{ marginLeft: '1rem' }}>
				<svg
					ref={svgRef}
					className={
						props.chartModalOpen
							? 'svgimg_container_class_bar_modal'
							: 'svgimg_container_class_bar'
					}>
					<g className="x-axis" />
					<g className="y-axis" />
				</svg>
			</div>
		</React.Fragment>
	);
}

export default LineChartNew;
