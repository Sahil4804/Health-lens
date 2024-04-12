import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './calorietracker.css';

const TauArcComponent = ({ width }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        const height = Math.min(500, width / 2);
        const outerRadius = height / 2 - 10;
        const innerRadius = outerRadius * 0.65;
        const tau = 2 * Math.PI;

        const svg = d3.select(svgRef.current)
            .attr("viewBox", [0, 0, width, height]);
        const g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        const arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .startAngle(0)
            .cornerRadius(20);
        

    const background = g.append("path")
        .datum({ endAngle: tau })
        .style("fill", "#ddd")
        .attr("d", arc);

    const foreground = g.append("path")
        .datum({ endAngle: 0.127 * tau })
        .style("fill", "red")
        .attr("d", arc);

    const interval = d3.interval(function () {
        foreground.transition()
            .duration(750)
            .attrTween("d", arcTween(Math.random() * tau));
    }, 10000);

    return () => interval.stop();

    function arcTween(newAngle) {
        return function (d) {
            const interpolate = d3.interpolate(d.endAngle, newAngle);
            return function (t) {
                d.endAngle = interpolate(t);
                return arc(d);
            };
        };
    }
}, [width]);

return (
    <div className='svg-container'>
        <h3 className='header'>Calorie Tracker</h3>
        <svg ref={svgRef} className='calorie-tracker'></svg>
    </div>
);
}

export default TauArcComponent;
