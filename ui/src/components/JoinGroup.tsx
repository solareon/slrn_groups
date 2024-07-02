import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const JoinGroup: React.FC<any> = ({
  groupId,
  groupName,
  onSelect,
  onClose,
}) => {
  const [password, setPassword] = useState("");
  const [disabledReason, setDisabledReason] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  useEffect(() => {
    let reason = "";
    if (password === "") {
      reason = "Password is required";
    }
    setDisabledReason(reason);
    setIsSubmitDisabled(reason !== "");
  }, [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const groupData = { groupId, password };
    onSelect(groupData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
      <div
        className="bg-background
       border border-border-primary-light dark:border-none p-6 rounded-lg shadow-md w-11/12 text-2xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            Join Group
          </h2>
          <FontAwesomeIcon icon={faXmark} onClick={onClose} size="2xl"/>
        </div>
        <form className="text-left" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block mb-2"
            >
              Group: {groupName}
            </label>
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 text-2xl"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-secondary border border-secondary dark:border-none text-2xl"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 rounded bg-secondary text-2xl hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={`px-4 py-2 rounded bg-secondary text-2xl
                ${
                isSubmitDisabled
                  ? "cursor-not-allowed"
                  : "hover:bg-accent"
              }`}
            >
              Submit
            </button>
          </div>
          <div className="mt-4 text-center text-danger text-2xl">
            {disabledReason ? disabledReason : String.fromCharCode(160)}
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinGroup;
