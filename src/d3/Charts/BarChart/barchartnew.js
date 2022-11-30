import React, { useRef, useEffect, useState } from 'react';
import { select, axisBottom, scaleLinear, scaleBand, axisLeft } from 'd3';
import * as d3 from 'd3';
import ResizeObserver from 'resize-observer-polyfill';
// import { keys } from 'd3-collection';

const useResizeObserver = (ref) => {
	// doing this for resizing
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
function BarChart(props) {
	// console.log("data bar",props.timestamp)
	const svgRef = useRef();
	const wrapperRef = useRef();
	const dimensions = useResizeObserver(wrapperRef);
	const [tiphover, setTiphover] = useState();
	// will be called initially and on every data change
	useEffect(() => {
		const svg = select(svgRef.current);
		if (!dimensions) return;
		const padding = 0.6; // For both scales: xScaleLabels and xScaleBars
		// scales
		// '11/08/2022, 13:17:22'
		const xScaleLabels = scaleBand()
			.domain(props.data.map(({ timestamp }) => timestamp.substring(0, 5)+' ,'+ timestamp.split(' ')[1] ))
			.range([0, dimensions.width])
			.padding(padding);

		var defs = svg.append('defs');

		//Filter for the outside glow
		var filter = defs.append('filter').attr('id', 'glow');
		filter
			.append('feGaussianBlur')
			.attr('stdDeviation', '1')
			.attr('result', 'coloredBlur');
		var feMerge = filter.append('feMerge');
		feMerge.append('feMergeNode').attr('in', 'coloredBlur');
		feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

		// const A = keys(props.data);
		// console.log("dta", A)

		const tickWidth = 45;
		const width = xScaleLabels.range()[1];
		// console.log(width);
		const tickN = Math.floor(width / tickWidth);
		const keepEveryNth = Math.ceil(xScaleLabels.domain().length / tickN);
		const xScaleLabelDomain = xScaleLabels
			.domain()

			.filter((_, i) => i % keepEveryNth === 0);
		xScaleLabels.domain(xScaleLabelDomain);

		const yScale = scaleLinear()
			.domain([
				0,
				1.1 * Math.max(...props.data.map(({ sensorValue }) => sensorValue)),
			]) // Take maximum sensorValue value and add a padding of 10%.
			.range([dimensions.height, 0]); // change
		// create x-axis

		const xAxis = axisBottom(xScaleLabels).ticks(props.data.length);

		svg
			.select('.x-axis')
			.style('transform', `translateY(${dimensions.height}px)`)
			
			.call(xAxis.tickSize(0).tickPadding([17]))
			.selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.50em")
            .attr("transform", "rotate(-30)" );

		// create y-axis

		const yAxis = axisLeft(yScale).tickSize(-dimensions.width);
		svg.select('.y-axis').call(yAxis.ticks(5).tickPadding([12]));

		const xScaleBars = scaleBand()
			.domain(props.data.map(({ timestamp }) => timestamp))
			.range([0, dimensions.width])
			.padding(padding);
		d3.selectAll('.tooltipbarchart').style('opacity', 0);
		// draw the bars

		///////////// tooltip /////////////////////

		// const tooltip = d3
		// 	.select('body')
		// 	.append('div')
		// 	.attr('class', 'tooltipmultichart')// old tooltip
		// 	.style('opacity', 0);

		var div = d3
			.select('body')
			.append('div')
			.attr('class', 'tooltipbarchart')
			.style('opacity', 0);

		svg
			.selectAll('.bar')
			.data(props.data)
			.join('rect')
			.attr('class', 'bar')
			.style('cursor', 'pointer')
			.attr('rx', 2)
			.style('transform', 'scale(1, -1)')
			.attr('x', (_, i) => xScaleBars(xScaleBars.domain()[i]))
			.attr('y', -dimensions.height)
			.attr('width', xScaleBars.bandwidth())

			.on('mousemove', function (event, d) {
				d3.select(this)
					.transition()
					.duration('50')
					.attr('opacity', 0.6)
					.attr('x', (a) => xScaleBars(a.timestamp) - 3)
					.attr('width', xScaleBars.bandwidth() + 6)
					.style('filter', 'url(#glow)');
				// .style("fill-opacity", 6)
				// .attr("r", "6")

				div.transition().duration(50).style('opacity', 1);
				div
					.html(
						`<text class="text-dark font-weight-bold"> Time : ${d.timestamp} </br><text class="text-dark font-weight-bold">${d.sensorName} :  ${d.sensorValue}</text></text>`
					)
					.style('color', d.color_code === null ? 'grey' : d.color_code)
					.style('left', event.pageX - 58 + 'px')
					.style('top', event.pageY - 45 + 'px');
			})
			.on('mouseout', function (d, i) {
				d3.select(this)
					.transition()
					.duration('50')
					// .attr("r", 4)
					.attr('width', xScaleBars.bandwidth())
					.attr('x', (a) => xScaleBars(a.timestamp))
					.style('filter', 'none')
					// .style("fill-opacity", "6")
					.attr('opacity', '1');
				div.transition().duration('50').style('opacity', 0);
			})

			.transition()
			.attr('fill', ({ color_code }) => '#516182')
			.attr(
				'height',
				({ sensorValue }) => dimensions.height - yScale(sensorValue)
			);
	}, [props, dimensions]);
	// const Mousehovertooltip = () => {
	// 	setTiphover(Math.random());
	// };
	return (
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
	);
}
export default BarChart;
