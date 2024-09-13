import {
  getGridNumericOperators,
  getGridStringOperators,
} from "@mui/x-data-grid";

// For number columns
export const numberOperators = [
  {
    label: "=",
    value: "equals",
    getApplyFilterFn: (filterItem: { value: any; }) => {
      return (params: { value: { value: never[]; }; }) => {
        const cellValue = params.value?.value || [];
        return cellValue.some((item: any) => item == filterItem.value);
      };
    },
  },
  {
    label: ">=",
    value: "greaterThanOrEqual",
    getApplyFilterFn: (filterItem: { value: number; }) => {
      return (params: { value: { value: never[]; }; }) => {
        const cellValue = params.value?.value || [];
        return cellValue.some((item: any) => item >= filterItem.value);
      };
    },
  },
];

// For string columns
export const stringOperators = [
  {
    label: "Contains",
    value: "contains",
    getApplyFilterFn: (filterItem: { value: any; }) => {
      return (params: { value: { value: never[]; }; }) => {
        const cellValue = params.value?.value || [];
        return cellValue.some((item: any) => item.includes(filterItem.value));
      };
    },
  },
];
