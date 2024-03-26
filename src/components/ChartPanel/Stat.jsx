import React from "react"
import PropTypes from "prop-types"

import StatStyled from "./StatStyled";

// Define functions to render different layouts based on direction
const statComponentsByDirection = {
  top: captionTop,
  bottom: captionBottom,
}

// Stat component to render value, average, and caption with specified layout
const Stat = ({ value, avg, suffix, caption, color, direction, ...props }) => {
  // Get the appropriate rendering function based on direction
  const Component = statComponentsByDirection[direction]
  // If direction is not supported, return null
  if (!Component) return null

  // Render the chosen layout component
  return (
    <Component
      value={value}
      avg={avg}
      suffix={suffix}
      caption={caption}
      color={color}
      direction={direction}
      {...props}
    />
  )
}

// PropTypes for Stat component
Stat.propTypes = {
  value: PropTypes.number,
  avg: PropTypes.number,
  suffix: PropTypes.string,
  caption: PropTypes.string,
  color: PropTypes.string,
  direction: PropTypes.oneOf(["top", "bottom"]),
}

// Default props for Stat component
Stat.defaultProps = {
  direction: "bottom"
}

// Function to render bottom caption layout
function captionBottom({ value, avg, suffix, caption, color, ...props }) {
  return (
    <>
      {/* Render StatStyled with data and caption */}
      <StatStyled style={{ borderColor: color }} {...props}>
        <div className="Stat__data">
          <div className="Stat__value">
            {value}
          </div>
          {suffix && <div className="Stat__suffix" style={{ color: color }}>
            {suffix}
          </div>}
        </div>
        <div className="Stat__caption">
          {caption}
        </div>
      </StatStyled>
      
      {/* Render Average heart rate */}
      <div style={{ margin: '5px 10px', fontWeight: 'bold' }}>Average heart rate</div>

      {/* Render StatStyled for average */}
      <StatStyled style={{ borderColor: color }} {...props}>
        <div className="Stat__data">
          <div className="Stat__value">
            {avg}
          </div>
          {suffix && <div className="Stat__suffix" style={{ color: color }}>
            {suffix}
          </div>}
        </div>
        <div className="Stat__caption">
          {caption}
        </div>
      </StatStyled>
    </>
  )
}

// Function to render top caption layout
function captionTop({ value, avg, suffix, caption, color, ...props }) {
  return (
    <StatStyled style={{ borderColor: color }} {...props}>
      {/* Render caption */}
      <div className="Stat__caption">
        {caption}
      </div>
      {/* Render data with value, average, and suffix */}
      <div className="Stat__data">
        <div className="Stat__value">
          {value} : {avg}
        </div>
        {suffix && <div className="Stat__suffix" style={{ color: color }}>
          {suffix}
        </div>}
      </div>
    </StatStyled>
  )
}

export default Stat
