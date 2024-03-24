import React from "react"

import PropTypes from "prop-types"
import Stat from "./Stat"

import StatPanelStyled from "./StatPanelStyled";

const StatPanel = ({ data, metrics, direction }) => {

  const { value, suffix } = metrics

  return (
    <StatPanelStyled style={{justifyContent: direction === 'left' ? 'flex-start' : 'flex-end', width: '100%'}}>
      <div style={{margin: '5px 20px', fontWeight: 'bold'}}>Current Heart rate</div>
      { data.map((d,i)=> {
        return <Stat
          key={'stat-' + i} 
          value={d[value]}
          suffix={d[suffix]}
          caption={"BPM"}
          direction="bottom"
          color="black"
        />
      })}
    </StatPanelStyled>
  )
}

StatPanel.propTypes = {
  data: PropTypes.array,
  metrics: PropTypes.object
}

export default StatPanel