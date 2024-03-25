import React from 'react'
import useTheme from '../contexts/ProvideContext'


function Togglebutton() {

    const {themeMode,darkTheme,lightTheme} = useTheme();

  return (
    <>
      <button
        style={{
          backgroundColor: themeMode === "light" ? "#ffffff" : "#333333",
          color: themeMode === "light" ? "#333333" : "#ffffff",
          border: "1px solid #ccc",
          borderRadius: "5px",
          padding: "8px 16px",
          cursor: "pointer",
        }}
        onClick={themeMode === "light" ? darkTheme : lightTheme}
      >
        {themeMode === "light" ? "Dark" : "Light"}
      </button>
    </>
  );
}

export default Togglebutton
