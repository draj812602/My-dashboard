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
	sum,
} from 'd3';
import * as d3 from 'd3';
import { nest } from 'd3-collection';
/**
 * Component that renders a LineChartNew
 */
const useResizeObserver = (ref) => {
	const [dimensions, setDimensions] = useState(null);
	// console.log(dimensions);
	useEffect(() => {
		const observeTarget = ref.current;

		const resizeObserver = new ResizeObserver((entries) => {
			// console.log("entries", entries)
			entries.forEach((entry) => {
				setDimensions(entry.contentRect);

				// console.log('width', entry.contentRect.width);
				// console.log('height', entry.contentRect.height);
			});
		});
		// console.log("observe", resizeObserver)
		resizeObserver.observe(observeTarget);
		return () => {
			resizeObserver.unobserve(observeTarget);
		};
	}, [ref]);
	return dimensions;

};


function Multilinechart(props) {
	// console.log('data', chartModalOpen)
	const svgRef = useRef();
	const wrapperRef = useRef();
	// console.log("wrapper", wrapperRef)
	const dimensions = useResizeObserver(wrapperRef);
	// console.log(dimensions)
	const [tiphover, setTiphover] = useState();
	const [selection, setSelection] = useState([0, 1.5]);
	// const previousSelection = usePrevious(selection);
	// will be called initially and on every data change
	useEffect(() => {
		const svg = select(svgRef.current)
		if (!dimensions) return;
		const padding = 0.8;

		let colorline = props.multilinecolor.map((li) => li.comp_color_code);
		// let colorline = ["red", "green", "pink"];
		// console.log('colr', colorline);
		var lineStroke = '1.1px';
		const { height } = dimensions || wrapperRef.current.getBoundingClientRect();
		//Container for the gradients
		var defs = svg.append('defs');
		//Filter for the outside glow
		var filter = defs.append('filter').attr('id', 'glow');
		filter
			.append('feGaussianBlur')
			.attr('stdDeviation', '3.5')
			.attr('result', 'coloredBlur');
		var feMerge = filter.append('feMerge');
		feMerge.append('feMergeNode').attr('in', 'coloredBlur');
		feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
		props.data.sort(function compare(a, b) {
			var dateA = new Date(a.sensorValueAddedTime);
			var dateB = new Date(b.sensorValueAddedTime);
			return dateA - dateB;
		});
		const xScale = scaleBand()
			.domain(
				props.data.map(
					({ sensorValueAddedTime }) => sensorValueAddedTime.split(' ')[2]
				)
			)
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
		const yScale = scaleLinear()
			.domain([
				0,
				1.1 * Math.max(...props.data.map(({ sensorValue }) => sensorValue)),
			])
			.range([dimensions.height, 0]);
		const xScaleLines = scaleBand()
			.domain(
				props.data.map(
					({ sensorValueAddedTime }) => sensorValueAddedTime.split(' ')[2]
				)
			)
			.range([0, dimensions.width])
			.padding(padding);
		// d3.selectAll('.tooltipmultichart').remove();
		d3.selectAll('.tooltipmultichart').style('opacity', 0);
		const xAxis = axisBottom(xScale);
		svg
			.select('.x-axis')
			.attr('transform', `translate(0, ${dimensions.height})`)

			.call(xAxis.tickSize(0).tickPadding([12]));
		const yAxis = axisLeft(yScale).tickSize(-width);
		svg.select('.y-axis')

			.call(yAxis.ticks(5).tickPadding([12]));
		var sumstat = nest()
			.key((d) => d.component_name)
			.entries(props.data);
		var margin = { top: 30, right: 20, bottom: 75, left: 200 };
		// console.log("data", sumstat)
		const colors = d3.scaleOrdinal(colorline);
		const legendSpace = 100;
		// const tooltip = d3
		//  .select('body')
		//  .append('div')
		//  .attr('class', 'tooltipmultichart ')
		//  .style('opacity', 0);
		var div = d3
			.select('body')
			.append('div')
			.attr('class', 'tooltipmultichart')
			.style('opacity', 0);
		////////////////////////////////////////////////////////
		sumstat.forEach(function (d, i) {
			svg
				.selectAll('.myLine')
				.data(sumstat)
				.join('path')
				.attr('class', 'myLine')
				.attr('id', (d) => 'tag' + d.key.replace(/\s+/g, ''))
				.attr('stroke', colors)
				// .attr('stroke', ({ comp_color_code })
				// .attr('stroke', ({ comp_color_code }) =>
				//  comp_color_code === null ? 'grey' : comp_color_code
				// )
				.attr('stroke-width', 1.1)
				.attr('fill', 'none')
				.attr('d', function (d) {
					return (
						d3
							.line()
							// .x((d, index) => xScaleLines(xScaleLines.domain()[index]))
							.x((d) => xScaleLines(d.sensorValueAddedTime.split(' ')[2]))
							.y((d) => yScale(d.sensorValue))(d.values)
					);
				})
				.on('mousemove', function (e) {
					d3.select(this)
						.style('filter', 'url(#glow)')
						.style('cursor', 'pointer');
					// const legend = d3.select(this.parentNode)
					//     .select(".legend");
					// legend
					//     .transition()
					//     .delay("100")
					//     .duration("10")
					//     .style("fill", "red")
					// .style("box-shadow", lineshadowhover)
				})
				.on('mouseout', function () {
					// d3.selectAll(".line1").style("opacity", lineOpacity);
					d3.select(this)
						.style('stroke-width', lineStroke)
						.style('filter', 'none')
						.style('cursor', 'none');
					// const legend = d3.select(this.parentNode)
					//     .select(".legend");
					// legend
					//     .transition()
					//     .delay("100")
					//     .duration("10")
					//     .style("fill", "black")
					//     ;
				});
			svg
				.selectAll('.myDot')
				.data(props.data)
				.join('circle')
				.style('cursor', 'pointer')
				.attr('class', 'myDot')
				// .style("filter", "url(#glow)")
				.attr('stroke', ({ color_code }) =>
					color_code === null ? 'grey' : color_code
				)
				.attr('stroke-width', 1)
				.attr('fill', ({ color_code }) =>
					color_code === null ? 'grey' : color_code
				)
				// d.color===null?defsult color:"color
				.attr('r', 4)
				// .attr('r', (
				//     value,
				//     index // dispaly the points
				// ) => (index >= selection[0] && index <= selection[1] ? 4 : 4))
				.on('mousemove', function (event, d) {
					d3.select(this)
						.transition()
						.duration('50')
						// .style("filter", "url(#glow)")
						.style('fill-opacity', 0.6)
						// var x = d3.select(this)[0];
						// console.log('mousemove', d3.pointer(this));
						// hoverLine.attr("x1", x).attr("x2", x).style("opacity", 1)
						.attr('r', '6');
					div.transition().duration(50).style('opacity', 1);
					div
						.html(
							` <text class="font-weight-bold">   ${d.condition === null ? 'no condition' : d.condition
							}</text><text class="text-dark font-weight-bold"></br>sensor value : ${d.sensorValue.toFixed(
								5
							)} </br></br>${d.sensorValueAddedTime.substring(0, 3)}
                            .${d.sensorValueAddedTime.split('.')[1]}
                           .${d.sensorValueAddedTime
								.split(' ')[0]
								.substring(
									d.sensorValueAddedTime.split(' ')[0].length - 4
								)}
                        </br>${d.sensorValueAddedTime.split(' ')[2]
							}<br/></br></text><text class="text-dark font-weight-bold">
                        ${d.component_name}</text>`
						)
						.style('color', d.color_code === null ? 'grey' : d.color_code)
						.style('left', event.pageX - -6 + 'px')
						.style('top', event.pageY - 65 + 'px');
				})
				.on('mouseout', function (d, i) {
					d3.select(this)
						.transition()
						.duration('50')
						.attr('r', 4)
						// .style("filter", "none")
						.style('fill-opacity', '6')
						// hoverLine.style("opacity", 1e-6)
						.attr('opacity', '1');
					div.transition().duration('50').style('opacity', 0);
				})
				.attr('width', xScaleLines.bandwidth())
				.attr('cx', (d) => xScaleLines(d.sensorValueAddedTime.split(' ')[2]))
				.attr('cy', (d) => yScale(d.sensorValue));


			///////////////////////////////////////////////////////////////////////////////////////////////////
			var n = sumstat.length;
			// console.log("length", n)
			var itemWidth = 70;
			var legendCount = n;
			var legendWidth = 10;
			var legendSpacing = 6;
			var netLegendHeight = (legendWidth + legendSpacing) * legendCount;
			var legendPerPage, totalPages, pageNo;
			// if (piedata.length >= 1) {
			legendPerPage = 4;
			totalPages = Math.ceil(legendCount / legendPerPage);
			pageNo = 1;
			var startIndex = (pageNo - 1) * legendPerPage;
			var endIndex = startIndex + legendPerPage;
			var seriesSubset = [],
				colorSubset = [];
			for (var i = 0; i < sumstat.length; i++) {
				if (i >= startIndex && i < endIndex) {
					seriesSubset.push(sumstat[i]);
					colorSubset.push(colors[i]);
				}
			}
			DrawLegendSubset(
				seriesSubset,
				colorSubset,
				legendPerPage,
				pageNo,
				totalPages
			);
			// }
			function DrawLegendSubset(
				seriesSubset,
				colorSubset,
				legendPerPage,
				pageNo,
				totalPages
			) {
				var legend = svg
					.selectAll('g.legend')
					.data(seriesSubset)
					.enter()
					.append('g')
					.attr('class', 'legend')
					// .attr('transform', function (d, i) {
					//     if (piedata.length === 1) {
					//         return 'translate(-10,0)';
					//     } else return 'translate(' + (i % n) * itemWidth + ',' + Math.floor(i / n) * 50 + ')';
					// })
					.attr('transform', function (d, i) {
						return (
							'translate(' + (i % n) * 80 + ',' + Math.floor(i / n) * 50 + ')'
						);
					})
					.style('cursor', 'pointer')
					.on('click', function (event, d) {
						var active = d.active ? false : true,
							circleRadiusHover = active ? 'none' : 'url(#glow)';
						// var circleRadius = active ? "8px" : "15px";
						d3.select(this)
							.transition()
							.duration('50')
							.style('filter', circleRadiusHover);
					});
				var startX = 5; // starting width
				legend
					.append('circle')
					.attr('cx', -1)
					.attr('cy', props.chartModalOpen ? 578 : 225)
					.attr('r', 4)
					.attr('class', 'test1')
					.attr('fill', colors);
				legend
					.append('text')
					.attr('x', 9)
					// .attr("y", 115)
					.attr('y', props.chartModalOpen ? 582 : 229)
					.attr('class', 'text1')
					.attr('font-size', '12px')
					.on('mousemove', function (event, d) {
						d3.select(this);
						div.transition().duration(50).style('opacity', 1);
						if (d.key.length > 8) {
							div
								.html(
									` <text class="text-black-50"> 
                            ${d.key}</text>`
								)
								.style('left', event.pageX - -4 + 'px')
								.style('top', event.pageY - 40 + 'px');
						} else div.transition().duration('50').style('opacity', 0);
					})
					.on('mouseout', function (d, i) {
						d3.select(this);
						div.transition().duration('50').style('opacity', 0);
					})
					.on('click', function (e, d) {
						// Determine if current line is visible
						var active = d.active ? false : true,
							newOpacity = active ? '4px' : '1.1px';
						// Hide or show the elements based on the ID
						svg
							.select('#tag' + d.key.replace(/\s+/g, ''))
							.transition()
							.duration(100)
							.style('stroke-width', newOpacity);
						var active = d.active ? false : true,
							legendweight = active ? '500' : '500';
						// var circleRadius = active ? "10" : "10";
						var legendsize = active ? '14px' : '12px';
						var legendcolor = active ? 'black' : 'black';
						// var circleRadiusHover = active ? "8px" : "5px";
						// Hide or show the elements based on the ID
						d3.select(this)
							.transition()
							.duration(100)
							.attr('font-weight', legendweight)
							.attr('font-size', legendsize)
							.attr('fill', legendcolor)
							.transition()
							.duration(100);
						// Update whether or not the elements are active
						d.active = active;
					})
					// .text(function (d) {
					//  return d.key;
					// });
					.text(function (d, string) {
						var dots = '...';
						if (d.key.length > 8) {
							// you can also use substr instead of substring
							string = d.key.substring(0, 8) + dots;
						} else return d.key;
						return string;
					});
				legend.each(function (d, i, arr) {
					var wrapper = d3.select(this);
					var text = wrapper.select('text');
					var bbox = text.node().getBBox();
					wrapper.attr('transform', 'translate(' + startX + ')');
					startX += bbox.width + 23;
					//  width adjusting
					// console.log("test", text)
				});
				var prevtriangle = svg
					.select('g.legend')
					.append('g')
					// .attr('class', 'prev')
					.attr('class', 'prev')
					.attr('transform', function (d, i) {
						return 'translate(' + -8 + ',' + 230 + ')';
					})
					.on('click', prevLegend)
					.style('cursor', 'pointer');
				var nexttriangle = svg
					.select('g.legend')
					.append('g')
					.attr('class', 'next')
					.attr('transform', function (d, i) {
						return 'translate(' + 330 + ',' + 220 + ')';
					})
					.on('click', nextLegend)
					.style('cursor', 'pointer');
				nexttriangle
					.append('polygon')
					.style('stroke', '#000')
					.style('fill', '#000')
					.attr('points', '10,0, 10,10, 15,5');
				prevtriangle
					.append('polygon')
					.style('stroke', '#000')
					.style('fill', '#000')
					.attr('points', '-10,0, -10,-10, -15,-5');
				if (pageNo == totalPages) {
					nexttriangle.style('opacity', '0');
					nexttriangle.on('click', '').style('cursor', '');
				} else if (pageNo == 1) {
					prevtriangle.style('opacity', '0');
					prevtriangle.on('click', '').style('cursor', '');
				}
				if (totalPages == 1) {
					nexttriangle.style('opacity', '0');
					prevtriangle.style('opacity', '0');
				}
			}
			function prevLegend() {
				pageNo--;
				// console.log("previous")
				svg.selectAll('g.legend').remove();
				svg.select('.pageNo').remove();
				svg.select('.prev').remove();
				svg.select('.next').remove();
				var startIndex = (pageNo - 1) * legendPerPage;
				var endIndex = startIndex + legendPerPage;
				var seriesSubset = [],
					colorSubset = [];
				for (var i = 0; i < sumstat.length; i++) {
					if (i >= startIndex && i < endIndex) {
						seriesSubset.push(sumstat[i]);
						colorSubset.push(colors[i]);
					}
				}
				DrawLegendSubset(
					seriesSubset,
					colorSubset,
					legendPerPage,
					pageNo,
					totalPages
				);
			}
			function nextLegend() {
				pageNo++;
				// console.log("next")
				svg.selectAll('g.legend').remove();
				svg.select('.pageNo').remove();
				svg.select('.prev').remove();
				svg.select('.next').remove();
				var startIndex = (pageNo - 1) * legendPerPage;
				var endIndex = startIndex + legendPerPage;
				var seriesSubset = [],
					colorSubset = [];
				for (var i = 0; i < sumstat.length; i++) {
					if (i >= startIndex && i < endIndex) {
						seriesSubset.push(sumstat[i]);
						colorSubset.push(colors[i]);
					}
				}
				DrawLegendSubset(
					seriesSubset,
					colorSubset,
					legendPerPage,
					pageNo,
					totalPages
				);
			}
		});
	}, [props, dimensions, selection]);
	// const Mousehovertooltip = () => {
	//  setTiphover(Math.random());
	// };
	return (
		<React.Fragment>
			<div ref={wrapperRef} style={{ marginLeft: '1rem' }}>
				<svg
					ref={svgRef} className={props.chartModalOpen ? "svgimg_container_class_multiline_modal" : "svgimg_container_class_multiline"}>
					<g className="x-axis" />
					<g className="y-axis" />
				</svg>
				{/* <div id="legend"></div> */}
			</div>
		</React.Fragment>
	);
}
export default Multilinechart;
