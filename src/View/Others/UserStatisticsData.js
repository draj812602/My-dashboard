import React, { useRef, useEffect, useState } from 'react';
import { select, axisBottom, scaleLinear, scaleBand, axisLeft, stack, scaleOrdinal, max } from 'd3';
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
function UserData(props) {
    // console.log("data-ann", props)
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);
    const [tiphover, setTiphover] = useState();
    // will be called initially and on every data change
    useEffect(() => {
        const svg = select(svgRef.current);
        if (!dimensions) return;
        props.data.sort(function(a, b) { return a.numberOfTelemetryUsed - b.numberOfTelemetryUsed; });
        const padding = 0.6; // For both scales: xScaleLabels and xScaleBars
        // scales
        const xScaleLabels = scaleLinear()
        // .domain([
        //     0,
        //     1000,
        // ]) 
        // .domain([0, props.data.at(0).numberOfTelemetryUsed])
       
  .domain([
            0,
            1500,
        ]) 
        // .domain([0, d3.max(props.data, function(d) { return d.numberOfTelemetryUsed; })])
           
            .range([0, dimensions.width])
           

        var color = scaleOrdinal().range(["#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#6b485d"]);

        const tickWidth =20;
        const width = xScaleLabels.range()[1];
        // console.log(width);
        const tickN = Math.floor(width / tickWidth);
        const keepEveryNth = Math.ceil(xScaleLabels.domain().length / tickN);
        const xScaleLabelDomain = xScaleLabels
            .domain()

            .filter((_, i) => i % keepEveryNth === 0);
        xScaleLabels.domain(xScaleLabelDomain);

        const yScale = scaleBand()
        .domain(props.data.map(({ device_name }) => device_name))
            .range([dimensions.height, 0])
            //  .padding(padding) // change
        // create x-axis
        const ScaleBars = scaleLinear()
        .domain([
            0,
        1500
        ]) 
        // .domain([0, d3.max(props.data, function(d) { return d.numberOfTelemetryUsed; })])
        // .domain([0, props.data.at(0).numberOfTelemetryUsed])
        // .domain(props.data.map(({ device_name }) => device_name))
        .range([0, dimensions.width])
        // .padding(padding);

        const xAxis = axisBottom(xScaleLabels).ticks(5);

        svg
            .select('.x-axis')
            .attr('class', 'x-axis')
            .style("stroke", "#495057")  
            .style('transform', `translateY(${dimensions.height}px)`)
            .call(xAxis.tickSize(5).tickPadding([10])
             
            // .tickValues([""])
            );

        // create y-axis

        const yAxis = axisLeft(yScale);
        svg.select('.y-axis')
        .attr('class', 'yaxis')
        .call(yAxis.ticks(0).tickPadding([12]).tickValues([""]));

      

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
    .attr("y", function (d) {
        return yScale(d.device_name) + -1;
    })
    .attr("height", yScale.bandwidth())
    .attr("x", 1)
    .attr("width", function (d) {
        return ScaleBars(d.numberOfTelemetryUsed);
    })
   
    // .attr('width', yScale.bandwidth())
    .on('mousemove', function (event, d) {
        d3.select(this)
            .transition()
            .duration('50')
            .attr('opacity', 0.6)
        div.transition().duration(50).style('opacity', 1);
        div
            .html(
                `<text class="text-dark font-weight-bold"> Device Name: ${d.device_name}
                 <br/>Number of Telemetry Used: ${d.numberOfTelemetryUsed}/${d.maxTelemetry}</br>`
            )
            .style('color', "white")
            .style('left', event.pageX - 90 + 'px')
            .style('top', event.pageY - 45 + 'px')
    })
    .on('mouseout', function (d, i) {
        d3.select(this)
            .transition()
            .duration('50')
            .attr('opacity', '1');
        div.transition().duration('50').style('opacity', 0);
    })
    .transition()
    .attr("fill", function (d, i) { return color(i); })
    // .attr(
    //     'height',
    //     ({ device_name }) => dimensions.height - yScale(device_name)
    // )
      svg
      .selectAll('.labels')
      .data(props.data)
      .join('text')
      
            .attr("class", "labels")
            // .style("stroke", "#495057")  
            //y position of the label is halfway down the bar
            .attr("y", function (d) {
                return yScale(d.device_name) + yScale.bandwidth() / 2 + 2;
            })
            //x position is 3 pixels to the right of the bar
            .attr("x", function (d) {
                return xScaleLabels(d.numberOfTelemetryUsed) + 5;
            })
            .text(function (d, string) {
                var dots = '...';
                if (d.numberOfTelemetryUsed !== null && d.numberOfTelemetryUsed > 0) {
                    if (d.device_name.length > 4) {
                        // you can also use substr instead of substring
                        string = d.device_name.substring(0, 4) + dots;
                    } else return d.device_name;
                    return string;
                }
            });
            
            svg.selectAll(".labeltext")
            .data(props.data)
            .join("text")
            .attr("class", "labeltext")
            // .style("stroke", "#495057")  
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - 25)
            .attr("x", - (dimensions.height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Devices");




    }, [props, dimensions]);
    // const Mousehovertooltip = () => {
    // 	setTiphover(Math.random());
    // };
    return (
        <div ref={wrapperRef} style={{ marginLeft: '1rem' }}>
            <svg
                ref={svgRef}
                className='svgimg_container_class_statistics'>

                <g className="x-axis" />
                <g className="y-axis" />
                {/* <g className='xline'/> */}
            </svg>
        </div>
    );
}
export default UserData;
