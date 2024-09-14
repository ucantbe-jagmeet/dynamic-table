// EditableCell.tsx
import React from "react";
import { Button, Tag } from "antd";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/modalSlice";
import { AppDispatch } from "../redux/store";
import { Column, Row } from "./DynamicTable";

interface EditableCellProps {
  text: any;
  record: Row;
  column: Column;
  setEditingCell: (cell: { rowIndex: number; colKey: string }) => void;
  setEditValue: (value: string[]) => void;
  setEditNumberValue: (value: number | null) => void;
  rows: Row[];
}

const EditableCell: React.FC<EditableCellProps> = ({
  text,
  record,
  column,
  setEditingCell,
  setEditValue,
  setEditNumberValue,
  rows,
}) => {
  const dispatch: AppDispatch = useDispatch();

  const isArray = Array.isArray(record[column.dataIndex]);
  const displayValue = isArray
    ? (record[column.dataIndex] as string[])
    : [record[column.dataIndex]?.toString() ?? ""];

  const filteredDisplayValue = displayValue.filter(
    (item) => item.trim() !== ""
  );

  return (
    <>
      {filteredDisplayValue.map((item, index) => (
        <Tag
          key={index}
          onClick={() => {
            setEditingCell({
              rowIndex: rows.indexOf(record),
              colKey: column.dataIndex,
            });
            if (column.dataType === "number") {
              setEditNumberValue(Number(item));
            } else {
              setEditValue(
                filteredDisplayValue.length > 0 ? filteredDisplayValue : [""]
              );
            }
            dispatch(openModal("editTextModal"));
          }}
          style={{
            color: "black",
            backgroundColor: "transparent",
            border: "1px solid #d9d9d9",
          }}
        >
          {item}
        </Tag>
      ))}
      {filteredDisplayValue.length === 0 && (
        <Button
          type="link"
          onClick={() => {
            setEditingCell({
              rowIndex: rows.indexOf(record),
              colKey: column.dataIndex,
            });
            setEditValue([""]);
            dispatch(openModal("editTextModal"));
          }}
        >
          Add Text
        </Button>
      )}
    </>
  );
};

export default EditableCell;
