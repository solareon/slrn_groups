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
            size="lg"
            onClick={() => setShowPlayerList(true)}
          />
          {isLeader && (
            <FontAwesomeIcon
              icon={faTrash}
              className="mx-1 hover:text-danger"
              size="lg"
              onClick={() => deleteGroup(group)}
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
          {!inGroup?(<button
            onClick={() => setShowCreateGroup(true)}
            className={`py-12 w-full text-lg bg-primary transition-all rounded-3xl shadow-sm
              ${inGroup ? "cursor-not-allowed" : "hover:scale-105 hover:shadow-lg"}`}
          >
            Create Group
          </button>):''}
          {inGroup?(<button
            onClick={() => setCurrentPage("GroupJob")}
            className={`py-6 w-1/2 text-lg bg-primary transition-all rounded-2xl shadow-sm
              ${!inGroup ? "cursor-not-allowed" : "hover:scale-105 hover:shadow-lg hover:bg-secondary"}`}
          >
            Show Tasks
          </button>):''}
          {inGroup?(<button
            onClick={() => leaveGroup()}
            className={`py-6 w-1/2 text-lg bg-primary transition-all rounded-2xl shadow-sm
              ${!inGroup ? "cursor-not-allowed" : "hover:bg-danger hover:scale-105 hover:shadow-lg"}`}
          >
            Leave Group
          </button>):''}
        </div>
        <h2 className="mb-4 text-2xl">
        {currentGroups?.length > 0 ? (
          inGroup?'You are already in a group.':'Create a group or join an existing group below'
          ) : (
          'Create a group to get started'
        )}
        </h2>
        {currentGroups && currentGroups.length > 0 && (
          <>
          {currentGroups.map((group, index) => {
              let isMember = group.id === inGroup;

              return (
                <div
                  key={index}
                  className={`p-4 bg-primary rounded-xl flex justify-between items-center mb-2 ${
                    !inGroup && "hover:bg-accent"
                  }`}
                  onClick={() => {
                    if (!inGroup) {
                      setSelectedGroup(group);
                    }
                  }}
                >
                  <div className="flex items-center text-lg">
                    <span>
                      {group.memberCount}
                    </span>
                    <FontAwesomeIcon icon={faUserGroup} className="mx-2 mr-4" size="xs"/>
                    <span className="border-l pl-4">{group.name}</span>
                  </div>
                  <div className="flex items-center">
                    <>
                      {isMember && renderIcons(isLeader, isMember, group)}
                    </>
                  </div>
                </div>
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
