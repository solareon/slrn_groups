import React, { useState, useEffect } from "react";
import CreateGroup from "./CreateGroup";
import JoinGroup from "./JoinGroup";
import PlayerList from "./PlayerList";
import ConfirmationDialog from "./ConfirmationDialog";
import { Group } from "../types/Group";
import { fetchReactNui } from "../utils/fetchReactNui";
import { usePlayerDataStore } from "../storage/PlayerDataStore";
import { useGroupStore } from "../storage/GroupStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faList,
  faTrash,
  faUserGroup,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const GroupDashboard = ({ setCurrentPage }) => {
  const { currentGroups, currentGroup, setCurrentGroup, inGroup, setInGroup } =
    useGroupStore();
  const { playerData } = usePlayerDataStore();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showPlayerList, setShowPlayerList] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmation, setConfirmation] = useState({ message: null, type: null });

  useEffect(() => {
    setInGroup(
      currentGroups &&
        currentGroups.length > 0 &&
        currentGroups.some((group) =>
          group.members.some((member) => member.Player === playerData.source)
        )
    );
    setCurrentGroup(
      currentGroups.find((group) =>
        group.members.some((member) => member.Player === playerData.source)
      )
    );
  }, [currentGroups]);

  const handleConfirm = () => {
    fetchReactNui(confirmation.type, {}, {});
    console.log(confirmation);
    setIsDialogOpen(false);
  };

  const createGroup = (groupData) => {
    console.log(groupData);
    fetchReactNui("createGroup", groupData);
  };

  const joinGroup = (groupData) => {
    fetchReactNui("joinGroup", groupData);
    console.log(groupData);
  };

  const leaveGroup = () => {
    setConfirmation({message: "Leave the group?", type: "leaveGroup"})
    setIsDialogOpen(true);
  };

  const removeGroup = (groupData) => {
    setConfirmation({message: "Disband the group?", type: "removeGroup"})
    setIsDialogOpen(true);
    // fetchReactNui("removeGroup", groupData);
    console.log(groupData);
  };

  const renderIcons = (isLeader, isMember, group) => {
    return (
      <>
        <div className="flex items-center">
          <FontAwesomeIcon
            icon={faList}
            className="mx-1 hover:text-background"
            onClick={() => setShowPlayerList(true)}
          />
          {isLeader && (
            <FontAwesomeIcon
              icon={faTrash}
              className="mx-1 hover:text-danger"
              onClick={() => removeGroup(group)}
            />
          )}
          {isMember && !isLeader && (
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className="mx-1 hover:text-danger"
              onClick={() => leaveGroup(group)}
            />
          )}
        </div>
      </>
    );
  };

  return (
    <div className="flex items-center select-none">
      <div className="w-full p-2">
        <div className="mb-4 flex gap-x-2">
          <button
            onClick={() => setShowCreateGroup(true)}
            disabled={inGroup}
            className={`p-2 w-1/3 bg-primary rounded
              ${inGroup ? "cursor-not-allowed" : "hover:bg-secondary"}`}
          >
            Create Group
          </button>
          <button
            onClick={() => setCurrentPage("GroupJob")}
            disabled={!inGroup}
            className={`p-2 w-1/3 bg-primary rounded
              ${!inGroup ? "cursor-not-allowed" : "hover:bg-secondary"}`}
          >
            Show Tasks
          </button>
          <button
            onClick={() => leaveGroup()}
            disabled={!inGroup}
            className={`p-2 w-1/3 bg-primary rounded
              ${!inGroup ? "cursor-not-allowed" : "hover:bg-danger"}`}
          >
            Leave Group
          </button>
        </div>
        {currentGroups?.length > 0 ? (
          <h2 className="mb-4">
            Create a group or join an existing group below
          </h2>
        ) : (
          <h2 className="mb-4">Create a group to get started</h2>
        )}
        {currentGroups && currentGroups.length > 0 && (
          <div className="bg-secondary p-4 rounded-lg shadow-inner">
            {currentGroups.map((group) => {
              let isLeader = group.leader === playerData.source;
              let isMember = group.members.some(
                (member) => member.Player === playerData.source
              );

              return (
                <div
                  key={group.id}
                  className={`flex justify-between items-center p-3 mb-2 rounded-md ${
                    !inGroup && "hover:bg-accent"
                  }`}
                  onClick={() => {
                    if (!inGroup) {
                      setSelectedGroup(group);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faUsers} className="mr-2" />
                    <span>{group.GName}</span>
                  </div>
                  <div className="flex items-center">
                    <>
                      {isMember && renderIcons(isLeader, isMember, group)}
                      <FontAwesomeIcon icon={faUserGroup} className="" />
                      <span className="mx-2 font-semibold">
                        {group.members.length}
                      </span>
                    </>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {showCreateGroup && (
          <CreateGroup
            onSelect={(groupData) => {
              createGroup(groupData);
              setShowCreateGroup(false);
            }}
            onClose={() => setShowCreateGroup(false)}
          />
        )}
        {selectedGroup && (
          <JoinGroup
            groupId={selectedGroup.id}
            groupName={selectedGroup.GName}
            onSelect={(groupData) => {
              joinGroup(groupData);
              setSelectedGroup(null);
            }}
            onClose={() => {
              setSelectedGroup(null);
            }}
          />
        )}
        {showPlayerList && (
          <PlayerList
            onClose={() => setShowPlayerList(false)}
            currentGroup={currentGroup}
          />
        )}
        {isDialogOpen && (
          <ConfirmationDialog
            onClose={() => setIsDialogOpen(false)}
            onConfirm={handleConfirm}
            confirmation={confirmation}
          />
        )}
      </div>
    </div>
  );
};

export default GroupDashboard;
