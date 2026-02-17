"use client"

import { ColumnDef } from "@tanstack/react-table"
import { EngagementRecord } from "../data/schema"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "./data-table-column-header"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Eye, EyeOff, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

// --- Helper Components ---

const PhoneNumberCell = ({ phoneNumber, showEyeByDefault = false }: { phoneNumber?: string, showEyeByDefault?: boolean }) => {
    const [isVisible, setIsVisible] = useState(false)
    if (!phoneNumber) return <span className="text-muted-foreground">-</span>

    const maskedNumber = phoneNumber.replace(/.(?=.{4})/g, "*")

    return (
        <div className="flex items-center gap-2 group">
            <span className="text-sm font-medium font-mono">
                {isVisible ? phoneNumber : maskedNumber}
            </span>
            <Button
                variant="ghost"
                size="icon"
                className={cn(
                    "h-6 w-6 transition-opacity",
                    showEyeByDefault ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
                onClick={(e) => {
                    e.stopPropagation()
                    setIsVisible(!isVisible)
                }}
            >
                {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
        </div>
    )
}

const FarmerHoverCard = ({ farmer }: { farmer: EngagementRecord["farmer"] }) => {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <div className="flex items-center gap-3 cursor-help group">
                    <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-800">
                        <AvatarImage src={farmer.avatar} alt={farmer.name} />
                        <AvatarFallback>{farmer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col leading-tight">
                        <span className="font-semibold text-sm">{farmer.name}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                            {farmer.phoneNumber?.replace(/.(?=.{4})/g, "*")}
                        </span>
                    </div>
                </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 z-[300] p-4">
                <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 border border-zinc-200 dark:border-zinc-800">
                        <AvatarImage src={farmer.avatar} />
                        <AvatarFallback>{farmer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1.5 flex-1">
                        <h4 className="text-sm font-semibold leading-none">{farmer.name}</h4>
                        <div className="flex items-center gap-2 pt-1">
                            <Phone className="h-3 w-3 opacity-70 shrink-0" />
                            <PhoneNumberCell phoneNumber={farmer.phoneNumber} showEyeByDefault={true} />
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

const SurveyorHoverCard = ({ surveyor }: { surveyor: EngagementRecord["surveyor"] }) => {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <div className="flex flex-col leading-tight cursor-help group">
                    <span className="font-semibold text-sm">{surveyor.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                        {surveyor.phoneNumber?.replace(/.(?=.{4})/g, "*")}
                    </span>
                </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 z-[300] p-4">
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold leading-none">{surveyor.name}</h4>
                    <div className="flex items-center gap-2 pt-1">
                        <Phone className="h-3 w-3 opacity-70 shrink-0" />
                        <PhoneNumberCell phoneNumber={surveyor.phoneNumber} showEyeByDefault={true} />
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

// Default columns for Verified/Pending/Invalid tabs
export const columns: ColumnDef<EngagementRecord>[] = [
    {
        accessorKey: "submittedOn",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Submitted on" />
        ),
        cell: ({ row }) => {
            const date = row.getValue("submittedOn") as Date
            return <div className="text-sm">{format(date, "dd MMM yy").toUpperCase()}</div>
        },
    },
    {
        id: "farmer",
        accessorFn: (row) => row.farmer.name,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Farmer" />
        ),
        cell: ({ row }) => <FarmerHoverCard farmer={row.original.farmer} />,
    },
    {
        accessorKey: "engagementType",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Engagement type" />
        ),
        cell: ({ row }) => <div className="text-sm">{row.getValue("engagementType")}</div>,
    },
    {
        accessorKey: "village",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Village" />
        ),
        cell: ({ row }) => <div className="text-sm">{row.getValue("village")}</div>,
    },
    {
        accessorKey: "azs",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="AZs" />
        ),
        cell: ({ row }) => <div className="text-sm">{row.getValue("azs")}</div>,
    },
    {
        accessorKey: "surveyor",
        id: "surveyor",
        accessorFn: (row) => row.surveyor.name,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Surveyor" />
        ),
        cell: ({ row }) => <SurveyorHoverCard surveyor={row.original.surveyor} />,
    },
    {
        id: "verifiedBy",
        accessorFn: (row) => row.verified?.verifier,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Verified By" />
        ),
        cell: ({ row }) => {
            const verified = row.original.verified
            if (!verified) return <span className="text-muted-foreground">-</span>
            return <div className="text-sm font-medium">{verified.verifier}</div>
        },
    },
    {
        id: "verifiedOn",
        accessorFn: (row) => row.verified?.date,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Verified On" />
        ),
        cell: ({ row }) => {
            const verified = row.original.verified
            if (!verified) return <span className="text-muted-foreground">-</span>
            return <div className="text-sm">{format(verified.date, "dd MMM yy").toUpperCase()}</div>
        },
    },
]

// Columns for the "All" tab view
export const allColumns: ColumnDef<EngagementRecord>[] = [
    {
        accessorKey: "submittedOn",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Submitted on" />
        ),
        cell: ({ row }) => {
            const date = row.getValue("submittedOn") as Date
            return <div className="text-sm">{format(date, "dd MMM yy").toUpperCase()}</div>
        },
    },
    {
        id: "farmer",
        accessorFn: (row) => row.farmer.name,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Farmer" />
        ),
        cell: ({ row }) => <FarmerHoverCard farmer={row.original.farmer} />,
    },
    {
        accessorKey: "engagementType",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Engagement type" />
        ),
        cell: ({ row }) => <div className="text-sm">{row.getValue("engagementType")}</div>,
    },
    {
        accessorKey: "village",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Village" />
        ),
        cell: ({ row }) => <div className="text-sm">{row.getValue("village")}</div>,
    },
    {
        accessorKey: "azs",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="AZs" />
        ),
        cell: ({ row }) => <div className="text-sm">{row.getValue("azs")}</div>,
    },
    {
        accessorKey: "surveyor",
        id: "surveyor",
        accessorFn: (row) => row.surveyor.name,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Surveyor" />
        ),
        cell: ({ row }) => <SurveyorHoverCard surveyor={row.original.surveyor} />,
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.original.status
            return (
                <Badge
                    variant={
                        status === "Verified" ? "default" :
                            status === "Invalid" ? "destructive" : "secondary"
                    }
                    className={`font-medium ${status === "Verified" ? "bg-green-500 hover:bg-green-600" :
                        status === "Pending" ? "bg-amber-500 hover:bg-amber-600 text-white" :
                            "bg-red-500 hover:bg-red-600"
                        }`}
                >
                    {status}
                </Badge>
            )
        },
    },
    {
        id: "verifiedBy",
        accessorFn: (row) => row.verified?.verifier,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Verified By" />
        ),
        cell: ({ row }) => {
            const verified = row.original.verified
            if (!verified) return <span className="text-muted-foreground">-</span>
            return <div className="text-sm font-medium">{verified.verifier}</div>
        },
    },
    {
        id: "verifiedOn",
        accessorFn: (row) => row.verified?.date,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Verified On" />
        ),
        cell: ({ row }) => {
            const verified = row.original.verified
            if (!verified) return <span className="text-muted-foreground">-</span>
            return <div className="text-sm">{format(verified.date, "dd MMM yy").toUpperCase()}</div>
        },
    },
]
