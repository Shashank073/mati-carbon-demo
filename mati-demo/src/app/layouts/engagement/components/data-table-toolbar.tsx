import { X, Eye, Filter, Loader2 } from "lucide-react"
import { Table } from "@tanstack/react-table"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { FilterSidebar, FilterValue } from "@/app/components/filter/components/FilterSidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { flexRender } from "@tanstack/react-table"

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
    isLoading?: boolean
}

export function DataTableToolbar<TData>({
    table,
    activeTab,
    setActiveTab,
    counts,
    activeColumns = [],
    isLoading = false,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const filterCount = table.getState().columnFilters.length
    const [filterSidebarOpen, setFilterSidebarOpen] = React.useState(false)

    const handleApplyFilters = (filters: FilterValue) => {
        // Map the custom FilterValue structure to TanStack Table column filters
        const safeSetFilter = (columnId: string, value: any) => {
            // Use getAllColumns to avoid the error thrown by getColumn when a column is missing
            const column = table.getAllColumns().find(col => col.id === columnId);
            if (column) {
                column.setFilterValue(value);
            }
        };

        if (filters.submittedOn?.from || filters.submittedOn?.to) {
            safeSetFilter("submittedOn", [filters.submittedOn.from, filters.submittedOn.to]);
        } else {
            safeSetFilter("submittedOn", undefined);
        }

        if (filters.farmers.length > 0) {
            safeSetFilter("farmer", filters.farmers);
        } else {
            safeSetFilter("farmer", undefined);
        }

        if (filters.engagementTypes.length > 0) {
            safeSetFilter("engagementType", filters.engagementTypes);
        } else {
            safeSetFilter("engagementType", undefined);
        }

        if (filters.bases.length > 0) {
            safeSetFilter("base", filters.bases);
        } else {
            safeSetFilter("base", undefined);
        }

        if (filters.villages.length > 0) {
            safeSetFilter("village", filters.villages);
        } else {
            safeSetFilter("village", undefined);
        }

        if (filters.azs.length > 0) {
            safeSetFilter("azs", filters.azs);
        } else {
            safeSetFilter("azs", undefined);
        }

        if (filters.surveyors.length > 0) {
            safeSetFilter("surveyor", filters.surveyors);
        } else {
            safeSetFilter("surveyor", undefined);
        }

        if (filters.statuses.length > 0) {
            safeSetFilter("status", filters.statuses);
        } else {
            safeSetFilter("status", undefined);
        }

        if (filters.verifiedBy.length > 0) {
            safeSetFilter("verifiedBy", filters.verifiedBy);
        } else {
            safeSetFilter("verifiedBy", undefined);
        }

        if (filters.matiDeployed?.min !== undefined || filters.matiDeployed?.max !== undefined) {
            safeSetFilter("matiDeployed", [filters.matiDeployed.min, filters.matiDeployed.max]);
        } else {
            safeSetFilter("matiDeployed", undefined);
        }

        if (filters.verifiedOn?.from || filters.verifiedOn?.to) {
            safeSetFilter("verifiedOn", [filters.verifiedOn.from, filters.verifiedOn.to]);
        } else {
            safeSetFilter("verifiedOn", undefined);
        }
    }

    return (
        <div className="flex flex-row items-center justify-between gap-4 w-full mb-[16px] min-w-0 overflow-hidden">
            <div className="flex items-center min-w-0 flex-1 gap-4 overflow-hidden">
                <div className="flex-1 min-w-0 overflow-x-auto scrollbar-none">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto shrink-0">
                        <TabsList className="h-10 w-max justify-start bg-muted p-1">
                            <TabsTrigger
                                value="All"
                                className="text-xs px-3 h-8 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                            >
                                All <span className="ml-2 opacity-50 font-normal">{counts.verified + counts.pending + counts.invalid}</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="Verified"
                                className="text-xs px-3 h-8 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                            >
                                Verified <span className="ml-2 opacity-50 font-normal">{counts.verified}</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="Pending"
                                className="text-xs px-3 h-8 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                            >
                                Pending <span className="ml-2 opacity-50 font-normal">{counts.pending}</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="Invalid"
                                className="text-xs px-3 h-8 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                            >
                                Need Correction <span className="ml-2 opacity-50 font-normal">{counts.invalid}</span>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            <div className="flex items-center gap-2 justify-end shrink-0">
                <div className={cn(
                    "flex items-center h-10 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm transition-all overflow-hidden",
                    isFiltered ? "pl-3 pr-1 gap-2 bg-zinc-100/50 dark:bg-zinc-900/50" : ""
                )}>
                    {isFiltered ? (
                        <>
                            <button
                                onClick={() => setFilterSidebarOpen(true)}
                                className="flex items-center gap-2 h-full hover:opacity-70 transition-opacity pr-1"
                            >
                                <Filter className="h-4 w-4 text-zinc-900 dark:text-zinc-50" />
                                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50 whitespace-nowrap">
                                    {filterCount} {filterCount === 1 ? 'filter' : 'filters'}
                                </span>
                            </button>
                            <Separator orientation="vertical" className="h-4 bg-zinc-200 dark:border-zinc-800" />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    table.resetColumnFilters();
                                }}
                                className="h-8 w-8 p-0 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 rounded-sm transition-colors shrink-0"
                                title="Clear all filters"
                            >
                                <X className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-none hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors shrink-0 text-zinc-900 dark:text-zinc-50"
                            onClick={() => setFilterSidebarOpen(true)}
                            title="Filters"
                        >
                            <Filter className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="h-10 w-10 relative overflow-visible shrink-0 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50" title="Columns">
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
                                    // Try to get the title from the header function if it's a DataTableColumnHeader
                                    // or use the id/accessorKey as a fallback
                                    let title = column.id
                                    
                                    if (typeof column.columnDef.header === 'function') {
                                        // This is a bit of a hack to extract the title from the DataTableColumnHeader component
                                        // since we can't easily execute the header function here without the context
                                        const headerElement = column.columnDef.header({ column, table: table as any, header: {} as any })
                                        if (headerElement && typeof headerElement === 'object' && 'props' in headerElement) {
                                            title = (headerElement.props as any).title || title
                                        }
                                    } else if (typeof column.columnDef.header === 'string') {
                                        title = column.columnDef.header
                                    }

                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            onSelect={(e) => e.preventDefault()}
                                        >
                                            {title.replace(/([A-Z])/g, ' $1').trim()}
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
