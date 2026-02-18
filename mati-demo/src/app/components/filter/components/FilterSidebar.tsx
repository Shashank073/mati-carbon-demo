"use client";

import * as React from "react";
import { 
    Calendar as CalendarIcon, 
    X, 
    Search,
    RotateCcw,
    ChevronDown,
    Check
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export interface FilterValue {
    submittedOn?: { from?: Date; to?: Date };
    verifiedOn?: { from?: Date; to?: Date };
    farmers: string[];
    engagementTypes: string[];
    villages: string[];
    azs: string[];
    surveyors: string[];
    statuses: string[];
    verifiedBy: string[];
}

interface FilterSidebarProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onApply: (filters: FilterValue) => void;
    initialFilters?: FilterValue;
}

const ENGAGEMENT_TYPES = [
    "Engagement 1",
    "Engagement 2",
    "Engagement 3",
    "Engagement 4",
    "Con. Engagement 1",
];

const VILLAGES = [
    "Village A",
    "Village B",
    "Village C",
];

const STATUS_OPTIONS = [
    "Verified",
    "Pending",
    "Invalid",
];

const AZ_OPTIONS = Array.from({ length: 10 }, (_, i) => `AZ ${i + 1}`);

const SURVEYOR_OPTIONS = [
    "Surveyor A",
    "Surveyor B",
    "Surveyor C",
];

const VERIFIER_OPTIONS = [
    "Verifier A",
    "Verifier B",
    "Verifier C",
];

const DEFAULT_FILTERS: FilterValue = {
    farmers: [],
    engagementTypes: [...ENGAGEMENT_TYPES],
    villages: [...VILLAGES],
    azs: [...AZ_OPTIONS],
    surveyors: [...SURVEYOR_OPTIONS],
    statuses: [...STATUS_OPTIONS],
    verifiedBy: [...VERIFIER_OPTIONS],
};

const COLUMN_MAPPING: Record<string, string[]> = {
    engagementTypes: ENGAGEMENT_TYPES,
    villages: VILLAGES,
    azs: AZ_OPTIONS,
    surveyors: SURVEYOR_OPTIONS,
    statuses: STATUS_OPTIONS,
    verifiedBy: VERIFIER_OPTIONS,
};

