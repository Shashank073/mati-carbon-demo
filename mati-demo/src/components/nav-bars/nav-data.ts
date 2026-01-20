
import {
    LayoutDashboard,
    ListTodo,
    BarChart3,
    History,
    Settings,
    LogOut,
    HelpCircle,
    Bug,
    User,
    Tractor,
    Warehouse,
    FlaskConical,
    Activity,
    Factory,
    FileText,
    TrendingUp,
    Map,
    ClipboardCheck,
    ClipboardList,
    Users,
    Leaf,
    Calendar
} from "lucide-react"

export type UserRole = "Verifier" | "Admin" | "HQ Verifier" | "HQ Admin";

export interface NavItem {
    title: string
    url: string
    icon?: any
    isActive?: boolean
    items?: {
        title: string
        url: string
    }[]
    roles?: UserRole[] // Roles that can see this item. If undefined, visible to all.
}

export const data = {
    user: {
        name: "Username",
        email: "Username@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    roles: [
        { value: "Verifier", label: "Verifier" },
        { value: "Admin", label: "Admin" },
        { value: "HQ Verifier", label: "HQ Verifier" },
        { value: "HQ Admin", label: "HQ Admin" },
    ],
    franchises: [
        { name: "Franchise A", logo: Factory, plan: "Enterprise" },
        { name: "Franchise B", logo: Factory, plan: "Startup" },
        { name: "Franchise C", logo: Factory, plan: "Free" },
    ],
    bases: [
        { name: "Base A", logo: Map, plan: "Standard" },
        { name: "Base B", logo: Map, plan: "Standard" },
        { name: "Base C", logo: Map, plan: "Standard" },
    ],
    villages: [
        { name: "All Villages" },
        { name: "Rampur" },
        { name: "Sonpur" },
        { name: "Lakhanpur" },
        { name: "Madhopur" },
        { name: "Kishanpur" },
    ],
    navMain: [
        {
            title: "Dashboard",
            url: "#",
            icon: LayoutDashboard,
            isActive: true, // Default active for Verifier
            roles: ["Verifier", "HQ Verifier"] as UserRole[],
            items: [
                { title: "Overview", url: "#" },
                { title: "Analytics", url: "#" },
            ],
        },
        {
            title: "Farm App",
            url: "#",
            icon: Tractor,
            isActive: true,
            roles: ["Verifier", "HQ Verifier"] as UserRole[],
            items: [
                { title: "Qualification", url: "#" },
                { title: "Deployment", url: "#" },
                { title: "Engagement", url: "#" },
                { title: "Conversation", url: "#" },
            ],
        },
        {
            title: "Warehouse App",
            url: "#",
            icon: Warehouse,
            roles: ["Verifier", "HQ Verifier"] as UserRole[],
            items: [
                { title: "Overview", url: "#" },
                { title: "Dispatched", url: "#" },
                { title: "Delivered", url: "#" },
                { title: "Dispatch QCs", url: "#" },
                { title: "Source QCs", url: "#" },
            ],
        },
        {
            title: "LAB App",
            url: "#",
            icon: FlaskConical,
            roles: ["Verifier", "HQ Verifier"] as UserRole[],
            items: [
                { title: "Overview", url: "#" },
                { title: "Samples", url: "#" },
                { title: "Shipments", url: "#" },
                { title: "Costs", url: "#" },
            ],
        },
        {
            title: "Supply & Demand",
            url: "#",
            icon: TrendingUp,
            roles: ["Verifier", "HQ Verifier"] as UserRole[],
            items: [
                { title: "Requests", url: "#" },
                { title: "History", url: "#" },
            ],
        },
        {
            title: "HSE",
            url: "#",
            icon: Activity,
            roles: ["Verifier", "HQ Verifier"] as UserRole[],
        },
        {
            title: "Quality System",
            url: "#",
            icon: ClipboardCheck,
            roles: ["Verifier", "HQ Verifier"] as UserRole[],
        },
        {
            title: "Reports",
            url: "#",
            icon: ClipboardList,
            roles: ["HQ Verifier"] as UserRole[],
        }
    ],
    admin: [
        {
            title: "Dashboard",
            url: "#",
            icon: LayoutDashboard,
            roles: ["Admin"] as UserRole[],
            items: [
                { title: "Overview", url: "#" },
                { title: "Track Logistics", url: "#" },
                { title: "Day End Report", url: "#" }
            ]
        },
        {
            title: "Planning",
            url: "#",
            icon: Calendar,
            roles: ["Admin"] as UserRole[],
            items: [
                { title: "Create Plan", url: "#" },
                { title: "Saved Plans", url: "#" },
                { title: "Completed plans", url: "#" }
            ]
        },
        {
            title: "Dashboard",
            url: "#",
            icon: LayoutDashboard,
            roles: ["HQ Admin"] as UserRole[],
            items: [
                { title: "Overview", url: "#" },
                { title: "Analytics", url: "#" },
            ]
        },
        {
            title: "User Management",
            url: "#",
            icon: User,
            roles: ["HQ Admin"] as UserRole[],
            items: [
                { title: "Users", url: "#" },
                { title: "Roles", url: "#" },
            ]
        },
        {
            title: "Global Settings",
            url: "#",
            icon: Settings,
            roles: ["HQ Admin"] as UserRole[],
            items: [
                { title: "General", url: "#" },
                { title: "Security", url: "#" },
            ]
        }
    ]
}

