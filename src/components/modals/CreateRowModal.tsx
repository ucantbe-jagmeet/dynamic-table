import React, { useState } from "react";
import { Modal, Input, InputNumber, Form, Button } from "antd";
import { closeModal } from "../../redux/modalSlice"; 
import { AppDispatch } from "../../redux/store";


interface CreateRowModalProps {
  visible: boolean; // Modal visibility state
  columns: { key: string; title: string; dataType: "string" | "number" }[]; // Column definitions
  handleAddRow: (rowData: Record<string, any>) => void; // Function to add a new row
  dispatch: AppDispatch; // Redux dispatch function
}

const CreateRowModal: React.FC<CreateRowModalProps> = ({
  visible,
  columns,
  handleAddRow,
  dispatch,
}) => {
  const [form] = Form.useForm();
  const [rowData, setRowData] = useState<Record<string, any>>({}); // Row data state

  if (!visible) return null;

  const handleInputChange = (key: string, value: any) => {
    setRowData((prevData) => ({ ...prevData, [key]: value }));
  };

  const saveRow = () => {
    handleAddRow(rowData); 
    form.resetFields(); 
    dispatch(closeModal("createRowModal")); 
  };

  return (
    <Modal
      title="Create New Row"
      open={visible}
      onOk={form.submit}
      onCancel={() => dispatch(closeModal("createRowModal"))}
      okText="Save"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical" onFinish={saveRow}>
        {columns.map((col) => (
          <Form.Item
            key={col.key}
            label={col.title}
            rules={[{ required: true, message: `Please enter ${col.title}` }]}
          >
            {col.dataType === "string" ? (
              <Input
                placeholder={`Enter ${col.title}`}
                onChange={(e) => handleInputChange(col.key, e.target.value)}
              />
            ) : (
              <InputNumber
                placeholder={`Enter ${col.title}`}
                style={{ width: "100%" }}
                onChange={(value) => handleInputChange(col.key, value)}
              />
            )}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default CreateRowModal;
