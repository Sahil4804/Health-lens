import React, { useState, useEffect } from "react";
import * as d3 from "d3";

import LineBarSeries from "./components/ChartBar/LineBarSeries";

import ChartWithPanel from "./components/ChartPanel/ChartWithPanel";
import { Provider } from "./components/ChartPanel/Provider";
import { getData, getNewData,csv_data } from "./utils/getData";
import Togglebutton from "./utils/Togglebutton";
// import LineGraph from "./components/LinePLot/LineGraph";
import StepCountsGraph from "./components/LinePLot/LineGraph";
import './App.css'

const metricsAttrs = { position: 'top', value: "maximum", categories: { 'heart_rate': 'Heart Rate' }}
import { ThemeProvider } from "./contexts/ProvideContext";

const App = () => {
    var lol=0;
  const [datetime, setDateTime] = useState({'start': new Date(), 'current': new Date()});
  const [data, setData] = useState(null)
  const LineBarChart = ChartWithPanel((props) => <LineBarSeries {...props} />)
  const [index, setIndex] = useState(0)
  //const milliseconds = 60000 //this will update the chart every minute
  const milliseconds = 1000 //this will update the chart every second (for testing purposes)
  const timeFormat = milliseconds === 1000 ? d3.timeFormat("%H:%M:%S %p") : d3.timeFormat("%H:%M %p")

  useEffect(() => {
}, [])

useEffect(() => {
    
    csv_data()
    // setData(getData(milliseconds,lol))

    const interval = setInterval(() => {

      const current = new Date()

      let dataInitial = getData(milliseconds, lol)
      lol+=10
      let dataToAdd = getNewData(current, milliseconds)
      
      setData(dataInitial)
      setDateTime({'start': new Date(new Date().setHours(new Date().getHours() + dataInitial.hours)), 'current': current})

      if(data){
        setData({'heart': [{...data.heart, ...dataToAdd.hrNew}], 'blood_pulse': [{...data.blood_pulse, ...dataToAdd.bpNew}] }) 
      }

    }, milliseconds);
    return () => clearInterval(interval);
    
}, []);
const [themeMode, setThemeMode] = useState('light');
const darkTheme = () => {
    setThemeMode('dark');
}
const lightTheme = () => {
    setThemeMode('light');
}
useEffect(() => {}, [themeMode]);

  return (
    <ThemeProvider value={{ themeMode, darkTheme, lightTheme }}>
      {data && (
        <div
          className="wrapper"
          style={{
            backgroundColor: themeMode === "light" ? "#ffffff" : "#333333",
            color: themeMode === "light" ? "#333333" : "#ffffff",
          }}
        >
          <div className="header">
            <h2>Health Lens</h2>
            {/* <div className='header-details'>
          <p><span style={{fontWeight: 'bold'}}>Patient ID:</span> 352405</p>
          <p><span style={{fontWeight: 'bold'}}>Datetime Range:</span> {d3.timeFormat("%B %d, %Y")(datetime.start)} {timeFormat(datetime.start) + ' - ' + timeFormat(datetime.current)}</p>
        </div> */}
          </div>
          <div className="box">
            <Provider>
              <LineBarChart
                data={data}
                metrics={metricsAttrs}
                timeformat={timeFormat}
              />
            </Provider>
          </div>
        </div>
      )}
        {/* <LineGraph /> */}
        <StepCountsGraph />
      <Togglebutton />
      
    </ThemeProvider>
  );
}

export default App