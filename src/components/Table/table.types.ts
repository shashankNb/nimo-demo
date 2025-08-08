import React from "react";
import type {ComponentInfo} from "@/components/Status/Status.tsx";

export interface Option {
    label: string;
    value: string;
}

export interface Column<T> {
    id: keyof T;
    label: string;
    inputType?: 'INPUT' | 'DATE' | 'OPTIONS' | 'NONE';
    options?: Option[];
    sortable?: boolean;
    searchable?: boolean;
    align?: 'right' | 'left' | 'center';
    render?: (value: any, row: T, rowIndex: number) => React.ReactNode;
    sortFn?: (a: T, b: T) => number;
}

export interface Props<T> {
    columns: Column<T>[];
    componentInfos?: ComponentInfo[];
    data: T[];
    rowsPerPageOptions?: number[];
    defaultRowsPerPage?: number;
}

export interface FilterPopoverProps<T> {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    currentColumn: Column<T> | undefined;
    onApply: (value: string, autoClose?: boolean) => void;
    tempSearch: string;
    onTempSearchChange: (value: string) => void;
}

export interface ActiveFiltersProps<T> {
    filters: Record<string, string>;
    columns: Column<T>[];
    onClear: (columnId: string) => void;
}