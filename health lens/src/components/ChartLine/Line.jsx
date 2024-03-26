import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import { accessorPropsType } from "../../utils/chart-utils";

import LineStyled from "./LineStyled";

const Line = ({ type, data, xAccessor, yAccessor, y0Accessor, interpolation, ...props }) => {
  // Define the line generator based on the specified type
  const lineGenerator = d3[type]()
    .x(xAccessor)
    .y(yAccessor)
    .curve(interpolation);

  // For area type, configure y0 and y1 accessors
  if (type === "area") {
    lineGenerator
      .y0(y0Accessor)
      .y1(yAccessor);
  }

  return (
    // Render the line using LineStyled component with generated path data
    <LineStyled {...props} className={`Line Line--type-${type}`} d={lineGenerator(data)} />
  );
};

// Prop Types validation
Line.propTypes = {
  type: PropTypes.oneOf(["line", "area"]), // Type of line ("line" or "area")
  data: PropTypes.array, // Data array for rendering the line
  xAccessor: accessorPropsType, // Accessor function for x values
  yAccessor: accessorPropsType, // Accessor function for y values
  y0Accessor: accessorPropsType, // Accessor function for y0 values (for area type)
  interpolation: PropTypes.func, // Interpolation function for curve
};

// Default props
Line.defaultProps = {
  type: "line", // Default type is "line"
  y0Accessor: 0, // Default y0 accessor is 0
  interpolation: d3.curveLinear, // Default interpolation function is linear
};

export default Line;
