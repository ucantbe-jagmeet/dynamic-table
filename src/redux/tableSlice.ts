// tableSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

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

interface TableState {
  columns: Column[];
  rows: Row[];
  filteredRows: Row[];
}

const loadStateFromLocalStorage = (): TableState => {
  try {
    const serializedState = localStorage.getItem("tableData");
    if (serializedState === null) {
      return { columns: [], rows: [], filteredRows: [] };
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
      saveStateToLocalStorage(state);
    },
    addRow: (state, action: PayloadAction<Row>) => {
      state.rows.push(action.payload);
      state.filteredRows = state.rows;
      saveStateToLocalStorage(state);
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.rows = state.rows.filter((row) => row.key !== action.payload);
      state.filteredRows = state.rows;
      saveStateToLocalStorage(state);
    },
    updateCell: (
      state,
      action: PayloadAction<{ rowIndex: number; colKey: string; value: any }>
    ) => {
      const { rowIndex, colKey, value } = action.payload;
      state.rows[rowIndex][colKey] = value;
      state.filteredRows = state.rows;
      saveStateToLocalStorage(state);
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
