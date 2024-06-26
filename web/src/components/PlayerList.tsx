import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTrash } from '@fortawesome/free-solid-svg-icons';
import { usePlayerDataStore } from '../storage/PlayerDataStore';
import { useGroupStore } from '../storage/GroupStore';

const PlayerList: React.FC = ({ onClose }) => {
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
    <div className='fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center'>
      <div className='bg-background-primary-light dark:bg-background-primary-dark text-white w-full max-w-md rounded-md shadow-md'>
        <div className='p-4 border-b bg-background-primary-light dark:bg-background-primary-dark border-border-primary-light dark:border-border-primary-dark rounded-t-md'>
          <h2 className='text-2xl text-text-primary-light dark:text-text-primary-dark font-semibold'>Group Members</h2>
          <h3 className='text-xl text-text-secondary-light dark:text-text-secondary-dark'>{currentGroup.GName}</h3>
        </div>
        <div className='p-2 bg-background-secondary-light dark:bg-background-secondary-dark'>
          {currentGroup.members.map((member, index) => {
            return (
              <div
                key={index}
                className='flex items-center p-2 bg-background-highlight-light dark:bg-background-highlight-dark rounded-md my-2 gap-x-2'
              >
                <FontAwesomeIcon icon={faUser} className='text-text-primary-light dark:text-text-primary-dark' />
                <>
                { isLeader && member.Player !== playerData.source &&
                  <FontAwesomeIcon
                    icon={faTrash}
                    className='self-right text-text-primary-light dark:text-text-primary-dark hover:text-button-danger-light dark:hover:text-button-danger-dark'
                    onClick={() => removeGroupMember(member)}
                  />
                }
                </>
                <span className='text-text-primary-light dark:text-text-primary-dark'>{member.name}</span>
              </div>
            );
          })}
        </div>
        <div className='pb-4 px-4 bg-background-secondary-light dark:bg-background-secondary-dark rounded-b-md'>
          <button
          className='w-full py-2 bg-button-primary-light dark:bg-button-primary-dark hover:bg-button-hover-light dark:hover:bg-button-hover-dark text-text-primary-light dark:text-text-primary-dark rounded-lg'
          onClick={onClose}
          >
            RETURN
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerList;
