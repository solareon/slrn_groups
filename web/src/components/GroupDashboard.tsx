import React, { useState } from 'react';
import CreateGroup from "./CreateGroup";
import { Group } from '../types/Group';
import { usePlayerDataStore } from '../storage/PlayerDataStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faList, faTrash, faUserGroup } from '@fortawesome/free-solid-svg-icons';


const GroupDashboard = ({ groups, createGroup }) => {
  const { playerData } = usePlayerDataStore();
  const [ showCreateGroup, setShowCreateGroup ] = useState(false);
  const inGroup = groups.some(group => group.members.some(member => member.Player === playerData.source));

  return (
    <div className="p-2 bg-neutral-400">
      {!inGroup && (
        <div>
          <div className="text-md font-bold text-text-primary-light dark:text-text-primary-dark">
            Join a group or browse groups currently busy
          </div>
          <button
            onClick={() => setShowCreateGroup(true)}
            className="px-4 py-2 m-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Group
          </button>
        </div>
      )}
      <div className="mx-auto bg-white p-2 rounded shadow-md">
        {Object.keys(groups).map((key) => {
          const element = groups[key];
          let isLeader = element.leader === playerData.source;
          let isMember = element.members.some((member) => member.Player === playerData.source);

          return (
            <div key={element.id} className="flex flex-row grid grid-rows-2 bg-neutral-700 rounded-md m-2 p-2">
              <div className="flex justify-start row-span-1">
                <FontAwesomeIcon icon={faUsers} size="xl" /> &nbsp;{element.GName}
              </div>
              <div className="flex justify-end row-span-1">
                {isLeader ? (
                  <>
                    <div className="items-center text-lg">
                      <FontAwesomeIcon icon={faList} size="xl" className="px-1" />
                      <FontAwesomeIcon icon={faTrash} size="xl" className="px-1" />
                      <FontAwesomeIcon icon={faUserGroup} size="xl" className="px-1" />
                      {element.Users}
                    </div>
                  </>
                ) : (
                  <div className="items-center text-lg">
                    {isMember ? (
                      <>
                        <FontAwesomeIcon icon={faTrash} size="xl" className="px-1" />
                        <FontAwesomeIcon icon={faUserGroup} size="xl" /> {element.Users}
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faUserGroup} size="xl" /> {element.Users}
                      </>
                    )}
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
            createGroup(groupData);
            setShowCreateGroup(false);
          }}
          onClose={() => setShowCreateGroup(false)}
        />
      )}
    </div>
  );
};

export default GroupDashboard;
