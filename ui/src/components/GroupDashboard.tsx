import React, { useState } from "react";
import CreateGroup from "./CreateGroup";
import JoinGroup from "./JoinGroup";
import PlayerList from "./PlayerList";
import ConfirmationDialog from "./ConfirmationDialog";
import { Group } from "../types/Group";
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

const GroupDashboard = ({ setCurrentPage, fetchNui }) => {
  const { currentGroups, currentGroup, inGroup, isLeader } = useGroupStore();
  const { playerData } = usePlayerDataStore();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showPlayerList, setShowPlayerList] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmation, setConfirmation] = useState({ message: null, type: null });

  const handleConfirm = () => {
    fetchNui(confirmation.type);
    setIsDialogOpen(false);
  };

  const createGroup = (groupData) => {
    fetchNui("createGroup", {name: groupData.groupName, pass: groupData.password});
  };

  const joinGroup = (groupData) => {
    fetchNui("joinGroup", {id: groupData.groupId, pass: groupData.password});
  };

  const leaveGroup = () => {
    setConfirmation({message: "Leave the group?", type: "leaveGroup"})
    setIsDialogOpen(true);
  };

  const deleteGroup = (groupData) => {
    setConfirmation({message: "Disband the group?", type: "deleteGroup"})
    setIsDialogOpen(true);
  };

  const renderIcons = (isLeader, isMember, group) => {
    return (
      <>
        <div className="flex items-center">
          <FontAwesomeIcon
            icon={faList}
            className="mx-1 hover:text-background"
            size="xl"
            onClick={() => setShowPlayerList(true)}
          />
          {isLeader && (
            <FontAwesomeIcon
              icon={faTrash}
              className="mx-1 hover:text-danger"
              size="xl"
              onClick={() => deleteGroup(group)}
            />
          )}
          {isMember && !isLeader && (
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className="mx-1 hover:text-danger"
              onClick={() => leaveGroup(group)}
              size="xl"
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
            className={`py-2 w-1/3 text-lg bg-primary rounded
              ${inGroup ? "cursor-not-allowed" : "hover:bg-secondary"}`}
          >
            Create Group
          </button>
          <button
            onClick={() => setCurrentPage("GroupJob")}
            disabled={!inGroup}
            className={`py-2 w-1/3 text-lg bg-primary rounded
              ${!inGroup ? "cursor-not-allowed" : "hover:bg-secondary"}`}
          >
            Show Tasks
          </button>
          <button
            onClick={() => leaveGroup()}
            disabled={!inGroup}
            className={`py-2 w-1/3 text-lg bg-primary rounded
              ${!inGroup ? "cursor-not-allowed" : "hover:bg-danger"}`}
          >
            Leave Group
          </button>
        </div>
        <h2 className="mb-4">
        {currentGroups?.length > 0 ? (
          'Create a group or join an existing group below'
          ) : (
          'Create a group to get started'
        )}
        </h2>
        {currentGroups && currentGroups.length > 0 && (
          <>
          {currentGroups.map((group) => {
              let isMember = group.id === inGroup;

              return (
                // <div className="bg-secondary p-4 rounded-lg shadow-inner">
                <div
                  key={group.id}
                  className={`p-4 bg-secondary rounded-md flex justify-between items-center mb-2 ${
                    !inGroup && "hover:bg-accent"
                  }`}
                  onClick={() => {
                    if (!inGroup) {
                      setSelectedGroup(group);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faUsers} className="mr-2" size="xl"/>
                    <span className="text-2xl font-bold">{group.name}</span>
                  </div>
                  <div className="flex items-center">
                    <>
                      {isMember && renderIcons(isLeader, isMember, group)}
                      <FontAwesomeIcon icon={faUserGroup} size="xl"/>
                      <span className="mx-2 font-semibold">
                        {group.memberCount}
                      </span>
                    </>
                  </div>
                </div>
                // </div>
              );
            })}
          </>
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
            groupName={selectedGroup.name}
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
            fetchNui={fetchNui}
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
