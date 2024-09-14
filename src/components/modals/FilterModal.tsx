import React, { useState } from 'react';
import { Modal, Input, InputNumber, Radio, Button, Form } from 'antd';
import { closeModal } from "../../redux/modalSlice";
import { AppDispatch } from "../../redux/store";

interface FilterModalProps {
  visible: boolean; // Modal visibility state
  columnType: 'string' | 'number'; // Type of column to determine input type
  columnKey: string; // Column key to identify the column being filtered
  handleFilter: (columnKey: string, criteria: any) => void; // Function to filter data
  dispatch: AppDispatch; // Redux dispatch function
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  columnType,
  columnKey,
  handleFilter,
  dispatch,
}) => {
  const [inputValue, setInputValue] = useState<string | number>(''); // Input value for filtering
  const [filterType, setFilterType] = useState<string>('contains'); // Default filter type

  const applyFilter = () => {
    console.log(
      "columnKey",
      columnKey,
      { type: filterType, value: inputValue }
    );
    handleFilter(columnKey, { type: filterType, value: inputValue }); 
    setInputValue("");
    dispatch(closeModal('filterModal')); // Close modal
  };

  return (
    <Modal
      title={`Filter ${columnKey}`}
      open={visible}
      onOk={applyFilter}
      onCancel={() => dispatch(closeModal("filterModal"))}
      okText="Apply"
      cancelText="Cancel"
    >
      <Form layout="vertical">
        {columnType === "string" ? (
          <>
            <Form.Item label="Filter Text">
              <Input
                placeholder="Enter text to filter"
                value={inputValue as string}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </Form.Item>
            <Radio.Group
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <Radio value="contains" checked>
                Contains
              </Radio>
              <Radio value="notContains">Does not contain</Radio>
            </Radio.Group>
          </>
        ) : (
          <>
            <Form.Item label="Filter Number">
              <InputNumber
                placeholder="Enter number to filter"
                value={inputValue as number}
                onChange={(value) => setInputValue(value || 0)}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Radio.Group
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <Radio value="lessThan">Less than</Radio>
              <Radio value="greaterThan">Greater than</Radio>
              <Radio value="equalTo" checked>
                Equal to
              </Radio>
            </Radio.Group>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default FilterModal;
