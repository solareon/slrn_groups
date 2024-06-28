import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTrash, faCrown } from '@fortawesome/free-solid-svg-icons';
import { usePlayerDataStore } from '../storage/PlayerDataStore';
import { useGroupStore } from '../storage/GroupStore';

const PlayerList: React.FC = ({ onClose, fetchNui }) => {
  const { playerData } = usePlayerDataStore();
  const { currentGroup, isLeader } = useGroupStore();

  const removeGroupMember = (member) => {
    fetchNui('removeGroupMember', member.playerId);
  };

  const promoteGroupMember = (member) => {
    fetchNuie('promoteGroupMember', member.playerId);
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center'>
      <div className='bg-background border border-primary w-11/12 rounded-md shadow-md'>
        <div className='p-4 rounded-t-md'>
          <h2 className='text-2xl font-semibold'>Group Members</h2>
          <h3 className='text-xl'>{currentGroup.name}</h3>
        </div>
        <div className='m-4'>
          {currentGroup.map((member, index) => {
            return (
              <div
                key={index}
                className='flex p-3 items-center rounded-md my-2 gap-x-2 bg-secondary'
              >
                <FontAwesomeIcon icon={faUser} size="xl" />
                <>
                { (isLeader && member.playerId !== playerData.source) && (
                  <>
                    <FontAwesomeIcon
                      icon={faTrash}
                      className='self-right hover:text-danger'
                      size="xl"
                      onClick={() => removeGroupMember(member)}
                    />
                    <FontAwesomeIcon
                      icon={faCrown}
                      className='self-right hover:text-success'
                      size="xl"
                      onClick={() => promoteGroupMember(member)}
                    />
                  </>
                )}
                </>
                <span className='text-xl'>{member.name}</span>
              </div>
            );
          })}
        </div>
        <div className='pb-4 px-4 rounded-b-md'>
          <button
          className='w-full py-2 bg-secondary hover:bg-accent rounded-lg'
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
