import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { select } from 'd3';
import { nest } from 'd3-collection';

function Pie(props) {
	const pieChart = useRef();
	const [tiphover, setTiphover] = useState();
	const [piedata, setpiedata] = useState([]);
	useEffect(() => {
		setpiedata(props.data);
	}, [props, props.data]);

	useEffect(() => {
		var legendNo = 4; // number of legends to display at a time
		var legendCount = 0;
		var margin = { top: 80, right: 100, bottom: 60, left: 50 },
			width = 1050,
			height = 50;
		// console.log("data", props)
		// const svgRef = useRef();
		// Get positions for each data object
		var pie = d3.pie().value(function (d) {
			return d.sensorValue;
		});
		// const piedata = d3.pie().value(d => d.sensorValue)(props.data)
		// var slices = pie(props.data);
		// console.log("piedata", pie)
		// Define arcs for graphing
		const arc = d3.arc().innerRadius(0).outerRadius(85);
		const arc_modal = d3.arc().innerRadius(0).outerRadius(245);

		// const colors = d3.scaleOrdinal(['#ffa822', '#134e6f', '#ff6150', '#1ac0c6', '#dee0e6'])
		const colors = ({ color_code }) => color_code;
		// var margin = { top: 30, right: 20, bottom: 75, left: 200 };
		const svg = select(pieChart.current).attr(
			'transform',
			'translate(160,120)'
		);

		var total = 0;

		piedata.forEach(function (d) {
			// d.condition;
			total += d.condition;
			legendCount++;
		});

		var defs = svg.append('defs');

		//Filter for the outside glow
		var filter = defs.append('filter').attr('id', 'glow');
		filter
			.append('feGaussianBlur')
			.attr('stdDeviation', '6.5')
			.attr('result', 'coloredBlur');
		var feMerge = filter.append('feMerge');
		feMerge.append('feMergeNode').attr('in', 'coloredBlur');
		feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
		d3.selectAll('.tooltippiechart').style('opacity', 0);

		////////////////////////// tooltip //////////////////////
		var div = d3
			.select('body')
			.append('div')
			.attr('class', 'tooltippiechart')
			.style('opacity', 0);

		var r = 5; // radius of circle
		/////////////////// transition for arc ///////////////////
		var arc2 = d3
			.arc()
			.outerRadius(r + 10)
			.innerRadius(0);

		var normalarc = d3.arc().outerRadius(r).innerRadius(0);
		/////////////////// position for text ////////////////////
		var label = d3
			.arc()
			.outerRadius(r - 45)
			.innerRadius(r);

		// var sumstat = nest()
		// .key((d) => d.condition)
		// .entries(props.data);

		piedata.forEach(function (d, i) {
			const g = svg
				.selectAll('.chartArea')
				.data(pie(piedata))
				.enter()
				.append('g')
				.attr('class', 'arc');

			g.append('path')
				.attr('d', props.chartModalOpen ? arc_modal : arc)
				.style('cursor', 'pointer')
				.attr('stroke', 'white')
				// .attr('id', (d) =>
				//     'tag' + d.data.condition.replace(/\s+/g, '')
				// )

				.style('fill', function (d) {
					return d.data.color_code === null ? 'grey' : d.data.color_code;
				})
				// .attr('fill', ({ color_code }) => color_code === null ? "grey" : color_code)
				.on('mousemove', function (event, d) {
					d3.select(this)
						.transition()
						.duration('50')
						.style('filter', 'url(#glow)');
					div.transition().duration(50).style('opacity', 1);
					div
						.html(
							` <text class="font-weight-bold">  ${
								d.data.condition === null ? 'no condition' : d.data.condition
							}</text><text class="text-dark font-weight-bold"></br>sensor value : ${d.data.sensorValue.toFixed(
								5
							)} </br></br>${d.data.sensorValueAddedTime.substring(0, 3)}
                            .${d.data.sensorValueAddedTime.split('.')[1]}
                           .${d.data.sensorValueAddedTime
															.split(' ')[0]
															.substring(
																d.data.sensorValueAddedTime.split(' ')[0]
																	.length - 4
															)}
                        </br>${
													d.data.sensorValueAddedTime.split(' ')[2]
												}<br/></br></text><text class="text-dark font-weight-bold">
                        ${d.data.component_name}</text>`
						)

						.style(
							'color',
							d.data.color_code === null ? 'grey' : d.data.color_code
						)
						.style('left', event.pageX - -6 + 'px')
						.style('top', event.pageY - 65 + 'px');
				})
				.on('mouseout', function (d, i) {
					d3.select(this)
						.transition()
						.duration('50')

						.style('filter', 'none');

					div.transition().duration('50').style('opacity', 0);
				});

			// g.append('text')
			// 	.attr('text-anchor', 'middle')
			// 	.attr('transform', (d) => {
			// 		if (piedata.length === 1) {
			// 			return 'translate(3,5)';
			// 		} else return 'translate(' + label.centroid(d) + ')';
			// 	})
			// 	.attr('dy', '.35em')
			// 	.attr('fill', 'white')
			// 	.attr('font-size', '10px')
			// 	.text((d) => {
			// 		return d.data.sensorValue.toFixed(2);
			// 	});

			/////////////////////// legend ////////////////////////////
			var legnedwidth = 400;

			var line = 0;
			var col = 0;

			var legendSpace = width / piedata.length;
			var n = piedata.length;
			// console.log("length", n)
			var itemWidth = 70;

			var legendCount = props.data.length;

			// var legendWidth = 10;
			// var legendSpacing = 6;

			// var netLegendHeight = (legendWidth + legendSpacing) * legendCount;
			// console.log("height", netLegendHeight)
			var legendPerPage, totalPages, pageNo;

			// if (piedata.length >= 1) {

			legendPerPage = 4;
			totalPages = Math.ceil(legendCount / legendPerPage);

			pageNo = 1;

			var startIndex = (pageNo - 1) * legendPerPage;

			var endIndex = startIndex + legendPerPage;

			var seriesSubset = [],
				colorSubset = [];

			for (var i = 0; i < props.data.length; i++) {
				if (i >= startIndex && i < endIndex) {
					seriesSubset.push(props.data[i]);
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
					});

				legend
					.append('circle')

					// .attr('cx', (-110))
					.attr('cx', -140)
					.attr('cy', props.chartModalOpen ? 287 : 111.2)

					.attr('r', 4)
					.attr('fill', function (d) {
						return d.color_code === null ? 'grey' : d.color_code;
					});

				legend
					.append('text')
					// .attr("x", (-13))
					.attr('x', -130)
					// .attr("y", 115)
					.attr('y', props.chartModalOpen ? 290 : 115)

					.attr('class', 'text1')
					.attr('font-size', '12px')
					.attr('fill', function (d) {
						return d.condition === null ? 'grey' : 'black';
					})
					.on('mousemove', function (event, d) {
						d3.select(this);
						div.transition().duration(50).style('opacity', 1);

						if (d.condition !== null && d.condition.length > 8) {
							div
								.html(
									` <text class="text-black-50"> 
                            ${d.condition}</text>`
								)
								.style('left', event.pageX - -4 + 'px')
								.style('top', event.pageY - 40 + 'px');
						} else div.transition().duration('50').style('opacity', 0);
					})
					.on('mouseout', function (d, i) {
						d3.select(this);
						div.transition().duration('50').style('opacity', 0);
					})

					// .text(function (d) {
					//     return d.condition === null ? 'no condition' : d.condition;
					// });

					.text(function (d, string) {
						var dots = '...';
						if (d.condition !== null) {
							if (d.condition.length > 8) {
								// you can also use substr instead of substring
								string = d.condition.substring(0, 8) + dots;
							} else return d.condition;
							return string;
						} else return 'nocondi...';
					});
				var startX = 5; // starting width

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
						return props.chartModalOpen
							? 'translate(' + -150 + ',' + 291 + ')'
							: 'translate(' + -150 + ',' + 116 + ')';
					})

					.on('click', prevLegend)
					.style('cursor', 'pointer');

				var nexttriangle = svg
					.select('g.legend')
					.append('g')
					.attr('class', 'next')

					.attr('transform', function (d, i) {
						return props.chartModalOpen
							? 'translate(' + 190 + ',' + 281 + ')'
							: 'translate(' + 190 + ',' + 107 + ')';
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

				// if (pageNo === totalPages) {
				//     nexttriangle.style('opacity', '0.5');
				//     nexttriangle.on('click', '').style('cursor', '');
				// } else if (pageNo === 1) {
				//     prevtriangle.style('opacity', '0.5');
				//     prevtriangle.on('click', 'none').style('cursor', '');

				// }
				// if (totalPages === 1) {
				//     nexttriangle.style('opacity', '0');
				//     prevtriangle.style('opacity', '0');

				// }
				// if (pageNo === 1) {

				//     prevtriangle.on('click', 'none').style('cursor', 'not-allowed');

				// }
				// if (pageNo === totalPages) {

				//     nexttriangle.on('click', 'none').style('cursor', 'not-allowed');

				// }

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
				// if (pageNo === 1) {
				//     // nexttriangle.style('opacity', '0');
				//     prevtriangle.style('opacity', '0');

				// }
			}

			function prevLegend() {
				pageNo--;

				svg.selectAll('g.legend').remove();
				svg.select('.pageNo').remove();
				svg.select('.prev').remove();
				svg.select('.next').remove();

				var startIndex = (pageNo - 1) * legendPerPage;
				var endIndex = startIndex + legendPerPage;

				var seriesSubset = [],
					colorSubset = [];

				for (var i = 0; i < props.data.length; i++) {
					if (i >= startIndex && i < endIndex) {
						seriesSubset.push(props.data[i]);
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

				svg.selectAll('g.legend').remove();
				svg.select('.pageNo').remove();
				svg.select('.prev').remove();
				svg.select('.next').remove();

				var startIndex = (pageNo - 1) * legendPerPage;
				var endIndex = startIndex + legendPerPage;

				var seriesSubset = [],
					colorSubset = [];

				for (var i = 0; i < props.data.length; i++) {
					if (i >= startIndex && i < endIndex) {
						seriesSubset.push(props.data[i]);
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
	}, [piedata, tiphover]);
	// const Mousehovertooltip = () => {
	// 	setTiphover(Math.random());
	// };
	return (
		<React.Fragment>
			<div id="chart" style={{ marginTop: '-.5rem' }}>
				<svg
					ref={pieChart}
					className={
						props.chartModalOpen
							? 'svgimg_container_class_piechart_modal'
							: 'svgimg_container_class_piechart'
					}></svg>
			</div>
		</React.Fragment>
	);
}

export default Pie;
