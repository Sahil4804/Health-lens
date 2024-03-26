import React from "react"
import PropTypes from "prop-types"
import { accessorPropsType, callAccessor } from "../../utils/chart-utils"; // Importing utility functions for prop validation and accessor call

// Bar component for rendering individual bars in a bar chart
const Bar = ({ data, xAccessor, yAccessor, y0Accessor, colorAccessor, width, mouseOver, ...props }) => {
  
  // Function to generate path for each bar using SVG commands
  const barGenerator = (x, y, rx, ry, width, height) => {
    return `M${x},${y + ry}
      a${rx},${ry} 0 0 1 ${rx},${-ry}
      h${width - 2 * rx}
      a${rx},${ry} 0 0 1 ${rx},${ry}
      v${height - ry}
      h${-(width)}Z
    `;
  }
    
  return (
    <>
    { data.map((d,i) => {
      // Calculate height, X and Y positions for the current bar
      let height = callAccessor(y0Accessor, d, i) - callAccessor(yAccessor, d, i)
      let X = callAccessor(xAccessor, d, i)
      let Y = callAccessor(yAccessor, d, i)
      
      // Prepare event content for mouseover event
      let event_content = {
        x: X + width/2, 
        y: Y, 
        content: d.value
      }
      
      // Render the path element for the current bar
      return <path {...props}
        key={"bar-" + d.category + '-' + i}
        d={barGenerator(X, Y, 0, 0, width, height)} // Generate path for the bar
        fill={callAccessor(colorAccessor, d, i)} // Set fill color for the bar
        opacity={0.8} // Set opacity for the bar
        onMouseOver={() => mouseOver({...event_content, show: true})} // Handle mouseover event
        onMouseOut={() => mouseOver({...event_content, show: false})} // Handle mouseout event
        cursor="pointer" // Set cursor style for the bar
        pointerEvents="auto" // Enable pointer events for the bar
      />
    })}
    </>
  )
}

// PropTypes for Bar component
Bar.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]), // Data array or object for rendering bars
  xAccessor: accessorPropsType, // Accessor function for X values
  yAccessor: accessorPropsType, // Accessor function for Y values
  y0Accessor: accessorPropsType, // Accessor function for baseline Y values
  colorAccessor: accessorPropsType, // Accessor function for color values
  width: PropTypes.number, // Width of the bars
  mouseOver: PropTypes.func // Function to handle mouseover event
}

// Default props for Bar component
Bar.defaultProps = {
  y0Accessor: 0, // Default baseline Y value is 0
  width: 6, // Default width of bars is 6
  mouseOver: () => {} // Default mouseover handler does nothing
}

export default Bar // Export the Bar component
