"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Select,
  Form,
  Space,
  Tag,
} from "antd";
import {
  DeleteOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { openModal, closeModal } from "../redux/modalSlice";
import {
  DeleteRowModal,
  CreateColumnModal,
  EditTextModal,
  CreateRowModal,
} from "./modals"; 

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
  const { createColumnModal, editTextModal, deleteRowModal, createRowModal } =
    useSelector((state: RootState) => state.modal);

  const [columns, setColumns] = useState<Column[]>([
    {
      key: "productLink",
      title: "PRODUCT LINK",
      dataType: "string",
      dataIndex: "productLink",
    },
    { key: "name", title: "NAME", dataType: "string", dataIndex: "name" },
    {
      key: "ingredients",
      title: "INGREDIENTS",
      dataType: "string",
      dataIndex: "ingredients",
    },
    { key: "price", title: "PRICE", dataType: "number", dataIndex: "price" },
  ]);

  const [dataSource, setDataSource] = useState<Row[]>([
    {
      key: "1",
      productLink: "link1",
      name: "Facewash",
      ingredients: ["Aloe Vera"],
      price: 15,
    },
    {
      key: "2",
      productLink: "link2",
      name: "Sunscreen",
      ingredients: ["Zinc Oxide"],
      price: 25,
    },
    {
      key: "3",
      productLink: "link3",
      name: "Moisturizer",
      ingredients: ["Shea Butter"],
      price: 20,
    },
  ]);

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
    setColumns([...columns, newColumn]);
    dispatch(closeModal("createColumnModal"));
  };

  const handleAddRow = (newRowData: Record<string, any>) => {
    const newRow: Row = {
      key: `${dataSource.length + 1}`,
      ...newRowData,
    };
    setDataSource([...dataSource, newRow]);
  };

  const handleDeleteRow = () => {
    if (rowToDelete) {
      setDataSource(dataSource.filter((item) => item.key !== rowToDelete));
      dispatch(closeModal("deleteRowModal"));
      setRowToDelete(null);
    }
  };

  const handleUpdateCell = (rowIndex: number, colKey: string, value: any) => {
    const updatedData = [...dataSource];
    updatedData[rowIndex][colKey] = value;
    setDataSource(updatedData);
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
                rowIndex: dataSource.indexOf(record),
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
        {/* Render a "+" button if no tags are present */}
        {filteredDisplayValue.length === 0 && (
          <Button
            type="link"
            onClick={() => {
              setEditingCell({
                rowIndex: dataSource.indexOf(record),
                colKey: column.dataIndex,
              });
              setEditValue([""]); // Initialize with an empty input field
              dispatch(openModal("editTextModal"));
            }}
          >
            Add Text
          </Button>
        )}
      </>
    );
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

      <Table
        columns={[
          ...columns.map((col) => ({
            ...col,
            render: (text: any, record: Row) =>
              renderEditableCell(text, record, col),
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
        dataSource={dataSource}
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
    </div>
  );
};

export default DynamicTable;
