import React from "react"
import PropTypes from "prop-types"

import StatStyled from "./StatStyled";

const statComponentsByDirection = {
  top: captionTop,
  bottom: captionBottom,
}

const Stat = ({ value, avg, suffix, caption, color, direction, ...props }) => {
  const Component = statComponentsByDirection[direction]
  if (!Component) return null

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

Stat.propTypes = {
  value: PropTypes.number,
  suffix: PropTypes.string,
  caption: PropTypes.string,
  color: PropTypes.string,
  direction: PropTypes.oneOf(["top", "bottom"]),
}

Stat.defaultProps = {
  direction: "bottom"
}

export default Stat

function captionBottom({ value, avg, suffix, caption, color, ...props }) {
  return (
    <>
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
      <div style={{ margin: '5px 10px', fontWeight: 'bold' }}>Average heart rate</div>

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

function captionTop({ value, avg, suffix, caption, color, ...props }) {
  return (
    <StatStyled style={{ borderColor: color }} {...props}>
      <div className="Stat__caption">
        {caption}
      </div>
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