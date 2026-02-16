"use client"

import { ColumnDef } from "@tanstack/react-table"
import { EngagementRecord } from "../data/schema"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "./data-table-column-header"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
        cell: ({ row }) => {
            const farmer = row.original.farmer
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-800">
                        <AvatarImage src={farmer.avatar} alt={farmer.name} />
                        <AvatarFallback>{farmer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col leading-tight">
                        <span className="font-semibold text-sm">{farmer.name}</span>
                        <span className="text-xs text-muted-foreground">{farmer.id}</span>
                    </div>
                </div>
            )
        },
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
        cell: ({ row }) => {
            const surveyor = row.original.surveyor
            return (
                <div className="flex flex-col leading-tight">
                    <span className="font-semibold text-sm">{surveyor.name}</span>
                    <span className="text-xs text-muted-foreground">{surveyor.id}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "verified",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Verified" />
        ),
        cell: ({ row }) => {
            const verified = row.original.verified
            if (!verified) return null
            return (
                <div className="flex flex-col leading-tight">
                    <span className="font-semibold text-sm">{verified.verifier}</span>
                    <span className="text-xs text-muted-foreground">{format(verified.date, "dd MMM yy").toUpperCase()}</span>
                </div>
            )
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
        cell: ({ row }) => {
            const farmer = row.original.farmer
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-800">
                        <AvatarImage src={farmer.avatar} alt={farmer.name} />
                        <AvatarFallback>{farmer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col leading-tight">
                        <span className="font-semibold text-sm">{farmer.name}</span>
                        <span className="text-xs text-muted-foreground">{farmer.id}</span>
                    </div>
                </div>
            )
        },
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
        cell: ({ row }) => {
            const surveyor = row.original.surveyor
            return (
                <div className="flex flex-col leading-tight">
                    <span className="font-semibold text-sm">{surveyor.name}</span>
                    <span className="text-xs text-muted-foreground">{surveyor.id}</span>
                </div>
            )
        },
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
        accessorKey: "verified",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Verified By" />
        ),
        cell: ({ row }) => {
            const verified = row.original.verified
            if (!verified) return <span className="text-muted-foreground">-</span>
            return (
                <div className="flex flex-col leading-tight">
                    <span className="font-semibold text-sm">{verified.verifier}</span>
                    <span className="text-xs text-muted-foreground">{format(verified.date, "dd MMM yy").toUpperCase()}</span>
                </div>
            )
        },
    },
]
