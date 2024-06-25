import React, { useState } from 'react';
import clsx from 'clsx';
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
    setSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === data.id ? { ...step, isDone: data.isDone } : step
      )
    );
  });

  return (
    <div className="jobcenter-Groupjob mt-6">
      {steps.map(step => (
        <div
          key={step.id}
          className={clsx(
            'w-full p-2.5 flex items-center gap-2.5 text-[1.5vh] relative h-auto break-words',
            step.isDone ? 'text-green-500' : 'text-gray-500'
          )}
        >
          <p className="">{step.isDone ? '1 / 1' : '0 / 1'}</p>
          <i className="">{step.name}</i>
        </div>
      ))}
    </div>
  );
};

export default GroupJob;
