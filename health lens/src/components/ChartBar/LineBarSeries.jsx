import React, { useState } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

import Chart from "../ChartSVG/Chart"; // Importing Chart component
import Axis from "../ChartAxis/Axis"; // Importing Axis component
import Bar from "./Bar"; // Importing Bar component
import Line from "../ChartLine/Line"; // Importing Line component
import { getStats } from "../../utils/stats"; // Importing getStats function
import useTheme from "../../contexts/ProvideContext"; // Importing useTheme context

const LineBarSeries = ({ data, types, dimensions, timeFormat }) => {
  const { themeMode } = useTheme(); // Accessing themeMode from context

  // Check if device is in portrait mode
  const mobile_portrait =
    Math.min(window.innerWidth) <= 600 &&
    Math.abs(window.screen.orientation.angle === 0);

  // State to manage hover behavior
  const [hover, setHover] = useState({ show: false });

  const { heart, blood_pulse } = data; // Destructuring heart and blood_pulse from data

  // Grouping heart data by category
  const groupedHeart = {};
  heart.forEach((item) => {
    if (!groupedHeart[item.category]) {
      groupedHeart[item.category] = [];
    }
    groupedHeart[item.category].push(item);
  });

  // Creating nested array with key-value pairs for heart data
  const nested = Object.entries(groupedHeart).map(([key, values]) => ({
    key,
    values,
  }));

  // Assigning types to nested data
  types.forEach((d, i) => {
    nested[i].type = d;
  });

  // Separating bar and line values from nested data
  const barValues = nested.filter((d) => d.type === "bar");
  const barValuesAll = barValues.map((d) => d.values).flat();
  const lineValues = nested.filter(
    (d) => d.type === "line" || d.type === "area"
  );

  // Calculating bar width based on chart dimensions and data length
  const barWidth = dimensions.boundedWidth / barValuesAll.length;
  const height = dimensions.boundedHeight;
  const topHeight = height * (4 / 4);

  // Accessors for x and y values
  const xAccessor = (d) => d.date;
  const yAccessor = (d) => d.value;

  // Creating scales for x and y axes
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(heart, xAccessor))
    .range([0, dimensions.boundedWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([40, 135])
    .range([topHeight, 0])
    .nice();

  // Creating color scale based on theme mode
  const colorScale = d3
    .scaleLinear()
    .domain([0, 8])
    .range(
      themeMode === "dark" ? ["#6b6969", "#454444"] : ["#F1EAFF", "#DCBFFF"]
    );

  // Accessors for colors and scaled values
  const lineColorAccessor = (d) => (themeMode === "dark" ? "#fa6c07" : "red");
  const colorAccessor = (d) => colorScale(d.value);
  const xAccessorScaled = (d) => xScale(xAccessor(d));
  const xAccessorScaledBar = (d) => xScale(xAccessor(d)) - barWidth / 2;
  const yAccessorScaled = (d) => yScale(yAccessor(d));
  const y0AccessorScaled = yScale(yScale.domain()[0]);

  // Array for heart rate
  const hr = d3.range(0, 20, 2);

  // Popover function to handle mouse over events
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

  // Stats calculation using getStats function
  var something = getStats(data, { heart_rate: "Heart Rate" });

  return (
    <Chart dimensions={dimensions}>
      {/* Group for intensity of motion */}
      <g
        transform={
          mobile_portrait ? `translate(-30, -60)` : `translate(0, -60)`
        }
      >
        <text x={0} y={-5} fill={themeMode === "light" ? "black" : "white"} fontWeight="bold">
          Intensity of motion
        </text>

        {/* X axis for intensity of motion */}
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
        
        {/* Bar chart for intensity of motion */}
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
   
      <g transform={`translate(0, 0)`}>
        {/* X and Y axes */}
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

        {/* Bar chart for heart rate */}
        <Bar
          data={barValuesAll}
          xAccessor={xAccessorScaledBar}
          yAccessor={0}
          y0Accessor={topHeight}
          colorAccessor={colorAccessor}
          width={barWidth}
          mouseOver={popover}
        />
        {/* Displaying intensity of motion */}
        {hover.show && (
          <text x={xScale(hover.date) - barWidth / 2} y={topHeight}>
            {hover.heart_intensity}
          </text>
        )}

        {/* Displaying heart rate */}

        {hover.show && (
          <text
            x={xScale(hover.date) - barWidth / 2}
            y={yScale(hover.heart_rate) - 5}
          >
            {hover.heart_rate + " BPM"}
          </text>
        )}
      </g>
    
      <line
        x1={0}
        y1={yScale(something[0].average)}
        x2={dimensions.boundedWidth}
        y2={yScale(something[0].average)}
        stroke={themeMode === "light" ? "#333333" : "white"}
        strokeWidth={2}
        // strokeDasharray="4"
      />

            {/* Horizontal line for average heart rate */}
            <line
        x1={0}
        y1={yScale(something[0].average)}
        x2={dimensions.boundedWidth}
        y2={yScale(something[0].average)}
        stroke={themeMode === "light" ? "#333333" : "white"}
        strokeWidth={2}
        // strokeDasharray="4"
      />

      {/* Horizontal line for recommended heart rate */}
      <line
        x1={0}
        y1={yScale(80)}
        x2={dimensions.boundedWidth}
        y2={yScale(80)}
        stroke={themeMode === "light" ? "#333333" : "white"}
        strokeWidth={2}
        strokeDasharray="4"
      />
     
      {/* Rendering line and area charts */}
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

      {/* Rendering recommendation for heart rate */}
      {/* <foreignObject
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
            backgroundColor: themeMode === "light" ? "#ffffff" : "#333333",
            padding: "10px",
            border: "2px solid black",
            borderRadius: "5px",
          }}
        >
          <text fill={"black"} fontWeight="bold">
            Recommend HeartRate{" "}
          </text>
        </div>
      </foreignObject> */}
    </Chart>
  );
};

// Prop Types validation
LineBarSeries.propTypes = {
  data: PropTypes.object,
  types: PropTypes.array,
  dimensions: PropTypes.object,
  timeFormat: PropTypes.func,
};

// Default props
LineBarSeries.defaultProps = {
  types: ["line", "bar"],
  timeFormat: d3.timeFormat("%H:%M:%S %p"),
};

export default LineBarSeries;