export function FilterSidebar({ open, onOpenChange, onApply, initialFilters, activeColumns = [] }: FilterSidebarProps & { activeColumns?: string[] }) {
    const [filters, setFilters] = React.useState<FilterValue>(initialFilters || DEFAULT_FILTERS);
    const [farmerInput, setFarmerInput] = React.useState("");

    // Filter out options based on active columns
    const visibleFields = React.useMemo(() => {
        const fields: (keyof FilterValue)[] = [
            'submittedOn', 'farmers', 'engagementTypes', 'villages', 
            'azs', 'surveyors', 'statuses', 'verifiedBy', 'verifiedOn'
        ];
        
        if (activeColumns.length === 0) return fields;

        return fields.filter(field => {
            if (field === 'farmers') return activeColumns.includes('farmer');
            if (field === 'engagementTypes') return activeColumns.includes('engagementType');
            if (field === 'villages') return activeColumns.includes('village');
            if (field === 'surveyors') return activeColumns.includes('surveyor');
            if (field === 'statuses') return activeColumns.includes('status');
            // Date fields and search fields often match their column IDs
            return activeColumns.includes(field);
        });
    }, [activeColumns]);

    const handleResetField = (field: keyof FilterValue) => {
        setFilters(prev => ({ 
            ...prev, 
            [field]: DEFAULT_FILTERS[field]
        }));
    };

    const resetAll = () => {
        setFilters(DEFAULT_FILTERS);
        setFarmerInput("");
    };

    const toggleMultiSelect = (field: keyof FilterValue, value: string, allOptions: string[]) => {
        setFilters(prev => {
            const current = prev[field] as string[];
            
            if (value === "all") {
                const next = current.length === allOptions.length ? [] : [...allOptions];
                return { ...prev, [field]: next };
            }

            const next = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, [field]: next };
        });
    };

    const addFarmer = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && farmerInput.trim()) {
            if (!filters.farmers.includes(farmerInput.trim())) {
                setFilters(prev => ({ ...prev, farmers: [...prev.farmers, farmerInput.trim()] }));
            }
            setFarmerInput("");
        }
    };

    const removeFarmer = (name: string) => {
        setFilters(prev => ({ ...prev, farmers: prev.farmers.filter(f => f !== name) }));
    };

    const renderDateRange = (label: string, field: 'submittedOn' | 'verifiedOn') => {
        return (
            <div className="p-4 space-y-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{label}</Label>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-auto p-0 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors" 
                        onClick={() => handleResetField(field)}
                    >
                        Reset
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full justify-between h-10 px-3 text-xs border-zinc-200 dark:border-zinc-800", !filters[field]?.from && "text-muted-foreground")}>
                                {filters[field]?.from ? format(filters[field]!.from!, "yyyy-MM-dd") : "From"}
                                <CalendarIcon className="h-4 w-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={filters[field]?.from} onSelect={(d) => setFilters(prev => ({ ...prev, [field]: { ...prev[field], from: d } }))} />
                        </PopoverContent>
                    </Popover>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full justify-between h-10 px-3 text-xs border-zinc-200 dark:border-zinc-800", !filters[field]?.to && "text-muted-foreground")}>
                                {filters[field]?.to ? format(filters[field]!.to!, "yyyy-MM-dd") : "To"}
                                <CalendarIcon className="h-4 w-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={filters[field]?.to} onSelect={(d) => setFilters(prev => ({ ...prev, [field]: { ...prev[field], to: d } }))} />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        );
    };

    const renderMultiSelectDropdown = (label: string, field: keyof FilterValue, options: string[]) => {
        const selected = (filters[field] as string[]) || [];
        const isAllSelected = selected.length === options.length;
        
        return (
            <div className="p-4 space-y-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{label}</Label>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-auto p-0 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors" 
                        onClick={() => handleResetField(field)}
                    >
                        Reset
                    </Button>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between h-10 px-3 text-xs border-zinc-200 dark:border-zinc-800 font-normal">
                            <span className="truncate">
                                {isAllSelected ? "All" : 
                                 selected.length === 0 ? "None selected" : 
                                 `${selected.length} selected`}
                            </span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[348px]" align="start">
                        <DropdownMenuCheckboxItem
                            checked={isAllSelected}
                            onCheckedChange={() => toggleMultiSelect(field, "all", options)}
                            onSelect={(e) => e.preventDefault()}
                        >
                            All
                        </DropdownMenuCheckboxItem>
                        {options.map((option) => (
                            <DropdownMenuCheckboxItem
                                key={option}
                                checked={selected.includes(option)}
                                onCheckedChange={() => toggleMultiSelect(field, option, options)}
                                onSelect={(e) => e.preventDefault()}
                            >
                                {option}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-[380px] p-0 flex flex-col gap-0 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl">
                <SheetHeader className="p-4 border-b border-zinc-100 dark:border-zinc-800">
                    <SheetTitle className="text-base font-medium text-zinc-900 dark:text-zinc-50">
                        Filters
                    </SheetTitle>
                </SheetHeader>

                <ScrollArea className="flex-1">
                    {visibleFields.includes('submittedOn') && renderDateRange("Submitted on", "submittedOn")}
                    {visibleFields.includes('farmers') && (
                        <div className="p-4 space-y-4 border-b border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Farmers</Label>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-auto p-0 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors" 
                                    onClick={() => handleResetField('farmers')}
                                >
                                    Reset
                                </Button>
                            </div>
                            <div className="space-y-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    <Input
                                        className="h-10 pl-9 text-xs border-zinc-200 dark:border-zinc-800"
                                        placeholder="Type name and press Enter..."
                                        value={farmerInput}
                                        onChange={(e) => setFarmerInput(e.target.value)}
                                        onKeyDown={addFarmer}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {filters.farmers.map(farmer => (
                                        <Badge key={farmer} variant="secondary" className="pl-2 pr-1 py-1 gap-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-none">
                                            {farmer}
                                            <button onClick={() => removeFarmer(farmer)} className="hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full p-0.5">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {visibleFields.includes('engagementTypes') && renderMultiSelectDropdown("Engagement type", "engagementTypes", ENGAGEMENT_TYPES)}
                    {visibleFields.includes('villages') && renderMultiSelectDropdown("Village", "villages", VILLAGES)}
                    {visibleFields.includes('azs') && renderMultiSelectDropdown("AZs", "azs", AZ_OPTIONS)}
                    {visibleFields.includes('surveyors') && renderMultiSelectDropdown("Surveyor", "surveyors", SURVEYOR_OPTIONS)}
                    {visibleFields.includes('statuses') && renderMultiSelectDropdown("Status", "statuses", STATUS_OPTIONS)}
                    {visibleFields.includes('verifiedBy') && renderMultiSelectDropdown("Verified By", "verifiedBy", VERIFIER_OPTIONS)}
                    {visibleFields.includes('verifiedOn') && renderDateRange("Verified On", "verifiedOn")}
                </ScrollArea>

                <SheetFooter className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-row items-center gap-3 sm:justify-between">
                    <Button variant="outline" className="flex-1 h-10 text-sm font-medium border-zinc-200 dark:border-zinc-800" onClick={resetAll}>Reset all</Button>
                    <Button className="flex-1 h-10 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-900 text-sm font-medium shadow-none" onClick={() => { onApply(filters); onOpenChange(false); }}>Apply now</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
