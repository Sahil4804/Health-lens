import React from "react"
import PropTypes from "prop-types"
import * as d3 from 'd3'
import { dimensionsPropsType } from "../../utils/chart-utils"; // Importing utility function for prop validation
import useTheme from "../../contexts/ProvideContext"; // Importing theme context hook
import { useContext } from "react"; // Importing useContext hook for accessing context
import AxisStyled from "./AxisStyled"; // Importing styled component for axis

// Map dimension (x or y) to its respective axis component
const axisComponentsByDimension = {
  x: AxisHorizontal,
  y: AxisVertical,
}

// Main Axis component
const Axis = ({ dimensions, dimension, ...props }) => {
  const Component = axisComponentsByDimension[dimension]; // Get the appropriate axis component based on dimension
  if (!Component) return null; // Return null if no valid component found for the given dimension

  return (
    <Component
      dimensions={dimensions}
      {...props}
    />
  )
}

// PropTypes for Axis component
Axis.propTypes = {
  dimension: PropTypes.oneOf(["x", "y"]), // Dimension should be either 'x' or 'y'
  dimensions: dimensionsPropsType, // Custom prop type for dimensions
  scale: PropTypes.func, // Function for scaling data
  label: PropTypes.string, // Label for the axis
  formatTick: PropTypes.func, // Function for formatting tick marks
}

// Default props for Axis component
Axis.defaultProps = {
  dimension: "x", // Default dimension is 'x'
  scale: null, // Default scale is null
  formatTick: d3.format(","), // Default tick format using d3
  type: 'linear' // Default type of scale is linear
}

export default Axis;

// Horizontal Axis component
function AxisHorizontal ({ dimensions, label, formatTick, tickSize, scale, type, ...props }) {
  let ticks = 0; // Initialize ticks variable
  
  // Determine ticks based on scale type
  if(type === 'linear'){
    // Calculate number of ticks based on boundedWidth
    const numberOfTicks = dimensions.boundedWidth < 768
          ? Math.ceil(dimensions.boundedWidth / 220)
          : Math.ceil(dimensions.boundedWidth / 200);

    ticks = scale.ticks(numberOfTicks); // Generate ticks using the scale function
  } else if (type === 'step'){
    ticks = scale.ticks(5); // Generate ticks for step scale
  } else {
    // Generate custom ticks based on boundedWidth
    const step = dimensions.boundedWidth < 768 ? 3 : 2;
    ticks = scale.domain().filter(function(d,i){ 
        return (i%step) === 0;
    });
  }

  // Get theme mode from context
  const { themeMode } = useTheme();

  // Render the horizontal axis
  return (
    <AxisStyled className="Axis AxisHorizontal" transform={`translate(0, ${dimensions.boundedHeight})`} {...props}>
      <line
        className="Axis__line"
        x2={dimensions.boundedWidth}
      />
      {ticks.map((tick, i) => (
        <React.Fragment key={'xaxis-' + tick}>
          <text
            className="Axis__tick"
            transform={`translate(${scale(tick)}, 25)`}
            stroke={themeMode === "light" ? "#333333" : "white"}
          >
            { formatTick(tick) }
          </text>
           <line
            className="Axis__tick__line"
            y2={tickSize}
            x1={scale(tick)}
            x2={scale(tick)}
          />
        </React.Fragment>
      ))}
      {label && (
        <text
          className="Axis__label"
          transform={`translate(${dimensions.boundedWidth / 2}, 60)`}
          stroke={themeMode === "light" ? "#333333" : "#ffffff"}
        >
          { label }
        </text>
      )}
    </AxisStyled>
  )
}

// Vertical Axis component
function AxisVertical ({ dimensions, label, formatTick, tickSize, scale, type, ...props }) {
  let ticks = 0; // Initialize ticks variable

  // Determine ticks based on scale type
  if(type === 'linear'){
    const numberOfTicks = dimensions.boundedHeight / 50; // Calculate number of ticks based on boundedHeight
    ticks = scale.ticks(numberOfTicks); // Generate ticks using the scale function
  } else {
    // Generate custom ticks based on boundedHeight
    const step = dimensions.boundedHeight / 50 ? 3 : 2;
    ticks = scale.domain().filter(function(d,i){ 
        return (i%step) === 0;
    });
  }
  
  // Get theme mode from context
  const { themeMode } = useTheme();

  // Render the vertical axis
  return (
    <AxisStyled className="Axis AxisVertical" {...props}>
      <line
        className="Axis__line"
        y2={dimensions.boundedHeight}
      />

      {ticks.map((tick, i) => (
        <React.Fragment key={'yaxis-' + tick}>
          <text
            className="Axis__tick"
            transform={`translate(-16, ${scale(tick)})`}
            stroke={themeMode === "light" ? "#333333" : "#ffffff"}
          >
            { formatTick(tick) }
          </text>
           <line
            className="Axis__tick__line"
            x2={tickSize}
            y1={scale(tick)}
            y2={scale(tick)}
          />
        </React.Fragment>
      ))}

      {label && (
        <text
          className="Axis__label"
          style={{
            transform: `translate(-56px, ${dimensions.boundedHeight / 2}px) rotate(-90deg)`, // Rotate label for vertical axis
          }}
          stroke={themeMode === "light" ? "#333333" : "#ffffff"}
        >
          { label }
        </text>
      )}
    </AxisStyled>
  )
}
