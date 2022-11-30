import React from 'react';
import { arc, scaleLinear, format } from 'd3';
import { chartDataValue } from '../ChartContainer';

export const GaugeChart = ({ x, y, min = 0, max = 100 }) => {
	// const sliceRef = React.createRef();

	//console.log("Gauge Re-renders")

	const selectedData = chartDataValue;

	// const maxval = selectedData.reduce((prev, current) => (prev.sensorValue > current.sensorValue) ? prev : current)
	// // console.log(Math.round(maxval.sensorValue))
	// //let value = (Math.round(maxval.sensorValue)) // to round the value
	// let value = ((maxval.sensorValue))

	const value = selectedData[selectedData.length - 1].sensorValue;
	// //////////////////////////////////////////////////////////////////////////////////////////////

	const percentScale = scaleLinear().domain([min, max]).range([0, 1]);
	const percent = percentScale(value);
	const angleScale = scaleLinear()
		.domain([0, 1])
		.range([-Math.PI / 1.3, Math.PI / 1.3])
		.clamp(true);
	const angle = angleScale(percent);

	const backgroundArc = arc()
		.innerRadius(0.8)
		.outerRadius(0.85)
		.startAngle(-Math.PI / 1.3) // default start point  /2
		.endAngle(Math.PI / 1.3) // extend
		.cornerRadius(1)();

	// backgroundArc
	//   .style("stroke-dasharray", "10 5")
	//const el = select(sliceRef.current);

	const filledArc = arc()
		.innerRadius(0.75)
		.outerRadius(0.88)
		.startAngle(-Math.PI / 1.3) // default start point  /2
		.endAngle(angle)
		.cornerRadius(1)();

	// el.select("path")
	//   .transition()
	//   .duration(1700)
	//   .attr("d", filledArc);

	const colorScale = scaleLinear().domain([0, 1]).range(['#4589FF', '#FA4D56']); // color of the arc
	const gradientSteps = colorScale.ticks(10).map((value) => colorScale(value));

	////////////////////////////////////////////////////
	// let conval = selectedData.find(x => x.sensorValue = value).condition;
	let conval = selectedData[selectedData.length - 1].condition;
	// console.log(conval)
	///////////////////////

	return (
		<svg
			//preserveAspectRatio="none"
			// className="chart_heights svgimg"
			//className="gauge_mid"
			//width="9em"

			// viewBox="-1.25, -1.2, 2.5, 2"
			viewBox="0, 0, 2.8, 2.25"
			style={{ textAlign: 'center' }}
			// height='800' width='400' // Size adjust

			width="100%"
			height="100%">
			<g
				// preserveAspectRatio="none"
				transform={`translate(${x}, ${y})`}

				// width="auto"
				// height="auto"
			>
				<defs>
					<linearGradient
						id="Gauge__gradient"
						gradientUnits="userSpaceOnUse"
						x1="-1"
						x2="1"
						y2="0">
						{gradientSteps.map((color, index) => (
							<stop
								key={color}
								stopColor={color}
								offset={`${index / (gradientSteps.length - 1)}`}
							/>
						))}
					</linearGradient>
				</defs>

				{/* <path
        d={backgroundArc}
        fill="#E8E8E8"
      //fill="#e3f6f5"
      />

      <clipPath id="clippys">
        <path
          d={filledArc}
          fill="url(#Gauge__gradient)"
        //fill="#e3f6f5"
        />
      </clipPath>


      <path clip-path="url(#clippys)"
        class="gaugeEntryAnimation"
        d={filledArc}
        stroke="url(#Gauge__gradient)" stroke-miterlimit="45" stroke-width="78"
      /> */}

				<path
					d={backgroundArc}
					fill="#E8E8E8"
					//fill="#e3f6f5"
				/>

				<path
					class="gaugeAnim"
					//class="pieEntryAnimation"
					d={filledArc}
					//fill="url(#Gauge__gradient)"
					fill="#516182"
				/>

				<g>
					<text
						style={{
							class: 'fs1',
							fontSize: '0.25px',
							textAnchor: 'middle',
							fill: '#516182',
						}}
						y={-0.1}>
						{format(',')(percent * 100)}
					</text>

					<text
						style={{
							class: 'fs1',
							fontSize: '0.14px',
							textAnchor: 'middle',
							fill: selectedData[selectedData.length - 1].color_code,
							//fontStyle: { color: (selectedData[selectedData.length - 1]).color_code }
						}}
						y={0.1}>
						{selectedData[selectedData.length - 1].color_code}
					</text>
				</g>
				{/* /////////////////////////GROUP-G-SCALE///////////////////// */}
				{/* <g>
        <text
          style={{
            fontSize: "0.14px",
            textAnchor: "middle",
          }}
          x={-0.45}
          y={0.75}

        >
          0
        </text>

        {(percent * 100) < 100 ?
          <text
            style={{
              fontSize: "0.14px",
              textAnchor: "middle",
            }}
            x={0.35}
            y={0.75}
          >
            100
        </text>
          : <text
            style={{
              fontSize: "0.14px",
              textAnchor: "middle",
            }}
            x={0.35}
            y={0.75}
          >
            {format(",")(Math.round((percent) * 100))}
          </text>}
      </g> */}
				{/* /////////////////////////GROUP-G-SCALE///////////////////// */}
			</g>
		</svg>
	);
};
// const getCoordsOnArc = (angle, offset = 10) => [
//   Math.cos(angle - (Math.PI / 2)) * offset,
//   Math.sin(angle - (Math.PI / 2)) * offset,
// ]

export default GaugeChart;
