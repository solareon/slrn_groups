import React, { useState, useEffect } from "react";
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

const GroupDashboard = ({ setCurrentPage }) => {
  const { currentGroups, getCurrentGroups } = useGroupStore();
  const { playerData } = usePlayerDataStore();
  const [ groups, setGroups ] = useState<Group[]>([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showPlayerList, setShowPlayerList] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    getCurrentGroups();
  }, []);

  useEffect(() => {
    setGroups(currentGroups);
  }, [currentGroups]);

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
          className="mx-1 hover:text-background"
          onClick={() => setShowPlayerList(true)}
        />
        {isLeader && (
          <FontAwesomeIcon
            icon={faTrash}
            className="mx-1 hover:text-danger"
            onClick={() => removeGroup(element)}
          />
        )}
        {isMember && !isLeader && (
          <FontAwesomeIcon
            icon={faRightFromBracket}
            className="mx-1 hover:text-danger"
            onClick={() => leaveGroup(element)}
          />
        )}
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
            onClick={() => setIsDialogOpen(true)}
            disabled={!inGroup}
            className={`p-2 w-1/3 bg-primary rounded
              ${!inGroup ? "cursor-not-allowed" : "hover:bg-danger"}`}
          >
            Leave Group
          </button>
        </div>
        <h2 className="mb-4">Create a group or join an existing group below</h2>
        <div className="bg-secondary p-4 rounded-lg shadow-inner">
          {Object.keys(groups).map((key) => {
            const element = groups[key];
            let isLeader = element.leader === playerData.source;
            let isMember = element.members.some(
              (member) => member.Player === playerData.source
            );

            return (
              <div
                key={element.id}
                className={`flex justify-between items-center p-3 mb-2 rounded-md ${
                  !inGroup && "hover:bg-accent"
                }`}
                onClick={() => {
                  if (!inGroup) {
                    setSelectedGroup(element);
                  }
                }}
              >
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faUsers} className="mr-2" />
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
                    <FontAwesomeIcon icon={faUserGroup} className="" />
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
          />
        )}
      </div>
    </div>
  );
};

export default GroupDashboard;
