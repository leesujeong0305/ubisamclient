import React from 'react';
import './CustomConfirmModal.css';

const CustomConfirmModal = ({ show, message, onSave, onCancel }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-icon">
            <i className="bi bi-filetype-exe d-flex fs-5 justify-content-center" aria-hidden="true" />
        </div>
        <div className="modal-message">
          {message}
        </div>
        <div className="modal-buttons">
          <button onClick={onSave} className="modal-button save-button">Save</button>
          <button onClick={onCancel} className="modal-button cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CustomConfirmModal;