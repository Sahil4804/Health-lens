import React from "react" // Importing React library
import { dimensionsPropsType } from "../../utils/chart-utils" // Importing custom PropTypes for dimensions props

const Chart = ({ dimensions, children }) => ( // Declaring a functional component named Chart with dimensions and children as props
    // Rendering an SVG element with class name "Chart", setting width and height based on dimensions prop
    <svg className="Chart" width={dimensions.width} height={dimensions.height}> 
      <g transform={`translate(${dimensions.marginLeft}, ${dimensions.marginTop})`}>
        { children }
      </g>
    </svg>
)

Chart.propTypes = { // Defining PropTypes for the Chart component
  dimensions: dimensionsPropsType
}

Chart.defaultProps = {
  dimensions: {} // Setting dimensions prop default value to an empty object
}

export default Chart
