import { FC, ReactNode } from "react";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const closeModal = () => {
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
            <div className="flex justify-end p-2">
              {/* <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeModal}
              >
                &times;
              </button> */}
            </div>
            <div className="p-4">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
