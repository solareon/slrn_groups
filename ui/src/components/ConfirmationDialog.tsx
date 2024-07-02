import React from 'react';

interface Confirmation {
  message: string;
}

interface ConfirmationDialogProps {
  onClose: () => void;
  onConfirm: () => void;
  confirmation: Confirmation;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ onClose, onConfirm, confirmation }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
      <div className="bg-background border border-primary rounded-lg p-6 w-11/12">
        <h2 className="text-text text-xl font-semibold mb-4">
          {confirmation.message}
        </h2>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-primary rounded hover:bg-secondary"
            onClick={onClose}
          >
            No
          </button>
          <button
            className="px-4 py-2 bg-primary rounded hover:bg-danger"
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
