import React, { useEffect } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { usePlayerDataStore } from "../storage/PlayerDataStore";
import { useGroupStore } from "../storage/GroupStore";
import { useGroupJobStepStore } from "../storage/GroupJobStepStore";

const DataHandler: React.FC = () => {
  const { setPlayerData } = usePlayerDataStore();
  const { setGroups, setIsLeader, setCurrentGroup, setInGroup } = useGroupStore();
  const { setGroupJobSteps } = useGroupJobStepStore();

  useNuiEvent("setPlayerData", setPlayerData);
  useNuiEvent("setGroups", setGroups);
  useNuiEvent("setGroupJobSteps", setGroupJobSteps);
  useNuiEvent("setCurrentGroup", setCurrentGroup);
  useNuiEvent("setInGroup", setInGroup);
  useNuiEvent("updateGroupJobStep", (data: { id: string; isDone: boolean }) => { // might be unused now due to updates
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
  useNuiEvent("setupApp", (data) => {
    if (!data) {
      console.error("Invalid setupApp data", data);
      return;
    }
    setPlayerData(data.playerData);
    setGroups(data.groups);
    setCurrentGroup(data.groupData);
    setInGroup(data.inGroup);
    setGroupJobSteps(data.groupJobSteps);
    if (data.groupData && data.playerData) {
      setIsLeader(data.groupData.some((member) => member.playerId === data.playerData.source && member.isLeader));
    }
  });

  return null; // This component doesn't render anything
};

export default DataHandler;
