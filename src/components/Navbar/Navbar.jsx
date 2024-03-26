import React from 'react'; // Importing React library to use JSX syntax and create React components
import Togglebutton from '../../utils/Togglebutton'; // Importing the Togglebutton component from a relative path

// Defining the Navbar functional component
const Navbar = () => {
  // Returning JSX for the Navbar component
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: '#ffffff' }}>
      {/* Creating a navigation bar with fixed position, using inline styles */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px' }}>
        {/* Creating a div element with flex display, aligning items center, and justifying content space-between */}
        <img src="./logo_hl.png" alt="" style={{ height: '7vw' }} />
        <Togglebutton /> {/* Rendering the Togglebutton component */}
      </div>
    </nav>
  );
}

export default Navbar; // Exporting the Navbar component to be used elsewhere in the application
