import React from 'react';

const RefreshGreenButton = React.memo(({ onClick }: { onClick: () => void }) => (
  <button
    style={{
      position: 'absolute',
      top: 88,
      left: 32,
      zIndex: 100,
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      background: 'linear-gradient(90deg, #2cc990, #18b48a)',
      color: '#fff',
      fontWeight: '600',
      fontSize: '0.95rem',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
    }}
    onClick={onClick}
    title="Refresh green rigid bodies"
  >
    Refresh Greens
  </button>
));

export default RefreshGreenButton;
