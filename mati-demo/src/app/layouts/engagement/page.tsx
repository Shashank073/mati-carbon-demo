"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NavBarType4 } from "@/components/nav-bars/NavBarType4"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { engagementData } from "./data/mock-data"
import { columns as defaultColumns, allColumns } from "./components/columns"
import { EngagementTable } from "./components/data-table"
import { EngagementDetailSheet } from "./components/engagement-detail-sheet"
import { EngagementRecord } from "./data/schema"
import { cn } from "@/lib/utils"
import { surveyData } from "@/app/components/survey/SurveyComponents"

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

    // Filter survey data to only show questions 1-16 (hide 17-28)
    const filteredSurveyData = React.useMemo(() => {
        const baseData = surveyData.filter(item => {
            const idNum = parseInt(item.id);
            return idNum >= 1 && idNum <= 16;
        });

        // If the selected farmer has status "Invalid" and is "Farmer E", return all questions with empty answers
        if (selectedRecord?.status === "Invalid" && selectedRecord?.farmer.name === "Farmer E") {
            return baseData.map(item => ({
                ...item,
                answer: item.type === "badge" || item.type === "rank" || item.type === "repeater" ? [] : ""
            }));
        }

        return baseData;
    }, [selectedRecord?.id]);

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
            <div className="flex flex-col h-full gap-4">
                <div className="shrink-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Engagement</h1>
                            <p className="text-muted-foreground text-xs sm:text-sm">Manage ongoing farmer interactions and feedback.</p>
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
                />
            </div>
        </NavBarType4>
    )
}
