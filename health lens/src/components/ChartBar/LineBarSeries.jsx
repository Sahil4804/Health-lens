import React, { useState } from "react";
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "../ChartSVG/Chart";
import Axis from "../ChartAxis/Axis";
import Bar from "./Bar"
import Line from "../ChartLine/Line";
import { getStats } from "../../utils/stats";


const LineBarSeries = ({ data, types, dimensions, timeFormat }) => {
  const mobile_portrait =
    Math.min(window.innerWidth) <= 600 &&
    Math.abs(window.screen.orientation.angle === 0);

  const [hover, setHover] = useState({ show: false });

  const { heart, blood_pulse } = data;

  // Manually group data by category
  const groupedHeart = {};
  heart.forEach((item) => {
    if (!groupedHeart[item.category]) {
      groupedHeart[item.category] = [];
    }
    groupedHeart[item.category].push(item);
  });

  const nested = Object.entries(groupedHeart).map(([key, values]) => ({
    key,
    values,
  }));

  types.forEach((d, i) => {
    nested[i].type = d;
  });

  const barValues = nested.filter((d) => d.type === "bar");
  const barValuesAll = barValues.map((d) => d.values).flat();
  const lineValues = nested.filter(
    (d) => d.type === "line" || d.type === "area"
  );

  const barWidth = dimensions.boundedWidth / barValuesAll.length;
  const height = dimensions.boundedHeight;
  const topHeight = height * (4 / 4);
  const bottomHeight = height * (1 / 4);

  const xAccessor = (d) => d.date;
  const yAccessor = (d) => d.value;

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(heart, xAccessor))
    .range([0, dimensions.boundedWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([40, 135])
    .range([topHeight, 0])
    .nice();
  // const colorScale = d3.scaleLinear()
  //   .domain([0, 10, 20])
  //   .range(["#48acf0", "#fdf5ce", "#fe5f55"])
  //   const colorScale = d3.scaleLinear()
  //     .domain([0,2,4,6,8])
  //     .range(["#DFF9F2", "#B6EEE3", "#8CE4D3", "#63D9C3", "#3ACFB4", "#11C4A4", "#00A388"]);

  const colorScale = d3
    .scaleLinear()
    .domain([0, 8]) // Replace with the maximum value in your data
    .range(["#6b6969", "#454444"]); // Light gray to darker gray

  const colorScale1 = d3
    .scaleLinear()
    .domain([0, 10])
    .range(["#dbcdf0", "#5e4ae3"]);

  const lineColorAccessor = (d) => "#fa6c07";
  const colorAccessor = (d) => colorScale(d.value);
  const colorAccessor1 = (d) => colorScale1(d.value);
  const xAccessorScaled = (d) => xScale(xAccessor(d));
  const xAccessorScaledBar = (d) => xScale(xAccessor(d)) - barWidth / 2;
  const yAccessorScaled = (d) => yScale(yAccessor(d));
  const y0AccessorScaled = yScale(yScale.domain()[0]);

  const hr = d3.range(0, 20, 2);
  const bpw = d3.range(0, 10, 1);

  const popover = (d) => {
    let date = xScale.invert(d.x);
    let hrValue = heart.find(
      (el) => (el.date === date.getTime()) & (el.category === "heart_rate")
    ).value;
    let hiValue = heart.find(
      (el) => (el.date === date.getTime()) & (el.category === "heart_intensity")
    ).value;
    let bpwValue = blood_pulse.find((el) => el.date === date.getTime()).value;
    setHover({
      date,
      heart_rate: hrValue,
      heart_intensity: hiValue,
      blood_pulse: bpwValue,
      show: d.show,
    });
  };
  var something = getStats(data, { heart_rate: "Heart Rate" });
  console.log(something);
  return (
    <Chart dimensions={dimensions}>
      <g
        transform={
          mobile_portrait ? `translate(-30, -60)` : `translate(0, -60)`
        }
      >
        <text x={0} y={-5} fill="black" fontWeight="bold">
          Intensity of motion
        </text>
        {/* <line
          x1={0}
          y1={yScale(60)}
          x2={dimensions.boundedWidth}
          y2={yScale(60)}
          stroke="black" // Change the color to white
          strokeWidth={2} // Increase the width to make it thicker
        // strokeDasharray="4" // Optional: Add dashed style
        /> */}
        {/* <text
          x={0}
          y={yScale(60)}
          
          stroke="black" // Change the color to white
          strokeWidth={1} // Increase the width to make it thicker
          strokeOpacity={4}
         
        >
          Recommended BPM
        </text> */}
        {/* <rect x={0} y={yScale(65)} width={170} height={30} fill="white" stroke="black" strokeWidth={2} />
        <text x={5} y={yScale(57)} fill="black" fontWeight="bold">
          Recommended BPM
        </text> */}

        <Axis
          dimensions={{ boundedWidth: hr.length * barWidth, boundedHeight: 25 }}
          dimension="x"
          scale={d3
            .scaleLinear()
            .domain([0, 5])
            .range([0, hr.length * barWidth])}
          tickSize={10}
          type="step"
        />
        <Bar
          data={hr}
          xAccessor={(d, i) => i * barWidth}
          yAccessor={0}
          y0Accessor={25}
          colorAccessor={(d) => colorScale(d)}
          width={barWidth}
          mouseOver={popover}
        />
      </g>
      {/* <g transform={mobile_portrait ? `translate(120, -60)` : `translate(330, -60)`}>
        <text x={0} y={-5} fill="black" fontWeight="bold">Intensity of blood pulse wave</text>
        <Axis
          dimensions={{ boundedWidth: bpw.length * barWidth, boundedHeight: 25 }}
          dimension="x"
          scale={d3.scaleLinear().domain([0, 10]).range([0, bpw.length * barWidth])}
          tickSize={10}
          type='step'
        />
        <Bar
          data={d3.range(0, 10)}
          xAccessor={(d, i) => i * barWidth}
          yAccessor={0}
          y0Accessor={25}
          colorAccessor={d => colorScale1(d)}
          width={barWidth}
          mouseOver={popover}
        />
      </g> */}
      <g transform={`translate(0, 0)`}>
        <Axis
          dimensions={dimensions}
          dimension="x"
          scale={xScale}
          formatTick={timeFormat}
          tickSize={10}
        />
        <Axis
          dimensions={{
            boundedWidth: dimensions.boundedWidth,
            boundedHeight: topHeight,
          }}
          dimension="y"
          scale={yScale}
          tickSize={-10}
          label={"Heart Rate (BPM)"}
        />

        <Bar
          data={barValuesAll}
          xAccessor={xAccessorScaledBar}
          yAccessor={0}
          y0Accessor={topHeight}
          colorAccessor={colorAccessor}
          width={barWidth}
          mouseOver={popover}
        />
        {hover.show && (
          <text x={xScale(hover.date) - barWidth / 2} y={topHeight}>
            {hover.heart_intensity}
          </text>
        )}

        {hover.show && (
          <text
            x={xScale(hover.date) - barWidth / 2}
            y={yScale(hover.heart_rate) - 5}
          >
            {hover.heart_rate + " BPM"}
          </text>
        )}
      </g>
      {/* <g transform={`translate(0, ${topHeight})`}>
        <Bar
          data={blood_pulse}
          xAccessor={xAccessorScaledBar}
          yAccessor={0}
          y0Accessor={bottomHeight}
          colorAccessor={colorAccessor1}
          width={barWidth}
          mouseOver={popover}
        />
        {hover.show && <text
          x={xScale(hover.date) - barWidth / 2}
          y={bottomHeight}
        >
          {hover.blood_pulse}
        </text>}
      </g> */}
      <line
        x1={0}
        y1={yScale(something[0].average)}
        x2={dimensions.boundedWidth}
        y2={yScale(something[0].average)}
        stroke="black"
        strokeWidth={2}
        strokeDasharray="4"
      />

      <line
        x1={0}
        y1={yScale(80)}
        x2={dimensions.boundedWidth}
        y2={yScale(80)}
        stroke="black"
        strokeWidth={2}
        // strokeDasharray="4"
      />
      {/* Render the textbox above the line */}

      {/* Render the textbox above the line */}
      {/* <foreignObject x={1000} y={0} width={dimensions.boundedWidth} height={dimensions.boundedHeight} style={{ zIndex: 999 }}>
        <div style={{ position: 'absolute', top: yScale(80) - 50, left: '10%', transform: 'translateX(-50%)', background: 'rgba(255, 255, 255, 0.9)', padding: '10px', border: '2px solid black', borderRadius: '5px' }}>
          <text fill="black" fontWeight="bold">{something[0].average}</text>
        </div>
      </foreignObject> */}
      {lineValues.map((d, i) => {
        return (
          <Line
            type={d.type}
            key={"line-" + i}
            data={d.values}
            stroke={lineColorAccessor(d)}
            style={{ strokeWidth: 4 }}
            fill={d.type === "area" ? lineColorAccessor(d) : "none"}
            xAccessor={xAccessorScaled}
            yAccessor={yAccessorScaled}
            y0Accessor={y0AccessorScaled}
          />
        );
      })}
      <foreignObject
        x={0}
        y={0}
        width={dimensions.boundedWidth}
        height={dimensions.boundedHeight}
        style={{ zIndex: 999 }}
      >
        <div
          style={{
            position: "absolute",
            top: yScale(80) - 50,
            left: "10%",
            transform: "translateX(-50%)",
            background: "rgba(255, 255, 255, 0.9)",
            padding: "10px",
            border: "2px solid black",
            borderRadius: "5px",
          }}
        >
          <text fill="black" fontWeight="bold">
            recommend HeartRate{" "}
          </text>
        </div>
      </foreignObject>
    </Chart>
  );
}


LineBarSeries.propTypes = {
  data: PropTypes.object,
  types: PropTypes.array,
  dimensions: PropTypes.object,
  timeFormat: PropTypes.func
}

LineBarSeries.defaultProps = {
  types: ['line', 'bar'],
  timeFormat: d3.timeFormat("%H:%M:%S %p")
}

export default LineBarSeries