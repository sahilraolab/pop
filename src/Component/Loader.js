import React from 'react';
import '../style/Loader.css';

const Loader = () => {
  return (
    <div className="loader-container" aria-live="polite" aria-busy="true">
      <div className="loader" role="status" aria-label="Loading, please wait..."></div>
    </div>
  );
};

export default Loader;
