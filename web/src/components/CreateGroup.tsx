import React, { useState, useEffect } from "react";

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
        className="bg-background-primary-light dark:bg-background-primary-dark
       border border-border-primary-light dark:border-none p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-text-primary-light dark:text-text-primary-dark text-2xl font-bold">
            Create Group
          </h2>
          <button onClick={onClose} className="text-text-primary-light dark:text-text-primary-dark text-lg">
            ×
          </button>
        </div>
        <form className="text-left" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="groupName" className="block text-text-primary-light dark:text-text-primary-dark mb-2">
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-2 rounded bg-background-secondary-light dark:bg-background-secondary-dark text-text-primary-light dark:text-text-primary-dark border dark:border-none border-border-primary-light"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-text-primary-light dark:text-text-primary-dark mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-background-secondary-light dark:bg-background-secondary-dark text-text-primary-light dark:text-text-primary-dark border dark:border-none border-border-primary-light"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="verifyPassword" className="block text-text-primary-light dark:text-text-primary-dark mb-2">
              Verify Password
            </label>
            <input
              type="password"
              id="verifyPassword"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              className="w-full p-2 rounded bg-background-secondary-light dark:bg-background-secondary-dark text-text-primary-light dark:text-text-primary-dark border dark:border-none border-border-primary-light"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 rounded bg-button-primary-light dark:bg-button-primary-dark text-text-primary-light dark:text-text-primary-dark hover:bg-button-hover-light dark:hover:bg-button-hover-dark"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={`px-4 py-2 rounded text-text-primary-light dark:text-text-primary-dark
                bg-button-primary-light dark:bg-button-primary-dark
                ${
                isSubmitDisabled
                  ? "cursor-not-allowed"
                  : "hover:bg-button-success-light dark:hover:bg-button-success-dark"
              }`}
            >
              Submit
            </button>
          </div>
          <div className="mt-4 text-center text-text-danger-light dark:text-text-danger-dark">
            {disabledReason ? disabledReason : String.fromCharCode(160)}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
