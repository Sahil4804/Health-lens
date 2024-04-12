import React from 'react';
import App from './App';
import StepCountsGraph from './components/LinePLot/LineGraph';
import { ThemeProvider } from "./contexts/ProvideContext";
import { useState, useEffect } from 'react';
import Togglebutton from './utils/Togglebutton';
import Navbar from './components/Navbar/Navbar';
import TauArcComponent from './calorietracker.jsx';
function Sup() {
  const [themeMode, setThemeMode] = useState('light');
  const [isloading, setIsloading] = useState(true);
  function makefalse() {
    console.log("makefalse")
    setIsloading(false)
  }
  const darkTheme = () => {
    setThemeMode('dark');
  }
  const lightTheme = () => {
    setThemeMode('light');
  }
  useEffect(() => { }, [themeMode, isloading]);
 
  return (

    <ThemeProvider value={{ themeMode, darkTheme, lightTheme }}>
      <div >
        {/* <img src="../public/logo_hl.png" alt="" style={{ height: "100px" }} /> */}
        <Navbar />
        <App isloading={ isloading} changer={makefalse} />
        <StepCountsGraph />
      </div>
      {/* <Togglebutton /> */}
      <TauArcComponent width={100} />
    </ThemeProvider>
  );

}

export default Sup;

