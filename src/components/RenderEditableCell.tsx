// EditableCell.tsx
import React from "react";
import { Button, Tag } from "antd";
import { useDispatch } from "react-redux";
import { openModal } from "../redux/modalSlice";
import { AppDispatch } from "../redux/store";
import { Row, Column } from "../redux/tableSlice";

interface EditableCellProps {
  text: any;
  record: Row;
  column: Column;
  setEditingCell: (cell: { rowIndex: number; colKey: string }) => void;
  setEditValue: (value: string[]) => void;
  setEditNumberValue: (value: number | null) => void;
  rows: Row[];
}

// Utility function to determine column type
const getColumnType = (column: Column) => {
  return column.dataType === "number" ? "number" : "text";
};

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

  const columnType = getColumnType(column); // Determine the column type
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
            if (columnType === "number") {
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
            columnType === "number" ? setEditNumberValue(0) : setEditValue([""])
            dispatch(openModal("editTextModal"));
          }}
          className="text-[12px]"
        >
          {columnType === "number" ? "Add Num" : "Add Text"}
        </Button>
      )}
    </>
  );
};

export default EditableCell;
