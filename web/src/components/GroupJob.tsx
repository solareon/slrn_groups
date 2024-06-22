import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { useNuiEvent } from '../hooks/useNuiEvent';
import { GroupJobStep } from '../types/GroupJobStep';
import { useGroupJobStepStore } from '../storage/GroupJobStepStore';

interface GroupJobProps {
  initialSteps: GroupJobStep[];
}

const GroupJob: React.FC<GroupJobProps> = () => {
  const { groupJobSteps } = useGroupJobStepStore();
  const [steps, setSteps] = useState<GroupJobStep[]>(groupJobSteps);

  useNuiEvent('updateGroupJobStep', (data: { id: string; isDone: boolean }) => {
    if (!data || !data.id) {
      console.error('Invalid updateGroupJobStep data', data);
      return;
    }
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === data.id ? { ...step, isDone: data.isDone } : step
      )
    );
  });

  return (
    <div className='flex justify-center items-center h-screen bg-gray-900'>
      <div className='w-full max-w-md bg-gray-800 text-white rounded-lg shadow-md p-6'>
        <div className='relative border-l border-gray-700 ml-4 pl-4'>
          {steps.map((step) => (
            <div key={step.id} className='mb-6 flex items-center'>
              <span className='absolute left-0 transform -translate-x-1/2 bg-gray-900 border border-gray-700 w-6 h-6 rounded-full flex items-center justify-center'>
                <FontAwesomeIcon
                  icon={faCircle}
                  className={step.isDone ? 'text-green-500' : 'text-gray-500'}
                />
              </span>
              <div className='ml-8'>
                <div className='text-sm text-gray-400'>
                  {step.isDone ? '1 / 1' : '0 / 1'}
                </div>
                <div>{step.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupJob;
