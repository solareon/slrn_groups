import React, { useEffect } from "react";
import { Group } from "../types/Group";
import { GroupJobStep } from "../types/GroupJobStep";
import { Member } from "../types/Member";
import { PlayerData } from "../types/PlayerData";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { usePlayerDataStore } from "../storage/PlayerDataStore";
import { useGroupStore } from "../storage/GroupStore";
import { useGroupJobStepStore } from "../storage/GroupJobStepStore";

const DataHandler: React.FC = () => {
  const { setPlayerData } = usePlayerDataStore();
  const { setGroups, setIsLeader, setCurrentGroup, setInGroup } =
    useGroupStore();
  const { setGroupJobSteps } = useGroupJobStepStore();

  useNuiEvent("setPlayerData", setPlayerData);
  useNuiEvent("setGroups", setGroups);
  useNuiEvent("setGroupJobSteps", setGroupJobSteps);
  useNuiEvent("setCurrentGroup", setCurrentGroup);
  useNuiEvent("setInGroup", setInGroup);
  useNuiEvent(
    "setupApp",
    (data: {
      playerData: PlayerData;
      groups: Group[];
      groupData: Member[];
      inGroup: number | null;
      groupJobSteps: GroupJobStep[];
    }) => {
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
        setIsLeader(
          data.groupData.some(
            (member) =>
              member.playerId === data.playerData.source && member.isLeader
          )
        );
      }
    }
  );

  return null; // This component doesn't render anything
};

export default DataHandler;
