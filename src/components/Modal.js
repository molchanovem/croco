import React from 'react';
import './modal.css'; // Этот файл будет содержать стили для модального окна

const Modal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onClose} className='btnq'>Закрыть</button>
      </div>
    </div>
  );
};

export default Modal;
