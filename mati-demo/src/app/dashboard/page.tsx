"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LogOut,
    CheckCircle,
    Settings,
    Shield,
    LayoutDashboard,
    Users,
    ExternalLink
} from "lucide-react";

const PORTALS = [
    { name: "MATI Verifier", icon: CheckCircle },
    { name: "MATI Admin", icon: Settings },
    { name: "MATI HQ Verifier", icon: Shield },
    { name: "MATI HQ Admin", icon: LayoutDashboard },
    { name: "Customer portal", icon: Users },
];

export default function DashboardPage() {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        // Simple auth check
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserEmail(user.email);
            } else {
                // Optional: Redirect if not logged in, but for demo we might want to just show empty state or allow direct access
                // router.push("/");
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("User logged out");
            router.push("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handlePortalClick = (portalName: string) => {
        console.log(`Navigating to [${portalName}]`);
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
            {/* Header */}
            <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mx-auto flex max-w-6xl items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-mati-gold/20 flex items-center justify-center">
                            <span className="text-mati-gold font-bold">M</span>
                        </div>
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Mati Carbon</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="hidden text-sm text-zinc-500 sm:inline-block">
                            {userEmail}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                            className="border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-6xl p-6">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Your Portals</h2>
                    <p className="text-zinc-500">Select a portal to continue your work</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {PORTALS.map((portal) => {
                        const Icon = portal.icon;
                        return (
                            <Card
                                key={portal.name}
                                className="group cursor-pointer transition-all hover:shadow-md hover:border-mati-gold/50"
                                onClick={() => handlePortalClick(portal.name)}
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-zinc-500 group-hover:text-mati-gold transition-colors">
                                        Application
                                    </CardTitle>
                                    <Icon className="h-4 w-4 text-zinc-400 group-hover:text-mati-gold transition-colors" />
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                            {portal.name}
                                        </div>
                                        <ExternalLink className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 text-mati-gold" />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
