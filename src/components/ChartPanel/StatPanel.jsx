import React from "react"
import PropTypes from "prop-types"
import Stat from "./Stat"

import StatPanelStyled from "./StatPanelStyled";

// StatPanel component to display statistics in a panel
const StatPanel = ({ data, metrics, direction }) => {
  // Destructure value and suffix from metrics
  const { value, suffix } = metrics

  return (
    // Container styled component for the stat panel
    <StatPanelStyled style={{justifyContent: direction === 'left' ? 'flex-start' : 'flex-end', width: '100%'}}>
      {/* Title for the panel */}
      <div style={{ margin: '5px 20px', fontWeight: 'bold' }}>Current Heart rate</div>
      
      {/* Map through data to render individual Stat components */}
      {data.map((d, i) => {
        return (
          <Stat
            key={'stat-' + i} 
            avg={d.average}
            value={d[value]}
            suffix={d[suffix]}
            caption={"BPM"}
            direction="bottom"
            color="black"
          />
        )
      })}
    </StatPanelStyled>
  )
}

// PropTypes for StatPanel component
StatPanel.propTypes = {
  data: PropTypes.array,
  metrics: PropTypes.object
}

export default StatPanel
