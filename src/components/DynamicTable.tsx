"use client";
import React, { useState } from "react";
import { Table, Button, Space, Tag, Form } from "antd";
import { DeleteOutlined, FilterOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { openModal, closeModal } from "../redux/modalSlice";
import {
  DeleteRowModal,
  CreateColumnModal,
  EditTextModal,
  CreateRowModal,
  FilterModal,
} from "./modals";
import {
  addColumn,
  addRow,
  deleteRow,
  updateCell,
  filterRows,
  resetFilters,
  selectColumns,
  selectRows,
} from "../redux/tableSlice";

type ColumnType = "string" | "number";

interface Column {
  key: string;
  title: string;
  dataType: ColumnType;
  dataIndex: string;
}

interface Row {
  key: string;
  [key: string]: string | number | string[];
}

const DynamicTable: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    createColumnModal,
    editTextModal,
    deleteRowModal,
    createRowModal,
    filterModal,
  } = useSelector((state: RootState) => state.modal);

  const columns = useSelector(selectColumns);
  const rows = useSelector(selectRows);

  const [filterColumn, setFilterColumn] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [editingCell, setEditingCell] = useState<{
    rowIndex: number;
    colKey: string;
  } | null>(null);
  const [editValue, setEditValue] = useState<string[]>([""]);
  const [editNumberValue, setEditNumberValue] = useState<number | null>(null);
  const [rowToDelete, setRowToDelete] = useState<string | null>(null);

  const handleAddColumn = (values: {
    columnName: string;
    columnType: ColumnType;
  }) => {
    const newColumn: Column = {
      key: values.columnName,
      title: values.columnName.toUpperCase(),
      dataType: values.columnType,
      dataIndex: values.columnName,
    };
    dispatch(addColumn(newColumn));
    dispatch(closeModal("createColumnModal"));
  };

  const handleAddRow = (newRowData: Record<string, any>) => {
    const newRow: Row = {
      key: `${rows.length + 1}`,
      ...newRowData,
    };
    dispatch(addRow(newRow));
  };

  const handleDeleteRow = () => {
    if (rowToDelete) {
      dispatch(deleteRow(rowToDelete));
      dispatch(closeModal("deleteRowModal"));
      setRowToDelete(null);
    }
  };

  const handleUpdateCell = (rowIndex: number, colKey: string, value: any) => {
    dispatch(updateCell({ rowIndex, colKey, value }));
    dispatch(closeModal("editTextModal"));
  };

  const renderEditableCell = (text: any, record: Row, column: Column) => {
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

  const handleFilter = (columnKey: string, criteria: any) => {
    dispatch(filterRows({ columnKey, criteria })); 
  };


  const handleResetFilters = () => {
    dispatch(resetFilters()); 
  };

  return (
    <div>
      <h2>Skin Care Catalog</h2>
      <Button onClick={() => dispatch(openModal("createColumnModal"))}>
        Create Column
      </Button>
      <Button
        onClick={() => dispatch(openModal("createRowModal"))}
        style={{ marginLeft: "16px" }}
      >
        Add Row
      </Button>
      <Button onClick={handleResetFilters} style={{ marginLeft: "16px" }}>
        Reset Filters
      </Button>

      <Table
        columns={[
          ...columns.map((col: Column) => ({
            ...col,
            render: (text: any, record: Row) =>
              renderEditableCell(text, record, col),
            title: (
              <Space>
                {col.title}
                <Button
                  icon={<FilterOutlined />}
                  size="small"
                  onClick={() => {
                    setFilterColumn(col.key);
                    dispatch(openModal("filterModal"));
                  }}
                />
              </Space>
            ),
          })),
          {
            title: "Action",
            key: "action",
            render: (text, record: Row) => (
              <Space size="middle">
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    setRowToDelete(record.key);
                    dispatch(openModal("deleteRowModal"));
                  }}
                />
              </Space>
            ),
          },
        ]}
        dataSource={rows} 
        pagination={{ pageSize: 10 }}
        style={{ marginTop: "16px" }}
        rowClassName={() => "dynamic-row"}
      />

      {/* Create Column Modal */}
      <CreateColumnModal
        visible={createColumnModal}
        form={form}
        handleAddColumn={handleAddColumn}
        dispatch={dispatch}
      />

      {/* Edit Text Modal */}
      <EditTextModal
        visible={editTextModal}
        editValue={editValue}
        editNumberValue={editNumberValue}
        setEditValue={setEditValue}
        setEditNumberValue={setEditNumberValue}
        handleUpdateCell={handleUpdateCell}
        editingCell={editingCell}
        columns={columns}
        dispatch={dispatch}
      />

      {/* Delete Row Modal */}
      <DeleteRowModal
        visible={deleteRowModal}
        handleDeleteRow={handleDeleteRow}
        dispatch={dispatch}
      />

      {/* Create Row Modal */}
      <CreateRowModal
        visible={createRowModal}
        columns={columns}
        handleAddRow={handleAddRow}
        dispatch={dispatch}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={filterModal}
        columnType={
          columns.find((col: { key: string | null; }) => col.key === filterColumn)?.dataType ?? "string"
        }
        columnKey={filterColumn ?? ""}
        handleFilter={handleFilter}
        dispatch={dispatch}
      />
    </div>
  );
};

export default DynamicTable;
