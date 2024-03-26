import React from 'react';

const Navbar = () => {
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: '#ffffff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px' }}>
        <img src="../public/logo_hl.png" alt="" style={{ height: '100px' }} />
        <div style={{ textAlign: 'right', fontSize: '14px', color: '#333' }}>
          <p style={{ marginBottom: '5px' }}><strong>Stay motivated!</strong></p>
          <p style={{ marginBottom: '5px' }}><strong>Your health is your wealth.</strong></p>
          <p><strong>Keep up the good work!</strong></p>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
