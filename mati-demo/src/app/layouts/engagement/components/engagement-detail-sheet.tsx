"use client"

import * as React from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { EngagementRecord } from "../data/schema"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, MapPin, CheckCircle2, XCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { surveyData, SurveyCard } from "@/app/components/survey/SurveyComponents"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface EngagementDetailSheetProps {
    record: EngagementRecord | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onNext: () => void
    onPrevious: () => void
    isFirst: boolean
    isLast: boolean
}

export function EngagementDetailSheet({
    record,
    open,
    onOpenChange,
    onNext,
    onPrevious,
    isFirst,
    isLast
}: EngagementDetailSheetProps) {
    if (!record) return null

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-[500px] p-0 flex flex-col gap-0 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl">
                {/* Header section */}
                <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-14 w-14 border-2 border-white dark:border-zinc-800 shadow-sm">
                                <AvatarImage src={record.farmer.avatar} />
                                <AvatarFallback className="bg-zinc-100 text-zinc-600 font-bold">{record.farmer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                                <SheetTitle className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                                    {record.farmer.name}
                                </SheetTitle>
                                <SheetDescription asChild>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="flex items-center gap-1 text-xs text-zinc-500 font-medium">
                                            <MapPin className="h-3 w-3" />
                                            {record.village}
                                        </span>
                                    </div>
                                </SheetDescription>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 h-14 justify-center">
                            <Badge
                                variant={
                                    record.status === "Verified" ? "default" :
                                        record.status === "Invalid" ? "destructive" : "secondary"
                                }
                                className={cn(
                                    "px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest border-none shadow-none",
                                    record.status === "Verified" ? "bg-green-500 text-white dark:bg-green-600" :
                                        record.status === "Invalid" ? "bg-red-500 text-white dark:bg-red-600" :
                                            "bg-amber-500 text-white dark:bg-amber-600"
                                )}
                            >
                                {record.status}
                            </Badge>
                            <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 flex items-center justify-end gap-1.5 uppercase tracking-tight w-full">
                                <span className="opacity-70">{format(record.submittedOn, "dd MMM yyyy")}</span>
                                <Calendar className="h-3.5 w-3.5" />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content section - Style 5 (Feedback based) */}
                <ScrollArea className="flex-1">
                    <div className="p-6">
                        <div className="mb-4 flex items-center justify-between text-xs font-semibold text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                            <span className="tracking-tight">{record.engagementType}</span>
                            <span className="text-zinc-300 dark:text-zinc-700 font-light">•</span>
                            <span className="tracking-tight text-zinc-500 font-medium">AZ-{record.azs}</span>
                        </div>

                        <div className="space-y-1">
                            {surveyData.map((item) => (
                                <SurveyCard
                                    key={item.id}
                                    item={item}
                                    style="style-5-feedback"
                                    showDetails={false}
                                    isReporting={false}
                                />
                            ))}
                        </div>
                    </div>
                </ScrollArea>

                {/* Footer section */}
                <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 z-20 flex items-center justify-between gap-4">
                    {/* Left: Navigation */}
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                            onClick={onPrevious}
                            disabled={isFirst}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                            onClick={onNext}
                            disabled={isLast}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Right: Actions */}
                    {record.status !== "Verified" && (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="h-9 px-4 text-xs font-bold border-zinc-100 text-zinc-500 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
                                onClick={() => { }}
                            >
                                <XCircle className="mr-2 h-3.5 w-3.5" /> Reject
                            </Button>
                            <Button
                                className="h-9 px-5 text-xs font-bold bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 shadow-md transition-all active:scale-[0.98]"
                                onClick={() => { }}
                            >
                                <CheckCircle2 className="mr-2 h-3.5 w-3.5" /> Approve
                            </Button>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
