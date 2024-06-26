import React, { useState, useEffect } from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { GroupJobStep } from "../types/GroupJobStep";
import { useGroupJobStepStore } from "../storage/GroupJobStepStore";
import { useGroupStore } from "../storage/GroupStore";
import { usePlayerDataStore } from "../storage/PlayerDataStore";

interface GroupJobProps {
  initialSteps: GroupJobStep[];
}

const GroupJob: React.FC<GroupJobProps> = ({ setCurrentPage }) => {
  const { groups } = useGroupStore();
  const { playerData } = usePlayerDataStore();
  const { groupJobSteps, getGroupJobSteps } = useGroupJobStepStore();
  const [steps, setSteps] = useState<GroupJobStep[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    getGroupJobSteps();
  }, []);

  useEffect(() => {
    setSteps(groupJobSteps);
  }, [groupJobSteps]);

  const inGroup = groups.some((group) =>
    group.members.some((member) => member.Player === playerData.source)
  );

  const handleConfirm = () => {
    // Add your confirm action here
    setIsDialogOpen(false);
  };

  return (
    <div className="flex items-center">
      <div className="w-full p-2">
        <div className="mb-4 flex gap-x-2">
          <button
            onClick={() => setCurrentPage("GroupDashboard")}
            className={`p-2 w-1/2 bg-primary rounded
              ${!inGroup ? "cursor-not-allowed" : "hover:bg-secondary"}`}
          >
            Show Groups
          </button>
          <button
            onClick={() => setIsDialogOpen(true)}
            className={`px-4 py-2 w-1/2 bg-primary rounded
              ${!inGroup ? "cursor-not-allowed" : "hover:bg-danger"}`}
          >
            Leave Group
          </button>
        </div>
        {steps.length > 0 ? (
          <h2 className="mb-4">Here are the current group tasks</h2>
        ) : (
          <h2 className="mb-4">No tasks available</h2>
        )}
        <div className="w-full p-2">
          <div className="relative border-l border-accent ml-4 pl-4">
            {steps.map((step) => (
              <div key={step.id} className="mb-6 flex items-center">
                <span className="absolute left-0 transform -translate-x-1/2 bg-background border border-accent w-6 h-6 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faCircle}
                    className={step.isDone ? "text-success" : ""}
                  />
                </span>
                <div className="ml-8">
                  <div className="text-sm">
                    {step.isDone ? "1 / 1" : "0 / 1"}
                  </div>
                  <div>{step.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {isDialogOpen && (
          <ConfirmationDialog
            onClose={() => setIsDialogOpen(false)}
            onConfirm={handleConfirm}
          />
        )}
      </div>
    </div>
  );
};

export default GroupJob;
