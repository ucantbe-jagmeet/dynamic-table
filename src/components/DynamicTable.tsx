"use client";
import React, { useState } from "react";
import { Table, Button, Select, Form, Space, Tag } from "antd";
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

  const [filteredDataSource, setFilteredDataSource] =
    useState<Row[]>(dataSource); // State to store filtered data
  const [form] = Form.useForm();
  const [editingCell, setEditingCell] = useState<{
    rowIndex: number;
    colKey: string;
  } | null>(null);
  const [editValue, setEditValue] = useState<string[]>([""]);
  const [editNumberValue, setEditNumberValue] = useState<number | null>(null);
  const [rowToDelete, setRowToDelete] = useState<string | null>(null);
  const [filterColumn, setFilterColumn] = useState<string | null>(null);

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
    setFilteredDataSource([...filteredDataSource, newRow]); // Update filtered data source as well
  };

  const handleDeleteRow = () => {
    if (rowToDelete) {
      const updatedData = dataSource.filter((item) => item.key !== rowToDelete);
      setDataSource(updatedData);
      setFilteredDataSource(updatedData); // Update filtered data source as well
      dispatch(closeModal("deleteRowModal"));
      setRowToDelete(null);
    }
  };

  const handleUpdateCell = (rowIndex: number, colKey: string, value: any) => {
    const updatedData = [...dataSource];
    updatedData[rowIndex][colKey] = value;
    setDataSource(updatedData);
    setFilteredDataSource(updatedData); // Update filtered data source as well
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

  // Handle filter logic
const handleFilter = (columnKey: string, criteria: any) => {
  const { type, value } = criteria;
  let filteredData: Row[] = [...dataSource];

  const column = columns.find((col) => col.key === columnKey);
  if (!column) return; // Exit if the column is not found

  console.log("creteria", criteria);
  
  switch (column.dataType) {
    case "string":
      filteredData = dataSource.filter((row) => {
        const cellValue = row[columnKey]; // Could be string or string[]

        if (typeof cellValue === "string") {
          // Handle string filtering
          switch (type) {
            case "contains":
              return cellValue.toLowerCase().includes(value.toLowerCase());
            case "notContains":
              return !cellValue.toLowerCase().includes(value.toLowerCase());
            case "some":
              return cellValue
                .split(",")
                .some(
                  (item) => item.trim().toLowerCase() === value.toLowerCase()
                );
            default:
              return true;
          }
        } else if (Array.isArray(cellValue)) {
          // Handle array filtering (e.g., ingredients)
          switch (type) {
            case "contains":
              return cellValue.some((item) =>
                item.toLowerCase().includes(value.toLowerCase())
              );
            case "notContains":
              return !cellValue.some((item) =>
                item.toLowerCase().includes(value.toLowerCase())
              );
            default:
              return true;
          }
        }
        return true;
      });
      break;

    case "number":
      filteredData = dataSource.filter((row) => {
        const cellValue = row[columnKey];

        if (typeof cellValue === "number") {
          // Handle number filtering
          switch (type) {
            case "lessThan":
              return cellValue < value;
            case "greaterThan":
              return cellValue > value;
            case "equalTo":
              return cellValue === value;
            default:
              return true; // Keep all data if no valid type is provided
          }
        }
        return true; // If type doesn't match, return all rows
      });
      break;

    default:
      break;
  }

  setFilteredDataSource(filteredData); // Update the filtered data source state
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
            title: (
              <Space>
                {col.title}
                <Button
                  icon={<FilterOutlined />}
                  size="small"
                  onClick={() => {
                    setFilterColumn(col.key); // Set the column to filter
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
        dataSource={filteredDataSource}
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
          columns.find((col) => col.key === filterColumn)?.dataType ?? "string"
        }
        columnKey={filterColumn ?? ""}
        handleFilter={handleFilter}
        dispatch={dispatch}
      />
    </div>
  );
};

export default DynamicTable;
