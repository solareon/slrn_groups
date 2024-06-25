import React, { useState, useEffect } from 'react';

const JoinGroup: React.FC<any> = ({
  groupId,
  groupName,
  onSelect,
  onClose,
}) => {
  const [password, setPassword] = useState('');
  const [disabledReason, setDisabledReason] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  useEffect(() => {
    let reason = '';
    if (password === '') {
      reason = 'Password is required';
    }
    setDisabledReason(reason);
    setIsSubmitDisabled(reason !== '');
  }, [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const groupData = { groupId, password };
    onSelect(groupData);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center'>
      <div className='bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-white text-2xl'>Join Group</h2>
          <button onClick={onClose} className='text-white text-lg'>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='groupName' className='block text-white mb-2'>
              Group Name
            </label>
            <div className='w-full p-2 rounded bg-gray-700 text-white'>
              {groupName}
            </div>
          </div>
          <div className='mb-4'>
            <label htmlFor='password' className='block text-white mb-2'>
              Password
            </label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 rounded bg-gray-700 text-white'
            />
          </div>
          <div className='flex justify-end'>
            <button
              type='button'
              onClick={onClose}
              className='mr-2 px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600'
            >
              Cancel
            </button>
            <button
              type='submit'
              className={`px-4 py-2 rounded text-white ${
                isSubmitDisabled
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-400'
              }`}
              disabled={isSubmitDisabled}
            >
              Submit
            </button>
          </div>
          {disabledReason ? (
            <div className='mt-4 text-red-500'>{disabledReason}</div>
          ) : (
            <div className='mt-4'>&nbsp;</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default JoinGroup;
