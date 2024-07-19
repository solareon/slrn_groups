import React, { useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTrash, faCrown } from "@fortawesome/free-solid-svg-icons";
import { usePlayerDataStore } from "../storage/PlayerDataStore";
import { useGroupStore } from "../storage/GroupStore";

const PlayerList: React.FC = ({ onClose, fetchNui }) => {
    const { playerData } = usePlayerDataStore();
    const { currentGroup, isLeader } = useGroupStore();

    const removeGroupMember = (member) => {
        fetchNui("removeGroupMember", member.playerId);
    };

    useEffect(() => {
        if (!currentGroup || currentGroup.length === 0) {
            onClose();
        }
    }, [currentGroup]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
            <div className="bg-background border border-primary w-11/12 rounded-md shadow-md">
                <div className="p-4 rounded-t-md">
                    <h2 className="text-2xl font-semibold">Group Members</h2>
                    <h3 className="text-xl">{currentGroup.name}</h3>
                </div>
                <div className="m-4">
                    {currentGroup.map((member, index) => {
                        return (
                            <div
                                key={index}
                                className="flex p-3 items-center rounded-md my-2 gap-x-2 bg-primary"
                            >
                                <FontAwesomeIcon icon={faUser} size="sm" />
                                <span className="text-lg border-l pl-4 flex justify-between w-full items-center">{member.name}{(isLeader && member.playerId !== playerData.source) && (
                                    <FontAwesomeIcon
                                    icon={faTrash}
                                    className="self-right hover:text-danger"
                                    size="sm"
                                    onClick={() => removeGroupMember(member)}
                                    />
                                )}</span>
                            </div>
                        );
                    })}
                </div>
                <div className="pb-4 px-4 rounded-b-md">
                    <button
                        className="w-full py-2 bg-primary rounded-lg hover:scale-105"
                        onClick={onClose}
                    >
                        Return
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlayerList;
