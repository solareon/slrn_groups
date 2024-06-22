import React from 'react';

const JoinGroup: React.FC = () => {
  return (
    <div className="phone-menu-body hidden" id="jobcenter-box-new-join">
      <div className="phone-menu-main">
        <input className="phone-menu-text jobcenter-input-join-password" type="password" />
        <i className="fas fa-lock" id="phone-menu-icon"></i>
        <span className="phone-menu-title">Enter Password</span>
        <p> </p>
        <div className="phone-menu-button phone-menu-cancel" id="box-new-cancel">Cancel</div>
        <div className="phone-menu-button phone-menu-accept" id="jobcenter-submit-join-group">Join</div>
      </div>
    </div>
  );
};

export default JoinGroup;
