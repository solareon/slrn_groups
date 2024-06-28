import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const CreateGroup: React.FC<any> = ({ onSelect, onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [disabledReason, setDisabledReason] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  useEffect(() => {
    let reason = "";
    if (groupName === "") {
      reason = "Group name is required";
    } else if (password === "") {
      reason = "Password is required";
    } else if (password !== verifyPassword) {
      reason = "Passwords do not match";
    }
    setDisabledReason(reason);
    setIsSubmitDisabled(reason !== "");
  }, [password, verifyPassword, groupName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const groupData = { groupName, password };
    onSelect(groupData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
      <div
        className="bg-background
       border border-border-primary-light dark:border-none p-6 rounded-lg shadow-md w-11/12"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Create Group</h2>
          <FontAwesomeIcon icon={faXmark} onClick={onClose} size="2xl"/>
        </div>
        <form className="text-left text-xl" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="groupName" className="block mb-2">
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-2 rounded bg-secondary border dark:border-none border-secondary"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-secondary border dark:border-none border-secondary"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="verifyPassword" className="block mb-2">
              Verify Password
            </label>
            <input
              type="password"
              id="verifyPassword"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              className="w-full p-2 rounded bg-secondary border dark:border-none border-secondary"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 rounded bg-primary hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={`px-4 py-2 rounded
                bg-primary
                ${
                  isSubmitDisabled
                    ? "cursor-not-allowed"
                    : "hover:bg-success"
                }`}
            >
              Submit
            </button>
          </div>
          <div className="mt-4 text-center text-danger">
            {disabledReason ? disabledReason : String.fromCharCode(160)}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
