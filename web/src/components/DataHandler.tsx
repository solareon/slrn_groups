import React from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { usePlayerDataStore } from "../storage/PlayerDataStore";
import { useGroupStore } from "../storage/GroupStore";
import { useGroupJobStepStore } from "../storage/GroupJobStepStore";

const DataHandler: React.FC = () => {
  const { setPlayerData } = usePlayerDataStore();
  const { setGroups } = useGroupStore();
  const { groupJobSteps, setGroupJobSteps } = useGroupJobStepStore();

  useNuiEvent("setPlayerData", setPlayerData);
  useNuiEvent("setGroups", setGroups);
  useNuiEvent("setGroupJobSteps", setGroupJobSteps);
  useNuiEvent("updateGroupJobStep", (data: { id: string; isDone: boolean }) => {
    if (!data || !data.id) {
      console.error("Invalid updateGroupJobStep data", data);
      return;
    }
    setGroupJobSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === data.id ? { ...step, isDone: data.isDone } : step
      )
    );
  });

  return null; // This component doesn't render anything
};

export default DataHandler;
