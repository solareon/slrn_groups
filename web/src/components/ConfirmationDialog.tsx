import React from 'react';

const ConfirmationDialog = ({ onClose, onConfirm, confirmation}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
      <div className="bg-background border border-primary rounded-lg p-6 w-11/12">
        <h2 className="text-text text-xl font-normal mb-8">
          {confirmation.message}
        </h2>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-primary rounded-lg transition-all shadow-sm hover:bg-secondary hover:scale-105 hover:shadow-lg w-1/2"
            onClick={onClose}
          >
            No
          </button>
          <button
            className="px-4 py-2 bg-primary hover:bg-danger rounded-lg transition-all shadow-sm hover:scale-105 hover:shadow-lg w-1/2"
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog