import React, { useRef, useEffect, useState } from 'react';
import { select, axisBottom, axisRight, scaleLinear, scaleBand } from 'd3';
import ResizeObserver from 'resize-observer-polyfill';

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

function TestBar({ data }) {
	//console.log(JSON.stringify(data));

	const svgRef = useRef();
	const wrapperRef = useRef();
	const dimensions = useResizeObserver(wrapperRef);

	// will be called initially and on every data change
	useEffect(() => {
		const svg = select(svgRef.current);

		if (!dimensions) return;
		const padding = 0.8; // For both scales: xScaleLabels and xScaleBars

		// scales
		const xScaleLabels = scaleBand()
			.domain(data.map(({ sensorValueAddedTime }) => sensorValueAddedTime))
			.range([0, dimensions.width]) // change
			.padding(padding);

		const tickWidth = 40;
		const width = xScaleLabels.range()[1];
		const tickN = Math.floor(width / tickWidth);
		const keepEveryNth = Math.ceil(xScaleLabels.domain().length / tickN);

		const xScaleLabelDomain = xScaleLabels
			.domain()
			.filter((_, i) => i % keepEveryNth === 0);
		xScaleLabels.domain(xScaleLabelDomain);

		const yScale = scaleLinear()
			.domain([
				0,
				1.1 * Math.max(...data.map(({ sensorValue }) => sensorValue)),
			]) // Take maximum sensorValue value and add a padding of 10%.
			.range([dimensions.height, 0]); // change

		// create x-axis

		const xAxis = axisBottom(xScaleLabels).ticks(data.length);

		svg
			.select('.x-axis')
			.style('transform', `translateY(${dimensions.height}px)`)
			.call(xAxis);

		// create y-axis
		const yAxis = axisRight(yScale);
		svg
			.select('.y-axis')
			.style('transform', `translateX(${dimensions.width}px)`)
			.call(yAxis);

		// const diplayData = data.filter(({ sensorValueAddedTime }) => {
		//   return xScaleLabelDomain.includes(sensorValueAddedTime);
		// });

		const xScaleBars = scaleBand()
			.domain(data.map(({ sensorValueAddedTime }) => sensorValueAddedTime))
			.range([0, dimensions.width]) // change
			.padding(padding);

		// draw the bars
		svg
			.selectAll('.bar')
			.data(data)
			.join('rect')
			.attr('class', 'bar')
			.style('transform', 'scale(1, -1)')
			.attr('x', (_, i) => xScaleBars(xScaleBars.domain()[i]))
			.attr('y', -dimensions.height)
			.attr('width', xScaleBars.bandwidth())

			.transition()
			.attr('fill', '#015e89')
			.attr(
				'height',
				({ sensorValue }) => dimensions.height - yScale(sensorValue)
			);
	}, [data, dimensions]);

	return (
		<div ref={wrapperRef} style={{ marginBottom: '2rem' }}>
			<svg ref={svgRef}>
				<g className="x-axis" />
				<g className="y-axis" />
			</svg>
		</div>
	);
}

export default TestBar;
