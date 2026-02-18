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
}

export function EngagementTable<TData, TValue>({
    columns,
    data,
    onRowClick,
    activeTab,
    setActiveTab,
    counts,
    selectedId,
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [isScrolling, setIsScrolling] = React.useState(false)
    const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
    const scrollContainerRef = React.useRef<HTMLDivElement>(null)
    const [scrollbarThumb, setScrollbarThumb] = React.useState({ height: 0, top: 0 })

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

    const updateScrollbarThumb = () => {
        const container = scrollContainerRef.current
        if (!container) return

        const { scrollHeight, clientHeight, scrollTop } = container

        // Calculate thumb height as a proportion of visible area to total content
        const thumbHeight = (clientHeight / scrollHeight) * clientHeight

        // Calculate thumb position based on scroll position
        const thumbTop = (scrollTop / scrollHeight) * clientHeight

        setScrollbarThumb({
            height: Math.max(thumbHeight, 20), // Minimum height of 20px
            top: thumbTop
        })
    }

    const handleScroll = () => {
        setIsScrolling(true)
        updateScrollbarThumb()

        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current)
        }

        scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false)
        }, 600)
    }

    React.useEffect(() => {
        updateScrollbarThumb()

        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current)
            }
        }
    }, [data])

    return (
        <div className="flex flex-col h-full gap-4">
            <DataTableToolbar
                table={table}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                counts={counts}
                activeColumns={activeColumnIds}
            />
            <div className="rounded-md border bg-white dark:bg-zinc-950 flex-1 min-h-0 overflow-hidden relative">
                <style jsx>{`
                    .scrollable-container {
                        overflow-y: scroll;
                        overflow-x: hidden;
                        scrollbar-width: none;
                        -ms-overflow-style: none;
                    }
                    .scrollable-container::-webkit-scrollbar {
                        display: none;
                    }
                    .custom-scrollbar {
                        position: absolute;
                        right: 2px;
                        width: 6px;
                        border-radius: 9999px;
                        background-color: transparent;
                        transition: background-color 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms cubic-bezier(0.4, 0, 0.2, 1);
                        pointer-events: none;
                        z-index: 50;
                    }
                    .custom-scrollbar.is-scrolling {
                        background-color: rgba(161, 161, 170, 0.5);
                    }
                    @media (prefers-color-scheme: dark) {
                        .custom-scrollbar.is-scrolling {
                            background-color: rgba(82, 82, 91, 0.5);
                        }
                    }
                `}</style>
                <div
                    ref={scrollContainerRef}
                    className="scrollable-container h-full"
                    onScroll={handleScroll}
                >
                    <table className="w-full caption-bottom text-sm relative">
                        <thead className="sticky top-0 z-10 bg-zinc-50 dark:bg-zinc-900 shadow-[0_1px_3px_0_rgb(0_0_0_/_0.1),0_1px_2px_-1px_rgb(0_0_0_/_0.1)]">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="border-b transition-colors hover:bg-transparent">
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <th
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                className="h-14 px-4 text-left align-middle font-medium text-xs font-semibold tracking-wide text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-900"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </th>
                                        )
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => {
                                    const isSelected = selectedId === (row.original as any).id
                                    return (
                                        <tr
                                            key={row.id}
                                            data-state={isSelected ? "selected" : undefined}
                                            className={cn(
                                                "border-b transition-colors cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50",
                                                isSelected ? "bg-zinc-100/80 dark:bg-zinc-800/80" : ""
                                            )}
                                            onClick={() => onRowClick?.(row.original)}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className="p-4 align-middle py-2.5">
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="h-24 text-center p-4 align-middle"
                                    >
                                        No results.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Custom overlay scrollbar */}
                <div
                    className={`custom-scrollbar ${isScrolling ? 'is-scrolling' : ''}`}
                    style={{
                        height: `${scrollbarThumb.height}px`,
                        top: `${scrollbarThumb.top}px`
                    }}
                />
            </div>
            <div className="shrink-0 py-2">
                <DataTablePagination table={table} />
            </div>
        </div>
    )

}
