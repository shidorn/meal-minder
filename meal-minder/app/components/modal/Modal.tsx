import React, { ReactNode } from "react";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white p-8 rounded-lg shadow-md z-10">
        {children}
        {/* <button
          onClick={onClose}
          className="mt-4 p-2 bg-red-500 text-white rounded"
        >
          Close
        </button> */}
      </div>
    </div>
  );
};

export default Modal;
