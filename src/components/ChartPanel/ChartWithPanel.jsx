import React from "react";
import PropTypes from "prop-types";

import StatPanel from "./StatPanel";

import { getStats } from "../../utils/stats";
import { combineChartDimensions } from "../../utils/chart-utils";
import { withContext } from "./Provider";

const ChartWithPanel = (Component) => {
  // Wrapper component that combines the provided chart component with a statistics panel
  const Chart = ({ dims, ...props }) => {
    // Combine chart dimensions and adjust for panel height
    const dimensions = combineChartDimensions({
      width: dims ? dims.width : 0,
      height: dims ? dims.height - 60 : 0,
      marginLeft: 80,
      marginTop: 80,
      marginRight: 30,
      marginBottom: 30,
    });

    // Extract props
    const { data, id, metrics } = props;
    // Calculate statistics based on data and metrics
    const stats = getStats(data, metrics.categories);

    return (
      <div className={id}>
        <div style={{ display: "flex" }}>
          {/* Render stat panel on the top if width is sufficient */}
          {dimensions.boundedWidth >= 600 && metrics.position === "top" && (
            <StatPanel data={stats} metrics={metrics} direction="right" />
          )}
        </div>
        <div style={{ position: "relative" }}>
          {/* Render the chart component */}
          {dims && (
            <Component {...props} data={data} dimensions={dimensions} />
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: dimensions.boundedWidth < 600 ? "column" : "row",
          }}
        >
          {/* Render stat panel on the bottom or left if width is not sufficient */}
          {dimensions.boundedWidth >= 600 && metrics.position === "bottom" && (
            <StatPanel data={stats} metrics={metrics} direction="right" />
          )}
          {dimensions.boundedWidth < 600 && (
            <StatPanel data={stats} metrics={metrics} direction="left" />
          )}
        </div>
      </div>
    );
  };

  return withContext(Chart); // Enhance the Chart component with context
};

// Prop Types validation
ChartWithPanel.propTypes = {
  Component: PropTypes.element, // The chart component to be wrapped
};

export default ChartWithPanel;
