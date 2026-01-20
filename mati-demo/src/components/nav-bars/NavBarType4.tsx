
"use client"

import * as React from "react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useSearchParams } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Search, Bell, HelpCircle, Bug, ChevronDown, ChevronRight,
    Leaf, Box, Truck, BarChart3, ShieldCheck, ClipboardCheck,
    Settings, LayoutDashboard, Star, MoreVertical, User, ClipboardList, Info, LogOut
} from "lucide-react"
import { MatiLogo } from "./components/mati-logo"
import { data } from "./nav-data"


export function NavBarType4({ children }: { children?: React.ReactNode }) {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <NavBarType4Content>{children}</NavBarType4Content>
        </React.Suspense>
    )
}

function NavBarType4Content({ children }: { children?: React.ReactNode }) {
    // Navigation structure based on the reference image
    const navStructure = [
        {
            label: "Verifier",
            items: [
                {
                    title: "Farm app",
                    icon: Leaf,
                    isActive: true, // Parent active
                    items: [
                        { title: "Qualification", url: "#", isActive: true }, // Child active
                        { title: "Deployment", url: "#" },
                        { title: "Engagement", url: "#" },
                        { title: "Conversation", url: "#" },
                    ],
                },
                {
                    title: "Warehouse app",
                    icon: Box,
                    items: [
                        { title: "Overview", url: "#" },
                        { title: "Dispatched", url: "#" },
                    ],
                },
                {
                    title: "LAD app",
                    icon: Truck,
                    items: [
                        { title: "Overview", url: "#" },
                        { title: "Samples", url: "#" },
                    ],
                },
                {
                    title: "Supply & Demand",
                    icon: BarChart3,
                    items: [
                        { title: "Requests", url: "#" },
                        { title: "History", url: "#" },
                    ],
                },
                {
                    title: "HSE",
                    icon: ShieldCheck,
                    items: []
                },
                {
                    title: "Quality System",
                    icon: ClipboardCheck,
                    items: []
                },
            ]
        },
        {
            label: "Admin",
            items: [
                {
                    title: "Dashboard",
                    icon: LayoutDashboard,
                    items: [
                        { title: "Overview", url: "#" },
                        { title: "Track Logistics", url: "#" },
                    ]
                },
                {
                    title: "Planning",
                    icon: Settings,
                    items: [
                        { title: "Create Plan", url: "#" },
                        { title: "Saved Plans", url: "#" },
                    ]
                },
            ]
        },
        {
            label: "HQ Verifier",
            items: [
                {
                    title: "Dashboard",
                    icon: LayoutDashboard,
                    items: [
                        { title: "Overview", url: "#" },
                        { title: "Analytics", url: "#" },
                    ]
                },
                {
                    title: "Reports",
                    icon: ClipboardList,
                    items: []
                },
            ]
        },
        {
            label: "HQ Admin",
            items: [
                {
                    title: "User Management",
                    icon: User,
                    items: [
                        { title: "Users", url: "#" },
                        { title: "Roles", url: "#" },
                    ]
                },
                {
                    title: "Global Settings",
                    icon: Settings,
                    items: [
                        { title: "General", url: "#" },
                        { title: "Security", url: "#" },
                    ]
                },
            ]
        }
    ]

    const [activeFranchise, setActiveFranchise] = React.useState(data.franchises[0])
    const [activeBase, setActiveBase] = React.useState(data.bases[0])

    // Role based filtering
    const searchParams = useSearchParams()
    const rolesParam = searchParams.get('roles')
    const selectedRoles = rolesParam ? rolesParam.split(',') : null

    // Filter navStructure based on selected roles
    // If no roles selected (e.g. direct access), show all (or could show none/default)
    // Here we show all if no filtering is applied, basically legacy behavior.
    const filteredNav = selectedRoles
        ? navStructure.filter(group => selectedRoles.includes(group.label))
        : navStructure

    const [baseSearch, setBaseSearch] = React.useState("")

    return (
        <SidebarProvider>
            <Sidebar collapsible="icon">
                <SidebarHeader className="h-14 flex items-center justify-center border-b">
                    {/* Default Logo Option */}
                    <div className="flex items-center gap-2 font-bold w-full px-2">
                        <div className="h-6 w-6 shrink-0 bg-zinc-900 rounded-md flex items-center justify-center text-white">
                            <Leaf className="h-4 w-4" />
                        </div>
                        <span className="truncate group-data-[collapsible=icon]:hidden">Mati Inc.</span>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    {filteredNav.map((group) => (
                        <SidebarGroup key={group.label}>
                            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    item.items && item.items.length > 0 ? (
                                        <Collapsible
                                            key={item.title}
                                            asChild
                                            defaultOpen={item.isActive}
                                            className="group/collapsible"
                                        >
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
                                                        {item.icon && <item.icon />}
                                                        <span>{item.title}</span>
                                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        {item.items.map((subItem) => (
                                                            <SidebarMenuSubItem key={subItem.title}>
                                                                <SidebarMenuSubButton asChild isActive={(subItem as any).isActive}>
                                                                    <a href={subItem.url}>
                                                                        <span>{subItem.title}</span>
                                                                    </a>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        ))}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    ) : (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton tooltip={item.title}>
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                ))}
                            </SidebarMenu>
                        </SidebarGroup>
                    ))}
                </SidebarContent>
                {/* Implicit Footer (User Profile) - kept simple as per standard sidebar practices if not explicitly different in sidebar image */}
                <SidebarRail />
            </Sidebar>
            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-background px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">

                    {/* Left: Context Switchers & Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-foreground">
                        <SidebarTrigger className="-ml-1" />

                        {/* Franchise Switcher - Simple List */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-1 font-medium hover:text-foreground/80 outline-none">
                                    <div className="h-4 w-4 mr-1 flex items-center justify-center">
                                        <Leaf className="h-4 w-4 text-green-700" />
                                    </div>
                                    {activeFranchise.name}
                                    <ChevronDown className="h-3 w-3 opacity-50" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-[200px] p-2">
                                <DropdownMenuLabel className="text-muted-foreground font-normal text-xs mb-2">Franchises</DropdownMenuLabel>
                                {data.franchises.map(f => (
                                    <DropdownMenuItem key={f.name} onClick={() => setActiveFranchise(f)} className="cursor-pointer py-2">
                                        {f.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Separator orientation="vertical" className="h-4 rotate-[20deg]" />

                        {/* Base Switcher - Search + List */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground outline-none">
                                    {activeBase.name}
                                    <ChevronDown className="h-3 w-3 opacity-50" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-[240px] p-2">
                                <div className="px-2 pb-2">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                                        <Input
                                            placeholder="Search"
                                            className="h-8 pl-7 text-xs bg-muted/50"
                                            value={baseSearch}
                                            onChange={(e) => setBaseSearch(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <DropdownMenuLabel className="text-muted-foreground font-normal text-xs px-2 mt-2">Base</DropdownMenuLabel>
                                {data.bases.filter(b => b.name.toLowerCase().includes(baseSearch.toLowerCase())).map(b => (
                                    <DropdownMenuItem key={b.name} onClick={() => setActiveBase(b)} className="cursor-pointer py-2 px-2">
                                        {b.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Separator orientation="vertical" className="h-4 rotate-[20deg]" />

                        {/* Breadcrumbs */}
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">Link page 1</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="rotate-[20deg]">
                                    <Separator orientation="vertical" className="h-4" />
                                </BreadcrumbSeparator>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">Link page 2</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="rotate-[20deg]">
                                    <Separator orientation="vertical" className="h-4" />
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Current page</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>


                    {/* Right: Search & Actions */}
                    <div className="flex items-center gap-2">
                        <div className="relative hidden lg:block">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="w-64 pl-8 h-9 bg-background focus-visible:ring-1"
                            />
                        </div>

                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <Star className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <Star className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <Star className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Option 1</DropdownMenuItem>
                                <DropdownMenuItem>Option 2</DropdownMenuItem>
                                <DropdownMenuItem>Option 3</DropdownMenuItem>
                                <DropdownMenuItem>Option 4</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="ml-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="h-8 w-8 border cursor-pointer hover:ring-2 hover:ring-offset-2 transition-all">
                                        <AvatarImage src={data.user.avatar} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 p-2">
                                    {/* Header matching image */}
                                    <div className="flex items-center gap-3 p-2 mb-2 border-b pb-4">
                                        <Avatar className="h-10 w-10 border">
                                            <AvatarImage src={data.user.avatar} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm">{data.user.name}</span>
                                            <span className="text-xs text-muted-foreground">{data.user.email}</span>
                                        </div>
                                    </div>

                                    {/* Items matching image */}
                                    <DropdownMenuItem className="gap-3 p-2 cursor-pointer">
                                        <div className="h-4 w-4 flex items-center justify-center"><User className="h-4 w-4" /></div>
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-3 p-2 cursor-pointer">
                                        <div className="h-4 w-4 flex items-center justify-center"><ClipboardList className="h-4 w-4" /></div>
                                        Manage
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-3 p-2 cursor-pointer">
                                        <div className="h-4 w-4 flex items-center justify-center"><HelpCircle className="h-4 w-4" /></div>
                                        Help
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-3 p-2 cursor-pointer">
                                        <div className="h-4 w-4 flex items-center justify-center"><Bug className="h-4 w-4" /></div>
                                        Report a bug
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-3 p-2 cursor-pointer">
                                        <div className="h-4 w-4 flex items-center justify-center"><Info className="h-4 w-4" /></div>
                                        About us
                                    </DropdownMenuItem>

                                    <Separator className="my-2" />

                                    <DropdownMenuItem className="gap-3 p-2 cursor-pointer text-red-600 focus:text-red-700">
                                        <div className="h-4 w-4 flex items-center justify-center"><LogOut className="h-4 w-4" /></div>
                                        Log out
                                    </DropdownMenuItem>

                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-muted/5">
                    {children || (
                        <div className="p-8 flex items-center justify-center text-muted-foreground h-full border border-dashed rounded-lg m-4">
                            Content Area
                        </div>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
