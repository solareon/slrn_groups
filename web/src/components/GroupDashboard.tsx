import React, { useState } from "react";
import CreateGroup from "./CreateGroup";
import JoinGroup from "./JoinGroup";
import PlayerList from "./PlayerList";
import ConfirmationDialog from './ConfirmationDialog';
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

const GroupDashboard = ({ setCurrentPage }) => {
  const { groups, setGroups } = useGroupStore();
  const { playerData } = usePlayerDataStore();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showPlayerList, setShowPlayerList] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const inGroup = groups.some((group) =>
    group.members.some((member) => member.Player === playerData.source)
  );

  const handleConfirm = () => {
    // Add your confirm action here
    setIsDialogOpen(false);
  };

  const createGroup = (groupData) => {
    console.log(groupData);
    const newGroup = {
      id: groups.length + 1,
      status: "open",
      GName: groupData.groupName,
      GPass: groupData.password,
      leader: playerData.source,
      members: [
        {
          name: playerData.name,
          CID: playerData.citizenId,
          Player: playerData.source,
        },
      ],
      stage: [],
      ScriptCreated: false,
    };
    console.log(newGroup);
    setGroups([...groups, newGroup]);
  };

  const joinGroup = (groupData) => {
    console.log(groupData);
  };

  const leaveGroup = () => {
    console.log("Leaving current group");
    setIsDialogOpen(true);
  };

  const removeGroup = (groupData) => {
    console.log(groupData);
  };

  const renderIcons = (isLeader, isMember, element) => {
    return (
      <>
        <FontAwesomeIcon
          icon={faList}
          className="mx-1 text-button-primary-light dark:text-button-primary-dark hover:text-button-hover-light dark:hover:text-text-hover-dark"
          onClick={() => setShowPlayerList(true)}
        />
        {isLeader && (
          <FontAwesomeIcon
            icon={faTrash}
            className="mx-1 text-button-primary-light dark:text-button-primary-dark hover:text-button-danger-light dark:hover:text-text-danger-dark"
            onClick={() => removeGroup(element)}
          />
        )}
        {isMember && !isLeader && (
          <FontAwesomeIcon
            icon={faRightFromBracket}
            className="mx-1 text-button-primary-light dark:text-button-primary-dark hover:text-button-danger-light dark:hover:text-text-danger-dark"
            onClick={() => leaveGroup(element)}
          />
        )}
      </>
    );
  };

  return (
    <div className="flex items-center select-none">
      <div className="w-full bg-background-primary-light dark:bg-background-primary-dark text-white rounded-lg p-4">
        <div className="mb-4">
          <div className="text-md font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Create a group or join an existing group
          </div>
        </div>
        <div className="mb-4 flex gap-x-2">
          <button
            onClick={() => setShowCreateGroup(true)}
            disabled={inGroup}
            className={`px-4 py-2 w-1/2 bg-button-primary-light dark:bg-button-primary-dark
              text-text-primary-light dark:text-text-primary-dark rounded
              ${
                inGroup
                  ? "cursor-not-allowed"
                  : "hover:bg-button-success-light dark:hover:bg-button-success-dark"
              }`}
          >
            Create Group
          </button>
          <button
            onClick={() => setIsDialogOpen(true)}
            disabled={!inGroup}
            className={`px-4 py-2 w-1/2 bg-button-primary-light dark:bg-button-primary-dark
              text-text-primary-light dark:text-text-primary-dark rounded
              ${
                !inGroup
                  ? "cursor-not-allowed"
                  : "hover:bg-button-danger-light dark:hover:bg-button-danger-dark"
              }`}
          >
            Leave Group
          </button>
        </div>
        <div className="bg-background-secondary-light dark:bg-background-secondary-dark p-4 rounded-lg shadow-inner">
          {Object.keys(groups).map((key) => {
            const element = groups[key];
            let isLeader = element.leader === playerData.source;
            let isMember = element.members.some(
              (member) => member.Player === playerData.source
            );

            return (
              <div
                key={element.id}
                className="flex justify-between items-center text-text-primary-light dark:text-text-primary-dark bg-background-highlight-light
                  dark:bg-background-highlight-dark hover:bg-background-hover-light dark:hover:bg-background-hover-dark p-3 mb-2 rounded-md"
                onClick={() => {
                  if (!inGroup) {
                    setSelectedGroup(element);
                  }
                }}
              >
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="text-button-primary-light dark:text-button-primary-dark mr-2"
                  />
                  <span>{element.GName}</span>
                </div>
                <div className="flex items-center">
                  <>
                    {isLeader ||
                      (isMember && (
                        <div className="flex items-center">
                          {renderIcons(isLeader, isMember, element)}
                        </div>
                      ))}
                    <FontAwesomeIcon
                      icon={faUserGroup}
                      className="text-button-primary-light dark:text-button-primary-dark"
                    />
                    <span className="mx-2 font-semibold">
                      {element.members.length}
                    </span>
                  </>
                </div>
              </div>
            );
          })}
        </div>
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
          <PlayerList onClose={() => setShowPlayerList(false)} />

        )}
        {isDialogOpen && (
          <ConfirmationDialog
          onClose={() => setIsDialogOpen(false)}
          onConfirm={handleConfirm}
        />)}
      </div>
    </div>
  );
};

export default GroupDashboard;
