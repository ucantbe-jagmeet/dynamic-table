"use client";
import React, { useEffect, useState } from "react";
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
  Column,
  Row,
} from "../redux/tableSlice";
import EditableCell from "./RenderEditableCell";

type ColumnType = "string" | "number";


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

  const [isLoading, setIsLoading] = useState(true);

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

  const handleFilter = (columnKey: string, criteria: any) => {
    dispatch(filterRows({ columnKey, criteria })); 
  };


  const handleResetFilters = () => {
    dispatch(resetFilters()); 
  };

  useEffect(() => {
        setIsLoading(!isLoading);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col items-center ">
      <h2 className="font-bold text-3xl font-mono my-5">Dynamic Table</h2>

      {isLoading ? (
        <div className="flex items-center justify-center h-1/3 w-full">
          Loading...
        </div>
      ) : (
        <>
          <div className="mb-10">
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
          </div>
          <Table
            loading={isLoading}
            columns={[
              ...columns.map((col: Column) => ({
                ...col,
                columnWidth:"100px",
                render: (text: any, record: Row) => (
                  <EditableCell
                    text={text}
                    record={record}
                    column={col}
                    setEditingCell={setEditingCell}
                    setEditValue={setEditValue}
                    setEditNumberValue={setEditNumberValue}
                    rows={rows}
                  />
                ),
                title: (
                  <div className=" flex items-center ">
                    <span className=" truncate mr-2">{col.title}</span>{" "}
                    {/* Ensures title doesn't overflow */}
                    <Button
                      icon={<FilterOutlined />}
                      size="small"
                      className="ml-1"
                      onClick={() => {
                        setFilterColumn(col.key);
                        dispatch(openModal("filterModal"));
                      }}
                    />
                  </div>
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
            className="w-full px-10 overflow-auto max-w-8xl"
            tableLayout="auto"
            size="small"
            bordered
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
              columns.find(
                (col: { key: string | null }) => col.key === filterColumn
              )?.dataType ?? "string"
            }
            columnKey={filterColumn ?? ""}
            handleFilter={handleFilter}
            dispatch={dispatch}
          />
        </>
      )}
    </div>
  );
};

export default DynamicTable;
