import { ListFilter, X, Eye } from "lucide-react"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

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

const statuses = [
    { label: "Approved", value: "Approved" },
    { label: "Pending", value: "Pending" },
    { label: "Rejected", value: "Rejected" },
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
}

export function DataTableToolbar<TData>({
    table,
    activeTab,
    setActiveTab,
    counts,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="flex items-center justify-between">
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
                            Invalid <span className="ml-2 opacity-50">{counts.invalid}</span>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="flex items-center gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" className="h-10 w-10 relative">
                            <ListFilter className="h-4 w-4" />
                            {isFiltered && (
                                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white" />
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-2" align="end">
                        <div className="space-y-2">
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                                Filters
                            </div>
                            <div className="space-y-1">
                                {table.getColumn("village") && (
                                    <DataTableFacetedFilter
                                        column={table.getColumn("village")}
                                        title="Village"
                                        options={villages}
                                    />
                                )}
                                {table.getColumn("engagementType") && (
                                    <DataTableFacetedFilter
                                        column={table.getColumn("engagementType")}
                                        title="Type"
                                        options={types}
                                    />
                                )}
                                {table.getColumn("surveyor") && (
                                    <DataTableFacetedFilter
                                        column={table.getColumn("surveyor")}
                                        title="Surveyor"
                                        options={surveyors}
                                    />
                                )}
                            </div>
                            {isFiltered && (
                                <div className="pt-2">
                                    <Separator className="mb-2" />
                                    <Button
                                        variant="ghost"
                                        onClick={() => table.resetColumnFilters()}
                                        className="h-8 w-full justify-start px-2 font-normal text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Reset Filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    </PopoverContent>
                </Popover>

                <DataTableViewOptions table={table} />
            </div>
        </div>
    )
}
