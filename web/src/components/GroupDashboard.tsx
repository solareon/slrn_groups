import React, { useState } from 'react';
import CreateGroup from "./CreateGroup";
import { Group } from '../types/Group';
import { usePlayerDataStore } from '../storage/PlayerDataStore';

const GroupDashboard = ({ groups, createGroup }) => {
  const { playerData } = usePlayerDataStore();
  const [ showCreateGroup, setShowCreateGroup ] = useState(false);

  return (
    <div className="p-6 bg-neutral-400">
      <div className="text-md font-bold text-text-primary-light dark:text-text-primary-dark">
      Join a group or browse groups currently busy</div>
      <button
          onClick={() => setShowCreateGroup(true)}
          className="px-4 py-2 m-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Group
        </button>
      <div className="max-w-4xl mx-auto bg-white p-4 rounded shadow-md">
      {Object.keys(groups).map((key) => {
        const element = groups[key];
        let isLeader = element.leader === playerData.source;
        let isMember = element.members.some(member => member.Player === playerData.source);

        return (
          <div key={element.id} className="jobcenter-div-job-group">
            <div className="jobcenter-div-job-group-image">
              <i className="fas fa-users"></i>
            </div>
            <div className="jobcenter-div-job-group-body-main">
              {element.GName}
              {isLeader ? (
                <>
                  <i id="jobcenter-block-grouped" data-id={element.id} data-pass={element.GPass} className="fas fa-sign-in-alt"></i>
                  <div className="jobcenter-option-class-body">
                    <i id="jobcenter-list-group" data-id={element.id} style={{ paddingRight: '5%' }} className="fas fa-list-ul"></i>
                    <i id="jobcenter-delete-group" data-delete={element.id} className="fas fa-trash-alt"></i>
                    <i style={{ paddingLeft: '5%', paddingRight: '5%' }} className="fas fa-user-friends"> {element.Users}</i>
                  </div>
                </>
              ) : (
                <div className="jobcenter-option-class-body">
                  {isMember ? (
                    <>
                      <i id="jobcenter-leave-grouped" data-id={element.id} data-pass={element.GPass} className="fas fa-sign-out-alt" style={{ transform: 'rotate(180deg)' }}></i>
                      <i id="jobcenter-list-group" data-id={element.id} style={{ paddingRight: '5%' }} className="fas fa-list-ul"></i>
                    </>
                  ) : (
                    <i id="jobcenter-join-grouped" data-id={element.id} data-pass={element.GPass} className="fas fa-sign-in-alt"></i>
                  )}
                  <i style={{ paddingLeft: '5%', paddingRight: '5%' }} className="fas fa-user-friends">{element.Users}</i>
                </div>
              )}
            </div>
          </div>
        );
      })}
      </div>
      {showCreateGroup && (
                <CreateGroup
                    onSelect={(groupData) => {
                        handleCreateGroup(groupData);
                        setShowCreateGroup(false);
                    }}
                    onClose={() => setShowCreateGroup(false)}
                />
            )}
    </div>
  );
};

export default GroupDashboard;
