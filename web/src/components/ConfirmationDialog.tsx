import React from 'react';

const ConfirmationDialog = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
      <div className="bg-background-primary-light dark:bg-background-primary-dark
       border border-border-primary-light dark:border-border-primary-dark rounded-lg p-6 w-full max-w-md">
        <h2 className="text-text-primary-light dark:text-text-primary-dark text-xl font-semibold mb-4">
          Leave the group?
        </h2>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-button-primary-light dark:bg-button-primary-dark text-text-primary-light dark:text-text-primary-dark rounded hover:bg-button-hover-light dark:hover:bg-button-hover-dark"
            onClick={onClose}
          >
            No
          </button>
          <button
            className="px-4 py-2 bg-button-danger-light dark:bg-button-danger-dark text-text-primary-light dark:text-text-primary-dark rounded hover:bg-button-hover-light dark:hover:bg-button-hover-dark"
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
