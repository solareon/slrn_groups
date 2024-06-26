import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTrash, faCrown } from '@fortawesome/free-solid-svg-icons';
import { usePlayerDataStore } from '../storage/PlayerDataStore';
import { useGroupStore } from '../storage/GroupStore';

const PlayerList: React.FC = ({ onClose }) => {
  const { playerData } = usePlayerDataStore();
  const { currentGroup } = useGroupStore();

  const removeGroupMember = (member) => {
    console.log('Remove Member', member);
  };

  const promoteGroupMember = (member) => {
    console.log('Promote Member', member);
  }

  const isLeader = currentGroup.members.find(member => member.Player === playerData.source) && true;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center'>
      <div className='bg-background border border-primary w-full max-w-md rounded-md shadow-md'>
        <div className='p-4 rounded-t-md'>
          <h2 className='text-2xl font-semibold'>Group Members</h2>
          <h3 className='text-xl'>{currentGroup.GName}</h3>
        </div>
        <div className='p-2'>
          {currentGroup.members.map((member, index) => {
            return (
              <div
                key={index}
                className='flex items-center p-2 rounded-md my-2 gap-x-2 bg-secondary'
              >
                <FontAwesomeIcon icon={faUser} className='' />
                <>
                { (isLeader && member.Player !== playerData.source) && (
                  <>
                    <FontAwesomeIcon
                      icon={faTrash}
                      className='self-right hover:text-danger'
                      onClick={() => removeGroupMember(member)}
                    />
                    <FontAwesomeIcon
                      icon={faCrown}
                      className='self-right hover:text-success'
                      onClick={() => promoteGroupMember(member)}
                    />
                  </>
                )}
                </>
                <span className=''>{member.name}</span>
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
