import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

type ColumnType = "string" | "number";

export interface Column {
  key: string;
  title: string;
  dataType: ColumnType;
  dataIndex: string;
}

export interface Row {
  key: string;
  [key: string]: string | number | string[];
}

interface TableState {
  columns: Column[];
  rows: Row[];
  filteredRows: Row[];
}

// Predefined columns and rows based on the provided images
const predefinedColumns: Column[] = [
  {
    key: "product_link",
    title: "PRODUCT LINK",
    dataType: "string",
    dataIndex: "product_link",
  },
  { key: "name", title: "NAME", dataType: "string", dataIndex: "name" },
  {
    key: "ingredients",
    title: "INGREDIENTS",
    dataType: "string",
    dataIndex: "ingredients",
  },
  { key: "price", title: "PRICE", dataType: "number", dataIndex: "price" },
];

const predefinedRows: Row[] = [
  {
    key: "1",
    product_link: "link1",
    name: "facewash",
    ingredients: "aloe vera",
    price: "190",
  },
  { key: "2", product_link: "link2", name: "Maaza", ingredients: "mango", price: "90" },
];

const loadStateFromLocalStorage = (): TableState => {
  if (typeof window === "undefined") {
    return { columns: [], rows: [], filteredRows: [] };
  }
  try {
    const serializedState = localStorage.getItem("tableData");
    if (serializedState === null) {
    
      const initialState: TableState = {
        columns: predefinedColumns,
        rows: predefinedRows,
        filteredRows: predefinedRows,
      };
      saveStateToLocalStorage(initialState); 
      return initialState;
    }
    const parsedState = JSON.parse(serializedState);
    return { ...parsedState, filteredRows: parsedState.rows };
  } catch (err) {
    console.error("Could not load state from localStorage", err);
    return { columns: [], rows: [], filteredRows: [] };
  }
};

const saveStateToLocalStorage = (state: TableState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("tableData", serializedState);
  } catch (err) {
    console.error("Could not save state to localStorage", err);
  }
};

const initialState: TableState = loadStateFromLocalStorage();

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    addColumn: (state, action: PayloadAction<Column>) => {
      state.columns.push(action.payload);
    },
    addRow: (state, action: PayloadAction<Row>) => {
      state.rows.push(action.payload);
      state.filteredRows = state.rows;
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.rows = state.rows.filter((row) => row.key !== action.payload);
      state.filteredRows = state.rows;
    },
    updateCell: (
      state,
      action: PayloadAction<{ rowIndex: number; colKey: string; value: any }>
    ) => {
      const { rowIndex, colKey, value } = action.payload;
      state.rows[rowIndex][colKey] = value;
      state.filteredRows = state.rows;
    },
    filterRows: (
      state,
      action: PayloadAction<{ columnKey: string; criteria: any }>
    ) => {
      const { columnKey, criteria } = action.payload;
      const { type, value } = criteria;

      const column = state.columns.find((col) => col.key === columnKey);
      if (!column) return;

      switch (column.dataType) {
        case "string":
          state.filteredRows = state.rows.filter((row) => {
            const cellValue = row[columnKey];
            if (typeof cellValue === "string") {
              switch (type) {
                case "contains":
                  return cellValue.toLowerCase().includes(value.toLowerCase());
                case "notContains":
                  return !cellValue.toLowerCase().includes(value.toLowerCase());
                default:
                  return true;
              }
            } else if (Array.isArray(cellValue)) {
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
          state.filteredRows = state.rows.filter((row) => {
            const cellValue = row[columnKey];
            if (typeof cellValue === "number") {
              switch (type) {
                case "lessThan":
                  return cellValue < value;
                case "greaterThan":
                  return cellValue > value;
                case "equalTo":
                  return cellValue === value;
                default:
                  return true;
              }
            }
            return true;
          });
          break;
        default:
          break;
      }
    },
    resetFilters: (state) => {
      state.filteredRows = state.rows;
    },
  },
});

export const {
  addColumn,
  addRow,
  deleteRow,
  updateCell,
  filterRows,
  resetFilters,
} = tableSlice.actions;

export const selectColumns = (state: RootState) => state.table.columns;
export const selectRows = (state: RootState) => state.table.filteredRows;

export default tableSlice.reducer;
