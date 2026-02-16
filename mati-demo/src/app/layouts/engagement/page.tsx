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

export default function EngagementPage() {
    const [selectedRecord, setSelectedRecord] = React.useState<EngagementRecord | null>(null)
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
    const [activeTab, setActiveTab] = React.useState<"All" | "Verified" | "Pending" | "Invalid">("Verified")

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

    // Dynamic columns
    const activeColumns = React.useMemo(() => {
        if (activeTab === "All") {
            return allColumns
        }
        if (activeTab === "Verified") {
            return defaultColumns
        }
        return defaultColumns.filter(col => (col as any).accessorKey !== "verified")
    }, [activeTab])

    return (
        <NavBarType4 activeItem="Engagement">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Engagement</h1>
                        <p className="text-muted-foreground text-sm">Manage ongoing farmer interactions and feedback.</p>
                    </div>
                    <div className="relative">
                        <Button variant="outline" size="icon" className="h-10 w-10 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                            <MessageSquare className="h-5 w-5 text-zinc-900 dark:text-zinc-50" />
                        </Button>
                        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm">
                            5
                        </span>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-950 overflow-hidden">
                    <EngagementTable
                        key={activeTab} // Re-mount table when tab changes for fresh state
                        data={filteredData}
                        columns={activeColumns}
                        onRowClick={handleRecordClick}
                        activeTab={activeTab}
                        setActiveTab={(val) => setActiveTab(val as any)}
                        counts={{
                            verified: verifiedCount,
                            pending: pendingCount,
                            invalid: invalidCount,
                        }}
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
                />
            </div>
        </NavBarType4>
    )
}

