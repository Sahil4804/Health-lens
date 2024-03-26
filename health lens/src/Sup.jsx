import React from 'react';
import App from './App';
import StepCountsGraph from './components/LinePLot/LineGraph';
import { ThemeProvider } from "./contexts/ProvideContext";
import { useState, useEffect } from 'react';
import Togglebutton from './utils/Togglebutton';
import Navbar from './components/Navbar/Navbar';
function Sup() {
  const [themeMode, setThemeMode] = useState('light');
  const darkTheme = () => {
    setThemeMode('dark');
  }
  const lightTheme = () => {
    setThemeMode('light');
  }
  useEffect(() => { }, [themeMode]);
  return (
    <ThemeProvider value={{ themeMode, darkTheme, lightTheme }}>
      <div>
        {/* <img src="../public/logo_hl.png" alt="" style={{ height: "100px" }} /> */}
        <Navbar />
        <App />
        <StepCountsGraph />
      </div>
      {/* <Togglebutton /> */}
    </ThemeProvider>
  );
}

export default Sup;

