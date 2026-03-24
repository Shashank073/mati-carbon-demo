"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NavBarType4 } from "@/components/nav-bars/NavBarType4"
import { Button } from "@/components/ui/button"
import { MessageSquare, Info } from "lucide-react"
import { engagementData } from "./data/mock-data"
import { columns as defaultColumns, allColumns } from "./components/columns"
import { EngagementTable } from "./components/data-table"
import { EngagementDetailSheet } from "./components/engagement-detail-sheet"
import { EngagementRecord } from "./data/schema"
import { cn } from "@/lib/utils"
import { surveyData } from "@/app/components/survey/SurveyComponents"
import { format } from "date-fns"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function EngagementPage() {
    const [selectedRecord, setSelectedRecord] = React.useState<EngagementRecord | null>(null)
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
    const [activeTab, setActiveTab] = React.useState<"All" | "Verified" | "Pending" | "Invalid">("Verified")
    const [isLoading, setIsLoading] = React.useState(false)

    const handleTabChange = (val: string) => {
        setIsLoading(true)
        setActiveTab(val as any)
        // Simulate API loading with 1 second deliberate delay
        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
    }

    const handleRecordClick = (record: EngagementRecord) => {
        setSelectedRecord(record)
        setIsDrawerOpen(true)
    }

    // Filter data based on tab
    const filteredData = activeTab === "All"
        ? engagementData
        : engagementData.filter(item => item.status === activeTab)

    const handleNext = () => {
        if (!selectedRecord) return
        const currentIndex = filteredData.findIndex(r => r.id === selectedRecord.id)
        if (currentIndex < filteredData.length - 1) {
            setSelectedRecord(filteredData[currentIndex + 1])
        }
    }

    const handlePrevious = () => {
        if (!selectedRecord) return
        const currentIndex = filteredData.findIndex(r => r.id === selectedRecord.id)
        if (currentIndex > 0) {
            setSelectedRecord(filteredData[currentIndex - 1])
        }
    }

    const currentIndex = selectedRecord ? filteredData.findIndex(r => r.id === selectedRecord.id) : -1
    const isFirst = currentIndex === 0
    const isLast = currentIndex === filteredData.length - 1

    // Calculate counts
    const verifiedCount = engagementData.filter(item => item.status === "Verified").length
    const pendingCount = engagementData.filter(item => item.status === "Pending").length
    const invalidCount = engagementData.filter(item => item.status === "Invalid").length

    const selectedIdNum = selectedRecord ? selectedRecord.id : 0;

    // Filter survey data to only show questions 1-16 (hide 17-28)
    const filteredSurveyData = React.useMemo(() => {
        let baseData = surveyData.filter(item => {
            const idNum = parseInt(item.id);
            return idNum >= 1 && idNum <= 16;
        });

        // For presentation: hide location question (ID: 7) for every 3rd farmer
        if (selectedRecord && selectedIdNum % 3 === 0) {
            baseData = baseData.filter(item => item.id !== "7");
        }

        // If the selected farmer has status "Invalid" and is "Farmer E", return all questions with empty answers
        if (selectedRecord?.status === "Invalid" && selectedRecord?.farmer.name === "Farmer E") {
            return baseData.map(item => ({
                ...item,
                answer: item.type === "badge" || item.type === "rank" || item.type === "repeater" ? [] : ""
            }));
        }

        return baseData;
    }, [selectedRecord?.id, selectedIdNum]);

    const hasLocationQuestion = React.useMemo(() => {
        return filteredSurveyData.some(item => item.id === "7");
    }, [filteredSurveyData]);

    // Dynamic columns
    const activeColumns = React.useMemo(() => {
        if (activeTab === "All") {
            return allColumns
        }
        if (activeTab === "Verified") {
            return defaultColumns
        }
        // Filter out verification columns for Pending and Need Correction tabs
        return defaultColumns.filter(col => 
            (col as any).id !== "verifiedBy" && (col as any).id !== "verifiedOn"
        )
    }, [activeTab])

    return (
        <NavBarType4 activeItem="Engagement">
            <div className="flex flex-col h-full gap-6">
                <div className="shrink-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-baseline gap-2">
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Engagement</h1>
                            <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <button className="inline-flex items-center justify-center rounded-full w-5 h-5 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors translate-y-[1px]">
                                            <Info className="w-4 h-4" />
                                            <span className="sr-only">About Engagement</span>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="max-w-[280px] p-3 text-xs leading-relaxed">
                                        <p className="font-medium mb-1">Engagement Management</p>
                                        <p className="text-zinc-500 dark:text-zinc-400">
                                            Track and manage ongoing farmer interactions, feedback, and survey responses. 
                                            Review verification status, monitor pending tasks, and address records requiring correction to ensure high-quality data collection.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-950 flex-1 min-h-0 flex flex-col">
                    <EngagementTable
                        key={activeTab} // Re-mount table when tab changes for fresh state
                        data={filteredData}
                        columns={activeColumns}
                        onRowClick={handleRecordClick}
                        activeTab={activeTab}
                        setActiveTab={handleTabChange}
                        counts={{
                            verified: verifiedCount,
                            pending: pendingCount,
                            invalid: invalidCount,
                        }}
                        selectedId={selectedRecord?.id}
                        isLoading={isLoading}
                    />
                </div>

                <EngagementDetailSheet
                    record={selectedRecord}
                    open={isDrawerOpen}
                    onOpenChange={setIsDrawerOpen}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    isFirst={isFirst}
                    isLast={isLast}
                    currentIndex={currentIndex}
                    totalCount={filteredData.length}
                    surveyData={filteredSurveyData}
                    hasLocationQuestion={hasLocationQuestion}
                />

                {/* Footer Section */}
                <div className="shrink-0 py-3 px-1 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        <div className="flex items-center gap-4">
                            <span>Version 1.2.4-stable</span>
                            <span className="hidden sm:inline opacity-30">|</span>
                            <div className="flex items-center gap-1.5">
                                <span>All rights reserved by Mati Carbon Pvt</span>
                                <button className="text-zinc-900 dark:text-zinc-300 hover:underline underline-offset-2 font-bold">TnC</button>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <span className="opacity-50">Session ID:</span>
                                <span className="font-mono text-zinc-600 dark:text-zinc-400">MC-8824-X92</span>
                            </div>
                            <span className="hidden sm:inline opacity-30">|</span>
                            <div className="flex items-center gap-1.5">
                                <span className="opacity-50">Last Refreshed:</span>
                                <span className="text-zinc-600 dark:text-zinc-400">{format(new Date(), "dd MMM yyyy, hh:mm aa")}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </NavBarType4>
    )
}
