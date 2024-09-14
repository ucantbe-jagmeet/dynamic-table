import React from "react";
import { Modal } from "antd";
import { closeModal } from "../../redux/modalSlice"; 
import { AppDispatch } from "../../redux/store"; 

interface DeleteRowModalProps {
  visible: boolean;
  handleDeleteRow: () => void;
  dispatch: AppDispatch;
}

const DeleteRowModal: React.FC<DeleteRowModalProps> = ({
  visible,
  handleDeleteRow,
  dispatch,
}) => {
  if (!visible) return null;

  return (
    <Modal
      title="Delete Row"
      open={visible}
      onOk={handleDeleteRow}
      onCancel={() => dispatch(closeModal("deleteRowModal"))}
      okText="Delete"
      cancelText="Cancel"
    >
      Are you sure you want to delete this row?
    </Modal>
  );
};

export default DeleteRowModal;
