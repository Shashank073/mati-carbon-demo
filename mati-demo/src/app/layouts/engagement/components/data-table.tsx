"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import * as React from "react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onRowClick?: (row: TData) => void
    activeTab: string
    setActiveTab: (value: string) => void
    counts: {
        verified: number
        pending: number
        invalid: number
    }
    selectedId?: string
    isLoading?: boolean
}

export function EngagementTable<TData, TValue>({
    columns,
    data,
    onRowClick,
    activeTab,
    setActiveTab,
    counts,
    selectedId,
    isLoading = false,
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [sorting, setSorting] = React.useState<SortingState>([])

    const activeColumnIds = React.useMemo(() => {
        return columns.map(col => (col as any).id || (col as any).accessorKey).filter(Boolean)
    }, [columns])

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        initialState: {
            pagination: {
                pageSize: 20,
            },
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    return (
        <div className="flex flex-col h-full gap-0 w-full relative overflow-hidden">
            <div className="shrink-0">
                <DataTableToolbar
                    table={table}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    counts={counts}
                    activeColumns={activeColumnIds}
                    isLoading={isLoading}
                />
            </div>
            <div className="rounded-md border flex-1 min-h-0 flex flex-col overflow-auto scrollbar-minimal relative">
                <Table className="relative w-max min-w-full border-collapse">
                    <TableHeader className="sticky top-0 z-10 bg-background shadow-sm">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent border-b">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className="whitespace-nowrap h-12 px-4 text-left align-middle bg-muted/50 border-b border-zinc-200 dark:border-zinc-800"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow className="hover:bg-transparent border-none">
                                <TableCell
                                    colSpan={columns.length}
                                    className="p-0"
                                >
                                    <div className="flex flex-col items-center justify-center h-[400px] w-full gap-3 animate-in fade-in duration-500">
                                        <Loader2 className="h-8 w-8 text-zinc-300 animate-spin" />
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Loading Records...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => {
                                const isSelected = selectedId === (row.original as any).id
                                return (
                                    <TableRow
                                        key={row.id}
                                        data-state={isSelected ? "selected" : undefined}
                                        className={cn(
                                            "cursor-pointer transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted animate-in fade-in slide-in-from-bottom-1 duration-500",
                                            isSelected ? "bg-muted/50" : ""
                                        )}
                                        onClick={() => onRowClick?.(row.original)}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="whitespace-nowrap p-4 align-middle">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
