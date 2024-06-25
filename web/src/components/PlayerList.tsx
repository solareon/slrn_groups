import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTrash } from '@fortawesome/free-solid-svg-icons';
import { usePlayerDataStore } from '../storage/PlayerDataStore';
import { useGroupStore } from '../storage/GroupStore';

const PlayerList: React.FC = ({ setCurrentPage }) => {
  const { playerData } = usePlayerDataStore();
  const { groups, setGroups } = useGroupStore();
  const currentGroup = groups.find((group) =>
    group.members.some((member) => member.Player === playerData.source)
  );
  const isLeader = currentGroup.leader === playerData.source;

  const removeGroupMember = (member) => {
    console.log('Remove Member', member);
  };

  return (
    <div className='flex justify-center items-center h-screen bg-gray-200 dark:bg-gray-900'>
      <div className='w-full bg-gray-400 dark:bg-gray-700 text-white w-80 rounded-lg shadow-md'>
        <div className='p-4 border-b bg-gray-300 dark:bg-gray-600 border-gray-600'>
          <h2 className='text-lg text-black dark:text-white font-semibold'>Group Members</h2>
        </div>
        <div className='p-2'>
          {currentGroup.members.map((member, index) => {
            if (isLeader && member.Player !== playerData.source) {
              return (
                <div
                  key={index}
                  className='flex items-center p-2 bg-gray-200 dark:bg-gray-500 rounded-lg my-2'
                >
                  <div>
                    <FontAwesomeIcon
                      icon={faTrash}
                      className='self-right text-black dark:text-white mr-2'
                      onClick={() => removeGroupMember(member)}
                    />
                    <FontAwesomeIcon icon={faUser} className='text-black dark:text-white mr-3' />
                  </div>
                  <span className='text-black dark:text-white'>{member.name}</span>
                </div>
              );
            }
            return (
              <div
                key={index}
                className='flex items-center p-2 bg-gray-200 dark:bg-gray-500 rounded-lg my-2'
              >
                <FontAwesomeIcon icon={faUser} className='text-black dark:text-white mr-3' />
                <span className='text-black dark:text-white'>{member.name}</span>
              </div>
            );
          })}
        </div>
        <div className='pb-4 px-4'>
          <button
          className='w-full py-2 bg-green-500 hover:bg-green-400 text-black dark:text-white rounded-lg'
          onClick={() => setCurrentPage('GroupDashboard')}
          >
            RETURN
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerList;
