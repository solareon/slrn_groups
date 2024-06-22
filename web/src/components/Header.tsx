import React from 'react';

const Header: React.FC = () => {
  return (
    <div>
      <div className='header'>
        <div className='title'>Join a group or browse groups currently busy</div>
      </div>
      <div className='jobcenter-header'>
        <div className='jobcenter-btn-create-group'>CREATE GROUP</div>
      </div>
    </div>
  );
};

export default Header;
