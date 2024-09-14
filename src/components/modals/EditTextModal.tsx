import React from "react";
import { Modal, Input, InputNumber, Button } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { closeModal } from "../../redux/modalSlice";
import { AppDispatch } from "../../redux/store";

interface EditTextModalProps {
  visible: boolean;
  editValue: string[];
  editNumberValue: number | null;
  setEditValue: React.Dispatch<React.SetStateAction<string[]>>;
  setEditNumberValue: React.Dispatch<React.SetStateAction<number | null>>;
  handleUpdateCell: (rowIndex: number, colKey: string, value: any) => void;
  editingCell: { rowIndex: number; colKey: string } | null;
  columns: any;
  dispatch: AppDispatch;
}

const EditTextModal: React.FC<EditTextModalProps> = ({
  visible,
  editValue,
  editNumberValue,
  setEditValue,
  setEditNumberValue,
  handleUpdateCell,
  editingCell,
  columns,
  dispatch,
}) => {
  if (!visible) return null;

  const addInputField = () => {
    setEditValue([...editValue, ""]);
  };

  const removeInputField = (index: number) => {
    const newValues = [...editValue];
    newValues.splice(index, 1);
    setEditValue(newValues.length ? newValues : [""]);
  };

  const saveChanges = () => {
    if (editingCell) {
      if (
        columns.find((col: any) => col.dataIndex === editingCell.colKey)
          ?.dataType === "number"
      ) {
        handleUpdateCell(
          editingCell.rowIndex,
          editingCell.colKey,
          editNumberValue
        );
      } else {
        handleUpdateCell(editingCell.rowIndex, editingCell.colKey, editValue);
      }
    }
    dispatch(closeModal("editTextModal"));
  };

  return (
    <Modal
      title="Edit Cell"
      open={visible}
      onOk={saveChanges}
      onCancel={() => dispatch(closeModal("editTextModal"))}
      okText="Save"
      cancelText="Cancel"
    >
      {columns.find((col: any) => col.dataIndex === editingCell?.colKey)
        ?.dataType === "number" ? (
        <InputNumber
          value={editNumberValue ?? 0}
          onChange={(value) => setEditNumberValue(value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />
      ) : (
        <>
          {editValue.map((value, index) => (
            <div
              key={index}
              style={{
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Input
                value={value}
                onChange={(e) => {
                  const newValues = [...editValue];
                  newValues[index] = e.target.value;
                  setEditValue(newValues);
                }}
                placeholder="Enter text"
                style={{
                  width: "80%",
                  backgroundColor: "white",
                  color: "black",
                  marginRight: "8px",
                  maxWidth: "320px", // Constrain input width to prevent overflow
                }}
              />
              <Button
                type="text"
                icon={<MinusCircleOutlined />}
                onClick={() => removeInputField(index)}
              />
            </div>
          ))}
          <Button onClick={addInputField} icon={<PlusOutlined />}>
            Add Text
          </Button>
        </>
      )}
    </Modal>
  );
};

export default EditTextModal;
