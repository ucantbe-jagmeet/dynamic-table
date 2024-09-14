import React from "react";
import { Modal, Input, Select, Form } from "antd";
import { closeModal } from "../../redux/modalSlice"; 
import { AppDispatch } from "../../redux/store"; 

const { Option } = Select;

interface CreateColumnModalProps {
  visible: boolean; 
  form: any; 
  handleAddColumn: (values: {
    columnName: string;
    columnType: "string" | "number";
  }) => void;
  dispatch: AppDispatch;
}

const CreateColumnModal: React.FC<CreateColumnModalProps> = ({
  visible,
  form,
  handleAddColumn,
  dispatch,
}) => {
  if (!visible) return null;

  return (
    <Modal
      title="Create Column"
      open={visible}
      onOk={form.submit} 
      onCancel={() => dispatch(closeModal("createColumnModal"))} 
      okText="Create"
      cancelText="Cancel"
    >
      <Form layout="inline" form={form} onFinish={handleAddColumn}>
        <Form.Item
          name="columnName"
          rules={[{ required: true, message: "Column name is required" }]}
        >
          <Input placeholder="Column Name" />
        </Form.Item>
        <Form.Item
          name="columnType"
          rules={[{ required: true, message: "Column type is required" }]}
        >
          <Select placeholder="Select Column Type">
            <Option value="string">String</Option>
            <Option value="number">Number</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateColumnModal;
