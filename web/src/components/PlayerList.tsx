import React from 'react';

const PlayerList: React.FC = () => {
  return (
    <div className="phone-menu-body hidden" id="jobcenter-box-new-player-name">
      <div className="jobcenter-playerlist">
        <div className="jobcenter-playerlist-header">Members</div>
        <div className="phone-new-box-main" id="phone-new-box-main-playername"></div>
        <div className="phone-menu-button jobcenter-playerlist-leave" id="box-new-cancel">RETURN</div>
      </div>
    </div>
  );
};

export default PlayerList;
