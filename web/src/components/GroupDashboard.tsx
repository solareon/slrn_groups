import React, { useState } from "react";
import CreateGroup from "./CreateGroup";
import JoinGroup from "./JoinGroup";
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
  const [selectedGroup, setSelectedGroup] = useState(null);
  const inGroup = groups.some((group) =>
    group.members.some((member) => member.Player === playerData.source)
  );

  const createGroup = (groupData) => {
    console.log(groupData);
    const newGroup = {
      id: groups.length + 1,
      status: "open",
      GName: groupData.groupName,
      GPass: groupData.password,
      Users: 1,
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

  const leaveGroup = (groupData) => {
    console.log(groupData);
  };

  const removeGroup = (groupData) => {
    console.log(groupData);
  };

  const renderIcons = (isLeader, isMember, users) => {
    return (
      <>
        <FontAwesomeIcon
          icon={faList}
          className="text-white mx-1 hover:text-green-500"
          onClick={() => setCurrentPage("PlayerList")}
        />
        {isLeader && (
          <FontAwesomeIcon
            icon={faTrash}
            className="text-white mx-1 hover:text-red-500"
            onClick={() => removeGroup(element)}
          />
        )}
        {isMember && !isLeader && (
          <FontAwesomeIcon
            icon={faRightFromBracket}
            className="text-white mx-1 hover:text-red-500"
            onClick={() => leaveGroup(element)}
          />
        )}
        <FontAwesomeIcon icon={faUserGroup} className="text-white mx-1" />
        <span>{users}</span>
      </>
    );
  };

  return (
    <div className="flex self-start items-center h-screen bg-gray-200 dark:bg-gray-900">
      <div className="w-full bg-gray-400 dark:bg-gray-700 text-white rounded-lg shadow-md p-6">
        {!inGroup && (
          <div className="mb-4">
            <div className="text-md font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              Create a group or join an existing group
            </div>
            <button
              onClick={() => setShowCreateGroup(true)}
              className="px-4 py-2 bg-blue-200 dark:bg-blue-900 text-black dark:text-white rounded hover:bg-blue-600"
            >
              Create Group
            </button>
          </div>
        )}
        <div className="bg-gray-200 dark:bg-gray-900 p-4 rounded-lg shadow-inner">
          {Object.keys(groups).map((key) => {
            const element = groups[key];
            let isLeader = element.leader === playerData.source;
            let isMember = element.members.some(
              (member) => member.Player === playerData.source
            );

            return (
              <div
                key={element.id}
                className="flex justify-between items-center text-black dark:text-white bg-gray-400 dark:bg-gray-700 rounded-md  hover:bg-gray-500 p-3 mb-2"
                onClick={() => {
                  if (!inGroup) {
                    setSelectedGroup(element);
                  }
                }}
              >
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faUsers} className="text-white mr-2" />
                  <span>{element.GName}</span>
                </div>
                <div className="flex items-center">
                  <>
                    {isLeader || isMember ? (
                      <div className="flex items-center">{renderIcons(isLeader, isMember, element.Users)}</div>
                    ) : (
                      <>
                        <FontAwesomeIcon
                          icon={faUserGroup}
                          className="text-white mx-1"
                        />
                        <span>{element.Users}</span>
                      </>
                    )}
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
              // Handle group joining logic here
              joinGroup(groupData);
              setSelectedGroup(null);
            }}
            onClose={() => {
              setSelectedGroup(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default GroupDashboard;
