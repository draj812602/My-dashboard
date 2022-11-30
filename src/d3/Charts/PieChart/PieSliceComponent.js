import React, { useState, useEffect } from 'react';
import { arc } from 'd3-shape';
import { select } from 'd3';
//import { chartDataValue } from '../Charts';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';


//console.log("Pie Slice Re-renders")


const animateSlice = (sliceRef, slice, innerRadius, outerRadius) => {
	const el = select(sliceRef.current);
	const arcFinal3 = arc()
		.innerRadius(innerRadius)
		.outerRadius(outerRadius)
		.startAngle(slice.startAngle)
		.endAngle(slice.endAngle);
	el.select("path")
		// .style("stroke", "white")
		// .style("stroke-width", 7.5)
		.transition()
		.duration(700)
		.attr("d", arcFinal3);
};

const sliceTextStyle = {
	class: "fs-1",
	fontSize: '1.3px',
	//fontFamily: 'verdana',
	fontWeight: 'light',
	//zIndex: '445'
};

const PieSliceComponent = props => {
	const sliceRef = React.createRef();
	const [hoveredSlice, setHoveredSlice] = useState(null);
	const [unHoveredSlice, setUnHoveredSlice] = useState(null);

	const outerRadius = 12;
	const innerRadius = 0;

	const { index, value, fill, label, sensorCondition, sensorTime } = props;

	const sliceArc = arc()
		.innerRadius(innerRadius)
		.outerRadius(outerRadius);

	const sliceArc2 = arc()
		.innerRadius(innerRadius)
		.outerRadius(22);


	////////////////////////////////////////////////////////////////USE-EFFECT REWORK 19-03-2021
	useEffect(() => {
		if (hoveredSlice !== null) {
			const selectedInnerRadius = innerRadius;
			const selectedOuterRadius = outerRadius * 1.10; // OUTER ZOOM
			animateSlice(sliceRef, hoveredSlice, selectedInnerRadius, selectedOuterRadius, outerRadius, innerRadius);
			//setTimeout(() => setUnHoveredSlice(value), 15000)
		}
		else if (unHoveredSlice !== null) {
			animateSlice(sliceRef, unHoveredSlice, innerRadius, outerRadius);
		}
		// else { setUnHoveredSlice(value) }
		setUnHoveredSlice(null);
		setHoveredSlice(null);
	}, [hoveredSlice, sliceRef, unHoveredSlice, innerRadius, outerRadius, value]);


	const renderTooltip = (props) => (

		<tooltip className="text-black-50 " id="button-tooltip" {...props}>
			<div style={{ color: fill }}>{sensorCondition}</div>{'sensor value-'}{value.value}<br /><br />
			{sensorTime.split(' ')[0]}<br />{sensorTime.split(' ')[2]}
		</tooltip>

	);

	//const label = chartDataValue[index].sensorValue + "%"


	return (
		<g>
			<g
				//className="Pie_Responsive1Pie"
				//onMouseEnter={() => setHoveredSlice(value)}
				//onMouseOver={()=>setHoveredSlice(value)}
				onMouseOver={() => {
					setHoveredSlice(value);
					//	setTimeout(() => setUnHoveredSlice(value), 15000);
				}}
				//onMouseOverCapture={setTimeout(() => setUnHoveredSlice(value), 5000)}
				//onMouseLeave={() => setUnHoveredSlice(value)}
				onMouseOut={() => setUnHoveredSlice(value)}
				onMouseMove={() => {
					setHoveredSlice(value);
					//	setTimeout(() => setUnHoveredSlice(value), 15000);
				}}
				//onMouseMoveCapture={setTimeout(() => setUnHoveredSlice(value), 5000)}
				ref={sliceRef}
				index={index}>
				<OverlayTrigger
					placement="top"
					delay={{ show: 100 }}
					overlay={renderTooltip}>
					<path d={sliceArc(value)}
						fill={fill}
						//stroke="white"
						// strokeWidth="0.1"
						// strokeLinejoin="round"
						className="pieEntryAnimation"
						cursor="pointer" />
				</OverlayTrigger>

				{/* <OverlayTrigger
				placement="top"
				delay={{ show: 100 }}
				ref={sliceRef}
				index={index}
				overlay={renderTooltip}> */}

				{/* </OverlayTrigger> */}

				<OverlayTrigger
					placement="top"
					delay={{ show: 100 }}
					overlay={renderTooltip}>
					<text
						// transform={`translate(${sliceArc.centroid(value)}) rotate(${angle( value )})`}
						transform={`translate(${sliceArc2.centroid(value)})`}
						//dy=".35em"
						//dx="55em"
						//dz="22"
						textAnchor="middle"
						fill="black"
						cursor="pointer"
						style={sliceTextStyle}>
						{label}
					</text>
				</OverlayTrigger>

				<g
				//zIndex="230"
				//className="Pie_Responsive2Legend"
				>
					<text
						dy={index * 2 + -6.5}
						dx={20}
						textAnchor="left"
						fill="grey"
						cursor="pointer"
						style={sliceTextStyle}>
						{sensorCondition}
					</text>
					{/* </OverlayTrigger> */}

					{/* <OverlayTrigger
					placement="left"
					delay={{ show: 100 }}
					overlay={renderTooltip}> */}
					<circle
						fill={fill}
						stroke="lightgrey"
						strokeWidth={0.04}
						cx={18.5}
						cy={index * 2 + -7}
						r={0.6}
						cursor="pointer"
					/>
				</g>
			</g>
		</g>
	);
};

export default PieSliceComponent;