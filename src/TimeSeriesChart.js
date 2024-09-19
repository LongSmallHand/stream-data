import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TimeSeriesChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (data.length === 0) return;
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const width =  900;
        const height = 400;
        const margin = { top: 30, right: 30, bottom: 30, left: 90 };

        const x = d3.scaleTime().range([margin.left, width - margin.right]);
        const y = d3.scaleLinear().range([height - margin.bottom, margin.top]);

        x.domain(d3.extent(data, d => d.timestamp));
        y.domain([0, d3.max(data, d => d.value)]);

        const line = d3.line()
            .x(d => x(d.timestamp))
            .y(d => y(d.value));

        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));


        const dataByDevice = data.reduce((acc, d) => {
            if (!acc[d.device_id]) acc[d.device_id] = [];
            acc[d.device_id].push(d);
            return acc;
        }, {});
        
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        Object.keys(dataByDevice).forEach(key => {
            svg.append("path")
                .datum(dataByDevice[key])
                .attr("fill", "none")
                .attr("stroke", color(key))
                .attr("stroke-width", 1.5)
                .attr("d", line);
        });
  
    }, [data]);

    return (
        <svg ref={svgRef} width={900} height={400}></svg>
    );
};

export default TimeSeriesChart;