import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ColumnType = "string" | "number";

interface Column {
  id: string;
  name: string;
  type: ColumnType;
}

interface Row {
  id: string;
  [key: string]: any; 
}

interface TableState {
  columns: Column[];
  rows: Row[];
}

const initialState: TableState = {
  columns: [],
  rows: [],
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    addColumn: (
      state,
      action: PayloadAction<{ name: string; type: ColumnType }>
    ) => {
      const newColumn: Column = {
        id: Math.random().toString(36).substring(7),
        name: action.payload.name,
        type: action.payload.type,
      };
      state.columns.push(newColumn);
    },
    addRow: (state) => {
      const newRow: Row = {
        id: Math.random().toString(36).substring(7),
      };
      state.rows.push(newRow);
    },
    updateCell: (
      state,
      action: PayloadAction<{ rowId: string; columnName: string; value: any }>
    ) => {
      const { rowId, columnName, value } = action.payload;
      const row = state.rows.find((r) => r.id === rowId);
      if (row) {
        row[columnName] = value;
      }
    },
    filterRows: (
      state,
      action: PayloadAction<{ columnName: string; filterValue: any }>
    ) => {
      const { columnName, filterValue } = action.payload;
      state.rows = state.rows.filter((row) =>
        Array.isArray(row[columnName])
          ? row[columnName].includes(filterValue)
          : row[columnName] === filterValue
      );
    },
    sortRows: (
      state,
      action: PayloadAction<{ columnName: string; order: "asc" | "desc" }>
    ) => {
      const { columnName, order } = action.payload;
      state.rows.sort((a, b) => {
        if (a[columnName] === undefined || b[columnName] === undefined)
          return 0;
        if (order === "asc") {
          return a[columnName] > b[columnName] ? 1 : -1;
        } else {
          return a[columnName] < b[columnName] ? 1 : -1;
        }
      });
    },
  },
});

export const { addColumn, addRow, updateCell, filterRows, sortRows } =
  tableSlice.actions;
export default tableSlice.reducer;
