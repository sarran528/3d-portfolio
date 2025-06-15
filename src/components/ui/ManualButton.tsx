import React from 'react';

const ManualButton = React.memo(({ onClick }: { onClick: () => void }) => (
  <button
    style={{
      position: 'absolute',
      top: 32,
      left: 32,
      zIndex: 100,
      padding: '16px 32px',
      borderRadius: '8px',
      border: 'none',
      background: 'linear-gradient(90deg, #ff5e3a, #ff9d4d, #74c0fc)',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '1.2rem',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}
    onClick={onClick}
  >
    Manual
  </button>
));

export default ManualButton;