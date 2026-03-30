import { Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronDown, ChevronsUpDown, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>
    title: string
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn("text-sm font-semibold text-zinc-900 dark:text-zinc-100 px-1", className)}>{title}</div>
    }

    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8 data-[state=open]:bg-accent group/header hover:bg-transparent data-[state=open]:hover:bg-accent"
                    >
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover/header:text-zinc-900 transition-colors">{title}</span>
                        {column.getIsSorted() === "desc" ? (
                            <ArrowDown className="ml-2 h-3.5 w-3.5 text-zinc-900" />
                        ) : column.getIsSorted() === "asc" ? (
                            <ArrowUp className="ml-2 h-3.5 w-3.5 text-zinc-900" />
                        ) : (
                            <ChevronDown className={cn(
                                "ml-1 h-3.5 w-3.5 transition-all",
                                "opacity-0 group-hover/header:opacity-100 group-data-[state=open]/header:opacity-100",
                                "group-data-[state=open]/header:rotate-180 text-zinc-400 group-data-[state=open]/header:text-zinc-900"
                            )} />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" onCloseAutoFocus={(e) => e.preventDefault()}>
                    <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                        <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                        <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Desc
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                        <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Hide
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
