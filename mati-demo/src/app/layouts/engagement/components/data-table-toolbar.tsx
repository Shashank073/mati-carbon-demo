import { ListFilter, X, Eye, Settings2, SlidersHorizontal, ChevronRight, Check, MoreVertical, Filter, Columns } from "lucide-react"
import { Table } from "@tanstack/react-table"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { FilterSidebar, FilterValue } from "@/app/components/filter/components/FilterSidebar"

// Options
const villages = [
    { label: "Village A", value: "Village A" },
    { label: "Village B", value: "Village B" },
    { label: "Village C", value: "Village C" },
]

const types = [
    { label: "Engagement 1", value: "Engagement 1" },
    { label: "Engagement 2", value: "Engagement 2" },
    { label: "Engagement 3", value: "Engagement 3" },
    { label: "Engagement 4", value: "Engagement 4" },
    { label: "Con. Engagement 1", value: "Con. Engagement 1" },
]

const surveyors = [
    { label: "Surveyor A", value: "Surveyor A" },
    { label: "Surveyor B", value: "Surveyor B" },
    { label: "Surveyor C", value: "Surveyor C" },
]

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    activeTab: string
    setActiveTab: (value: string) => void
    counts: {
        verified: number
        pending: number
        invalid: number
    }
    activeColumns?: string[]
}

export function DataTableToolbar<TData>({
    table,
    activeTab,
    setActiveTab,
    counts,
    activeColumns = [],
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const filterCount = table.getState().columnFilters.length
    const [filterSidebarOpen, setFilterSidebarOpen] = React.useState(false)

    const handleApplyFilters = (filters: FilterValue) => {
        // Map the custom FilterValue structure to TanStack Table column filters
        if (filters.submittedOn?.from || filters.submittedOn?.to) {
            table.getColumn("submittedOn")?.setFilterValue([filters.submittedOn.from, filters.submittedOn.to])
        } else {
            table.getColumn("submittedOn")?.setFilterValue(undefined)
        }

        if (filters.farmers.length > 0) {
            table.getColumn("farmer")?.setFilterValue(filters.farmers)
        } else {
            table.getColumn("farmer")?.setFilterValue(undefined)
        }

        if (filters.engagementTypes.length > 0) {
            table.getColumn("engagementType")?.setFilterValue(filters.engagementTypes)
        } else {
            table.getColumn("engagementType")?.setFilterValue(undefined)
        }

        if (filters.villages.length > 0) {
            table.getColumn("village")?.setFilterValue(filters.villages)
        } else {
            table.getColumn("village")?.setFilterValue(undefined)
        }

        if (filters.azs.length > 0) {
            table.getColumn("azs")?.setFilterValue(filters.azs)
        } else {
            table.getColumn("azs")?.setFilterValue(undefined)
        }

        if (filters.surveyors.length > 0) {
            table.getColumn("surveyor")?.setFilterValue(filters.surveyors)
        } else {
            table.getColumn("surveyor")?.setFilterValue(undefined)
        }

        if (filters.statuses.length > 0) {
            const statusColumn = table.getAllColumns().find(col => col.id === "status")
            if (statusColumn) {
                statusColumn.setFilterValue(filters.statuses)
            }
        } else {
            table.getAllColumns().find(col => col.id === "status")?.setFilterValue(undefined)
        }

        if (filters.verifiedBy.length > 0) {
            table.getColumn("verifiedBy")?.setFilterValue(filters.verifiedBy)
        } else {
            table.getColumn("verifiedBy")?.setFilterValue(undefined)
        }

        if (filters.verifiedOn?.from || filters.verifiedOn?.to) {
            table.getColumn("verifiedOn")?.setFilterValue([filters.verifiedOn.from, filters.verifiedOn.to])
        } else {
            table.getColumn("verifiedOn")?.setFilterValue(undefined)
        }
    }

    return (
        <div className="flex items-center justify-between px-1 py-1">
            <div className="flex items-center space-x-2">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-10">
                    <TabsList>
                        <TabsTrigger
                            value="All"
                            className="text-xs"
                        >
                            All <span className="ml-2 opacity-50">{counts.verified + counts.pending + counts.invalid}</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="Verified"
                            className="text-xs"
                        >
                            Verified <span className="ml-2 opacity-50">{counts.verified}</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="Pending"
                            className="text-xs"
                        >
                            Pending <span className="ml-2 opacity-50">{counts.pending}</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="Invalid"
                            className="text-xs"
                        >
                            Need Correction <span className="ml-2 opacity-50">{counts.invalid}</span>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="flex items-center gap-2">
                {isFiltered && (
                    <div className="flex items-center gap-1.5 px-2.5 h-10 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm transition-all">
                        <button
                            onClick={() => setFilterSidebarOpen(true)}
                            className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 hover:opacity-70 transition-opacity"
                        >
                            {filterCount} {filterCount === 1 ? 'filter' : 'filters'}
                        </button>
                        <Separator orientation="vertical" className="h-4 bg-zinc-300 dark:bg-zinc-600" />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                table.resetColumnFilters();
                            }}
                            className="p-0.5 hover:bg-zinc-300/50 dark:hover:bg-zinc-600/50 rounded-sm transition-colors"
                            title="Clear all filters"
                        >
                            <X className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
                        </button>
                    </div>
                )}

                <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setFilterSidebarOpen(true)}
                    title="Filters"
                >
                    <Filter className="h-4 w-4" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="h-10 w-10 relative overflow-visible" title="Columns">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px]">
                        <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-zinc-500 px-2 py-1.5">Toggle Columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <ScrollArea className="h-[300px]">
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !== "undefined" && column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            onSelect={(e) => e.preventDefault()}
                                        >
                                            {column.id.replace(/([A-Z])/g, ' $1').trim()}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </ScrollArea>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <FilterSidebar 
                open={filterSidebarOpen}
                onOpenChange={setFilterSidebarOpen}
                onApply={handleApplyFilters}
                activeColumns={activeColumns}
            />
        </div>
    )
}
